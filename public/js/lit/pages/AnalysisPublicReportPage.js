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

export class AnalysisPublicReportPage extends LitElement {
    static properties = {
        _hsHn24Data: { state: true },
        _tempData: { state: true },
        _windData: { state: true },
        _weatherGridData: { state: true },
        _avalancheGridData: { state: true },
        _dangerGridData: { state: true },
        _newsGridData: { state: true }
    };

    constructor() {
        super();
        this._hsHn24Data = { hs: [], hn24: [] };
        this._tempData = { max: [], min: [], present: [] };
        this._windData = [];
        this._weatherGridData = [];
        this._avalancheGridData = [];
        this._dangerGridData = [];
        this._newsGridData = [];
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
            // Parallel fetch for Weather, Avalanche, Danger, News
            const [weatherResp, avalancheResp, dangerResp, newsResp] = await Promise.all([
                fetch('/json/entity_query_all/?entity=Observation&subtype=weather_standard&limit=50'),
                fetch('/json/entity_query_all/?entity=Observation&subtype=avalanche_event&limit=50'),
                fetch('/json/entity_query_all/?entity=Observation&subtype=danger_rating&limit=50'),
                fetch('/json/entity_query_all/?entity=Observation&subtype=news_item&limit=50')
            ]);

            const weatherJson = await weatherResp.json();
            const avalancheJson = await avalancheResp.json();
            const dangerJson = await dangerResp.json();
            const newsJson = await newsResp.json();

            if (weatherJson && weatherJson.success) this._processWeatherData(weatherJson.rows || []);
            if (avalancheJson && avalancheJson.success) this._processAvalancheData(avalancheJson.rows || []);
            if (dangerJson && dangerJson.success) this._processDangerData(dangerJson.rows || []);
            if (newsJson && newsJson.success) this._processNewsData(newsJson.rows || []);

        } catch (e) {
            console.error('Network error loading public report data:', e);
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
        this._avalancheGridData = rows.map(r => ({
            id: r.id,
            date: r.date_time_start ? new Date(r.date_time_start).toLocaleString() : '',
            operation: r.operation_name || 'My Operation',
            location: r.location || 'Unknown',
            type: r.avalanche_type || '-',
            size: r.size_r || '-',
            trigger: r.trigger_type || '-'
        }));
    }

    _processDangerData(rows) {
        this._dangerGridData = rows.map(r => ({
            id: r.id,
            date: r.date_time_start ? new Date(r.date_time_start).toLocaleString() : '',
            operation: r.operation_name || '-',
            location: r.location || 'Region',
            alpine: r.danger_alpine || '-',
            treeline: r.danger_treeline || '-',
            below: r.danger_below || '-'
        }));
    }

    _processNewsData(rows) {
        this._newsGridData = rows.map(r => ({
            id: r.id,
            date: r.date_time_start ? new Date(r.date_time_start).toLocaleString() : '',
            operation: r.operation_name || '-',
            location: r.location || '-',
            notable: 'Yes',
            description: r.comments || r.news_story || r.description || '-'
        }));
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Public Report">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Public', value: 'public' }]}"
                        selectedMode="public"
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
                        <powdercloud-tab label="Danger">
                            <powdercloud-dashboard-grid
                                title="Danger Ratings"
                                .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Alpine', field: 'alpine' },
                { header: 'Treeline', field: 'treeline' },
                { header: 'Below TL', field: 'below' }
            ]}"
                                .data="${this._dangerGridData}"
                                paginated
                            ></powdercloud-dashboard-grid>
                        </app-tab>
                        <powdercloud-tab label="News">
                            <powdercloud-dashboard-grid
                                title="News Records"
                                .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Notable', field: 'notable' },
                { header: 'Description', field: 'description', width: '50%' }
            ]}"
                                .data="${this._newsGridData}"
                                paginated
                            ></powdercloud-dashboard-grid>
                        </app-tab>
                    </powdercloud-tabs>

                </powdercloud-container>
        `;
    }
}

customElements.define('analysis-public-report-page', AnalysisPublicReportPage);
