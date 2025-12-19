import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudLayout.js';
import '../utils/PowdercloudFilterPanel.js';
import '../utils/PowdercloudDashboardChart.js';
import '../utils/PowdercloudDashboardGrid.js';
import '../layout/PowdercloudContainer.js';
import '../layout/PowdercloudGrid.js';
import '../containment/PowdercloudCard.js';

export class AnalysisDangerPage extends LitElement {
    static properties = {
        _dangerChartData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._dangerChartData = { alpine: [], treeline: [], belowTreeline: [] };
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
            // Fetch 'Observation' entity, subtype 'danger_rating', limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=danger_rating&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                console.error('Failed to load danger analysis data:', json);
            }
        } catch (e) {
            console.error('Network error loading danger analysis data:', e);
        }
    }

    _processData(rows) {
        // Prepare Chart Data
        const alpine = [], treeline = [], below = [];

        // Helper to convert rate string to number 1-5
        const rateToNum = (r) => {
            if (!r) return 0;
            const rL = r.toLowerCase();
            if (rL.includes('low')) return 1;
            if (rL.includes('mod')) return 2;
            if (rL.includes('consab')) return 3; // 'considerable' often abbrev
            if (rL.includes('high')) return 4;
            if (rL.includes('extr')) return 5;
            // Fallback: try parsing number
            const n = parseInt(r);
            return isNaN(n) ? 0 : n;
        };

        const gridData = rows.map(row => {
            const dateStr = row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '';
            const timestamp = row.date_time_start ? new Date(row.date_time_start).getTime() : 0;

            // Populate Chart
            if (timestamp) {
                // Assuming field names like 'rating_alp', 'rating_tln', 'rating_btl' 
                // Adjust based on real schema if known, usually keys map to ExtJS names
                const rA = row.rating_alp_am || row.rating_alp_pm || '0';
                const rT = row.rating_tln_am || row.rating_tln_pm || '0';
                const rB = row.rating_btl_am || row.rating_btl_pm || '0';

                alpine.push([timestamp, rateToNum(rA)]);
                treeline.push([timestamp, rateToNum(rT)]);
                below.push([timestamp, rateToNum(rB)]);
            }

            return {
                id: row.id,
                date: dateStr,
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Overview',
                alpine: row.rating_alp_am || '-',
                treeline: row.rating_tln_am || '-',
                below: row.rating_btl_am || '-',
                trend: row.danger_trend || '-'
            };
        });

        this._dangerChartData = {
            alpine: alpine.sort((a, b) => a[0] - b[0]),
            treeline: treeline.sort((a, b) => a[0] - b[0]),
            belowTreeline: below.sort((a, b) => a[0] - b[0])
        };
        this._gridData = gridData;
    }



    render() {
        return html`
            <powdercloud-layout pageTitle="Danger Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Danger', value: 'danger' }]}"
                        selectedMode="danger"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-card title="Danger Ratings Overview">
                        <powdercloud-dashboard-chart
                            title="Danger Ratings Over Time"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Danger Level' },
                    categories: ['', 'Low', 'Moderate', 'Considerable', 'High', 'Extreme'],
                    min: 1, max: 5
                },
                series: [
                    { name: 'Alpine', data: this._dangerChartData.alpine, color: '#FF0000' },
                    { name: 'Treeline', data: this._dangerChartData.treeline, color: '#FFA500' },
                    { name: 'Below Treeline', data: this._dangerChartData.belowTreeline, color: '#FFFF00' }
                ]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <br />

                    <powdercloud-dashboard-grid
                        title="Danger Records"
                        .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Alpine', field: 'alpine' },
                { header: 'Treeline', field: 'treeline' },
                { header: 'Below TL', field: 'below' },
                { header: 'Trend', field: 'trend' }
            ]}"
                        .data="${this._gridData}"
                        paginated
                    ></powdercloud-dashboard-grid>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-danger-page', AnalysisDangerPage);
