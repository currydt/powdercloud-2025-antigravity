import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudLayout.js';
import '../components/PowdercloudFilterPanel.js';
import '../components/PowdercloudDashboardChart.js';
import '../components/PowdercloudDashboardGrid.js';
import '../components/PowdercloudContainer.js';
import '../components/PowdercloudGrid.js';
import '../components/PowdercloudCard.js';
import '../components/PowdercloudAvalancheRose.js';
import '../components/PowdercloudTabs.js';

export class AnalysisCommunitySummaryPage extends LitElement {
    static properties = {
        _hsHn24Data: { state: true },
        _tempData: { state: true },
        _windData: { state: true },
        _failureTypeData: { state: true },
        _triggerTypeData: { state: true },
        _weatherGridData: { state: true },
        _avalancheGridData: { state: true }
    };

    constructor() {
        super();
        this._hsHn24Data = { hs: [], hn24: [] };
        this._tempData = { max: [], min: [], present: [] };
        this._windData = [];
        this._failureTypeData = [];
        this._triggerTypeData = [];
        this._weatherGridData = [];
        this._avalancheGridData = [];
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
            // Parallel fetch for Weather and Avalanche data
            const [weatherResp, avalancheResp] = await Promise.all([
                fetch('/json/entity_query_all/?entity=Observation&subtype=weather_standard&limit=100'),
                fetch('/json/entity_query_all/?entity=Observation&subtype=avalanche_event&limit=100')
            ]);

            const weatherJson = await weatherResp.json();
            const avalancheJson = await avalancheResp.json();

            if (weatherJson && weatherJson.success) this._processWeatherData(weatherJson.rows || []);
            if (avalancheJson && avalancheJson.success) this._processAvalancheData(avalancheJson.rows || []);

        } catch (e) {
            console.error('Network error loading community summary data:', e);
        }
    }

    _processWeatherData(rows) {
        const hs = [], hn24 = [], max = [], min = [], present = [], wind = [];
        const windMap = { 'C': 0, 'L': 1, 'M': 2, 'S': 3, 'G': 4, 'X': 5 };

        rows.forEach(row => {
            if (row.date_time_start) {
                const ts = new Date(row.date_time_start).getTime();

                // Charts
                if (row.snowpack_height) hs.push([ts, parseFloat(row.snowpack_height) || 0]);
                if (row.new_snow_24) hn24.push([ts, parseFloat(row.new_snow_24) || 0]);

                if (row.temp_max) max.push([ts, parseFloat(row.temp_max)]);
                if (row.temp_min) min.push([ts, parseFloat(row.temp_min)]);
                if (row.temp_present) present.push([ts, parseFloat(row.temp_present)]);

                const wS = row.wind_speed ? row.wind_speed.charAt(0).toUpperCase() : 'C';
                if (windMap.hasOwnProperty(wS)) wind.push([ts, windMap[wS]]);
            }
        });

        this._weatherGridData = rows.map(r => ({
            id: r.id,
            date: r.date_time_start ? new Date(r.date_time_start).toLocaleString() : '',
            location: r.location || 'Standard Plot',
            temp: r.temp_present || '-',
            wind: r.wind_speed || '-',
            sky: r.sky_condition || '-',
            precip: r.precipitation || '-'
        }));

        this._hsHn24Data = { hs: hs.sort((a, b) => a[0] - b[0]), hn24: hn24.sort((a, b) => a[0] - b[0]) };
        this._tempData = { max: max.sort((a, b) => a[0] - b[0]), min: min.sort((a, b) => a[0] - b[0]), present: present.sort((a, b) => a[0] - b[0]) };
        this._windData = wind.sort((a, b) => a[0] - b[0]);
    }

    _processAvalancheData(rows) {
        // Aggregate for Charts
        const failMap = { 'S': 0, 'L': 0, 'LS': 0, 'C': 0, 'CS': 0, 'I': 0, 'IS': 0 };
        const failKeys = Object.keys(failMap);
        const trigMap = { 'N': 0, 'X': 0, 'S': 0, 'B': 0, 'C': 0, 'M': 0, 'V': 0, 'H': 0, 'O': 0, 'U': 0 };
        const trigKeys = Object.keys(trigMap);

        rows.forEach(row => {
            const f = row.weak_layer_crystal_type || '';
            if (failKeys.includes(f)) failMap[f]++;

            const t = row.trigger_type || '';
            if (trigKeys.includes(t)) trigMap[t]++;
        });

        this._avalancheGridData = rows.map(r => ({
            id: r.id,
            date: r.date_time_start ? new Date(r.date_time_start).toLocaleString() : '',
            operation: r.operation_name || 'My Operation',
            location: r.location || 'Unknown',
            type: r.avalanche_type || '-',
            size: r.size_r || '-',
            trigger: r.trigger_type || '-'
        }));

        this._failureTypeData = failKeys.map(k => failMap[k]);
        this._triggerTypeData = trigKeys.map(k => trigMap[k]);
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Community Summary">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Community', value: 'community' }]}"
                        selectedMode="community"
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
                    { name: 'Present', data: this._tempData.present, color: '#4572A7' },
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

                        <powdercloud-card title="Avalanche Rose">
                            <div style="height: 300px; display: flex; justify-content: center; align-items: center;">
                                <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                            </div>
                        </powdercloud-card>

                        <powdercloud-card title="Failure Types">
                            <powdercloud-dashboard-chart
                                title="Failure Types"
                                type="bar"
                                .options="${{
                xAxis: { categories: ['S', 'L', 'LS', 'C', 'CS', 'I', 'IS'] },
                yAxis: { title: { text: null } },
                series: [{ name: 'Count', data: this._failureTypeData, color: '#AA4643' }]
            }}"
                            ></powdercloud-dashboard-chart>
                        </powdercloud-card>

                        <powdercloud-card title="Trigger Types">
                            <powdercloud-dashboard-chart
                                title="Trigger Types"
                                type="bar"
                                .options="${{
                xAxis: { categories: ['N', 'X', 'S', 'B', 'C', 'M', 'V', 'H', 'O', 'U'] },
                yAxis: { title: { text: null } },
                series: [{ name: 'Count', data: this._triggerTypeData, color: '#89A54E' }]
            }}"
                            ></powdercloud-dashboard-chart>
                        </powdercloud-card>
                    </powdercloud-grid>

                    <br />

                    <powdercloud-tabs>
                        <powdercloud-tab label="Weather" active>
                            <powdercloud-dashboard-grid
                                title="Weather Observations"
                                .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Temp (°C)', field: 'temp' },
                { header: 'Wind', field: 'wind' },
                { header: 'Sky', field: 'sky' },
                { header: 'Precip', field: 'precip' }
            ]}"
                                .data="${this._weatherGridData}"
                                paginated
                            ></powdercloud-dashboard-grid>
                        </app-tab>
                        <powdercloud-tab label="Avalanches">
                            <powdercloud-dashboard-grid
                                title="Avalanche Observations"
                                .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Size', field: 'size' },
                { header: 'Trigger', field: 'trigger' }
            ]}"
                                .data="${this._avalancheGridData}"
                                paginated
                            ></powdercloud-dashboard-grid>
                        </app-tab>
                    </powdercloud-tabs>

                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-community-summary-page', AnalysisCommunitySummaryPage);
