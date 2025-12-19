import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudFilterPanel.js';
import '../components/PowdercloudDashboardChart.js';
import '../components/PowdercloudDashboardGrid.js';
import '../components/PowdercloudContainer.js';
import '../components/PowdercloudGrid.js';
import '../components/PowdercloudCard.js';

import '../components/PowdercloudLayout.js';

export class AnalysisAvalancheActivityPage extends LitElement {
    static properties = {
        _chartData: { state: true },
        _failureTypeData: { state: true },
        _triggerTypeData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._chartData = [];
        this._failureTypeData = [];
        this._triggerTypeData = [];
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
            // Fetch 'Observation' entity, subtype 'avalanche_event', limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=avalanche_event&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                console.error('Failed to load avalanche analysis data:', json);
            }
        } catch (e) {
            console.error('Network error loading avalanche analysis data:', e);
        }
    }

    _processData(rows) {
        // 1. Time Series Data (Count per day)
        // Group by Date (YYYY-MM-DD)
        const countsByDate = {};
        rows.forEach(row => {
            if (row.date_time_start) {
                const date = new Date(row.date_time_start);
                date.setHours(0, 0, 0, 0);
                const time = date.getTime();
                countsByDate[time] = (countsByDate[time] || 0) + 1;
            }
        });
        // Convert to array [timestamp, count] and sort
        const chartData = Object.entries(countsByDate)
            .map(([ts, count]) => [parseInt(ts), count])
            .sort((a, b) => a[0] - b[0]);

        // 2. Failure Types
        // Map 'weak_layer_crystal_type' or similar
        const failMap = { 'S': 0, 'L': 0, 'LS': 0, 'C': 0, 'CS': 0, 'I': 0, 'IS': 0 };
        const failKeys = Object.keys(failMap);

        // 3. Trigger Types
        // Map 'trigger_type'
        const trigMap = { 'N': 0, 'X': 0, 'S': 0, 'B': 0, 'C': 0, 'M': 0, 'V': 0, 'H': 0, 'O': 0, 'U': 0 };
        const trigKeys = Object.keys(trigMap);

        // 4. Grid Data
        const gridData = rows.map(row => {
            // Aggregate check
            const fail = row.weak_layer_crystal_type || '';
            /* Rudimentary mock check for matching keys or just incrementing if found in text */
            if (failKeys.includes(fail)) failMap[fail]++;

            const trig = row.trigger_type || '';
            if (trigKeys.includes(trig)) trigMap[trig]++;

            return {
                id: row.id,
                date: row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '',
                operation: row.operation_name || 'My Operation', // Mock if missing
                location: row.terrain_desc || row.location || 'Unknown',
                type: row.avalanche_type || '-',
                size: row.size_r || row.size_d || '-',
                trigger: trig
            };
        });

        this._chartData = chartData;
        this._failureTypeData = failKeys.map(k => failMap[k]);
        this._triggerTypeData = trigKeys.map(k => trigMap[k]);
        this._gridData = gridData;
    }



    render() {
        return html`
            <powdercloud-layout pageTitle="Avalanche Activity Analysis">
                <powdercloud-container>

                <powdercloud-filter-panel 
                    .modes="${[{ label: 'Operation', value: 'operation' }]}"
                    selectedMode="operation"
                    showDateRange
                ></powdercloud-filter-panel>

                <br />

                <powdercloud-card title="Avalanche Activity Overview">
                    <powdercloud-dashboard-chart
                        title="Number of Avalanches"
                        type="column"
                        .options="${{
                xAxis: { type: 'datetime' },
                yAxis: { title: { text: 'Count' } },
                series: [{ name: 'Avalanches', data: this._chartData, color: '#4572A7' }]
            }}"
                    ></powdercloud-dashboard-chart>
                </powdercloud-card>

                <br />

                <powdercloud-grid cols="2" gap="lg">
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

                <powdercloud-dashboard-grid
                    title="Avalanche Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Size', field: 'size' },
                { header: 'Trigger', field: 'trigger' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></powdercloud-dashboard-grid>
            </powdercloud-container>
        </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-avalanche-activity-page', AnalysisAvalancheActivityPage);
