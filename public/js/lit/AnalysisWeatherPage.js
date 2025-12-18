import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudFilterPanel.js';
import './components/PowdercloudDashboardChart.js';
import './components/PowdercloudDashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudAvalancheRose.js';

export class AnalysisWeatherPage extends LitElement {
    static properties = {
        _hsHn24Data: { state: true },
        _tempData: { state: true },
        _windData: { state: true },
        _skyData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._hsHn24Data = { hs: [], hn24: [] };
        this._tempData = { max: [], min: [] };
        this._windData = [];
        this._skyData = [];
        this._gridData = [];
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchData();
    }

    async _fetchData() {
        try {
            // Fetch 'Observation' entity, subtype 'weather_standard' (or 'weather_basic'), limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=weather_standard&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                console.error('Failed to load weather data:', json);
            }
        } catch (e) {
            console.error('Network error loading weather data:', e);
        }
    }

    _processData(rows) {
        // Prepare chart arrays
        const hsData = [], hn24Data = [];
        const tMaxData = [], tMinData = [];
        const windData = [], skyData = [];

        // Prepare grid data
        const gridData = rows.map(row => {
            const dateStr = row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '';
            const timestamp = row.date_time_start ? new Date(row.date_time_start).getTime() : 0;

            // Populate Chart Data (if valid numbers)
            if (timestamp) {
                // HS/HN24
                const hs = parseFloat(row.snowpack_depth);
                if (!isNaN(hs)) hsData.push([timestamp, hs]);

                // Temp
                const airTemp = parseFloat(row.air_temp);
                // Note: Standard weather usually has one air temp or max/min. Using mock fallback logic for min/max if not discrete.
                if (!isNaN(airTemp)) {
                    tMaxData.push([timestamp, airTemp]);
                    tMinData.push([timestamp, airTemp - 5]); // Fallback mock spread
                }

                // Wind (Mock mapping for now as string -> number is tricky without lookup)
                // row.wind_speed_avg might be 'L', 'M' etc.
                windData.push([timestamp, 2]); // DUMMY default

                // Sky
                // row.sky_condition might be 'OVC'
                skyData.push([timestamp, 2]); // DUMMY default
            }

            return {
                date: dateStr,
                location: row.terrain_desc || 'Unknown',
                temp: row.air_temp || '-',
                wind: row.wind_speed_avg || '-',
                sky: row.sky_condition || '-',
                precip: row.precipitation_type || '-',
                hs: row.snowpack_depth || '-',
                hn24: '-' // Not always in standard set, maybe add to fieldset
            };
        });

        // Update state
        this._hsHn24Data = { hs: hsData.sort((a, b) => a[0] - b[0]), hn24: hn24Data.sort((a, b) => a[0] - b[0]) };
        this._tempData = { max: tMaxData.sort((a, b) => a[0] - b[0]), min: tMinData.sort((a, b) => a[0] - b[0]) };
        this._windData = windData.sort((a, b) => a[0] - b[0]);
        this._skyData = skyData.sort((a, b) => a[0] - b[0]);
        this._gridData = gridData;
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Weather Analysis
                </h1>

                <powdercloud-filter-panel 
                    .modes="${[{ label: 'Weather', value: 'weather' }]}"
                    selectedMode="weather"
                    showDateRange
                ></powdercloud-filter-panel>

                <br />

                <powdercloud-grid cols="2" gap="lg">
                    <powdercloud-card title="HS & HN24">
                        <powdercloud-dashboard-chart
                            title="Snow Height"
                            type="column"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: { title: { text: 'cm' } },
                series: [
                    { name: 'HS', data: this._hsHn24Data.hs, color: '#4572A7' },
                    { name: 'HN24', data: this._hsHn24Data.hn24, color: '#89A54E' }
                ]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Temperature Range">
                        <powdercloud-dashboard-chart
                            title="Temperature"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: { title: { text: '°C' } },
                series: [
                    { name: 'Max', data: this._tempData.max, color: '#AA4643' },
                    { name: 'Min', data: this._tempData.min, color: '#89A54E' }
                ]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Wind Speed">
                        <powdercloud-dashboard-chart
                            title="Wind Speed"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Speed' },
                    categories: ['C', 'L', 'M', 'S', 'G', 'X'],
                    min: 0, max: 5
                },
                series: [{ name: 'Wind', data: this._windData, color: '#4572A7' }]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Sky Conditions">
                        <powdercloud-dashboard-chart
                            title="Sky Conditions"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Condition' },
                    categories: ['X', 'OVC', 'BKN', 'SCT', 'FEW', 'CLR'],
                    min: 0, max: 5
                },
                series: [{ name: 'Sky', data: this._skyData, color: '#4572A7' }]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Avalanche Rose (Weather)" style="grid-column: span 2;">
                        <div style="height: 400px; display: flex; justify-content: center; align-items: center;">
                            <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                        </div>
                    </powdercloud-card>
                </powdercloud-grid>

                <br />

                <powdercloud-dashboard-grid
                    title="Weather Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Temp (°C)', field: 'temp' },
                { header: 'Wind', field: 'wind' },
                { header: 'Sky', field: 'sky' },
                { header: 'Precip', field: 'precip' },
                { header: 'HS', field: 'hs' },
                { header: 'HN24', field: 'hn24' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></powdercloud-dashboard-grid>
            </powdercloud-container>
        `;
    }
}

customElements.define('analysis-weather-page', AnalysisWeatherPage);
