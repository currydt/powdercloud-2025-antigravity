import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudLayout.js';
import '../utils/PowdercloudFilterPanel.js';
import '../utils/PowdercloudDashboardChart.js';
import '../utils/PowdercloudDashboardGrid.js';
import '../layout/PowdercloudContainer.js';
import '../layout/PowdercloudGrid.js';
import '../containment/PowdercloudCard.js';

export class AnalysisStabilityPage extends LitElement {
    static properties = {
        _stabilityChartData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._stabilityChartData = { alpine: [], treeline: [], belowTreeline: [] };
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
            // Fetch 'Observation' entity, subtype 'snowpack_stability' (guessing subtype), limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=snowpack_stability&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                // Fallback to try 'stability' if subtype name is different
                console.warn('Failed to load stability data, retrying with subtype=stability...');
                const retryParams = new URLSearchParams({ entity: 'Observation', subtype: 'stability', limit: 100 });
                const retryResp = await fetch(`/json/entity_query_all/?${retryParams}`);
                const retryJson = await retryResp.json();

                if (retryJson && retryJson.success && Array.isArray(retryJson.rows)) {
                    this._processData(retryJson.rows);
                } else {
                    console.error('Failed to load stability analysis data:', json);
                }
            }
        } catch (e) {
            console.error('Network error loading stability analysis data:', e);
        }
    }

    _processData(rows) {
        // Prepare Chart Data
        const alpine = [], treeline = [], below = [];

        // Helper to convert rate string to number 1-5 (Similar to Danger but 'Very Poor' -> 'Very Good')
        const rateToNum = (r) => {
            if (!r) return 0;
            const rL = r.toLowerCase();
            if (rL.includes('very poor')) return 1;
            if (rL.includes('poor')) return 2;
            if (rL.includes('fair')) return 3;
            if (rL.includes('very good')) return 5;
            if (rL.includes('good')) return 4;

            // Fallback: try parsing number
            const n = parseInt(r);
            return isNaN(n) ? 0 : n;
        };

        const gridData = rows.map(row => {
            const dateStr = row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '';
            const timestamp = row.date_time_start ? new Date(row.date_time_start).getTime() : 0;

            // Populate Chart
            if (timestamp) {
                // Assuming field names like 'stability_alp', 'stability_tln' etc.
                const rA = row.stability_alp || '0';
                const rT = row.stability_tln || '0';
                const rB = row.stability_btl || '0';

                alpine.push([timestamp, rateToNum(rA)]);
                treeline.push([timestamp, rateToNum(rT)]);
                below.push([timestamp, rateToNum(rB)]);
            }

            return {
                id: row.id,
                date: dateStr,
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Overview',
                alpine: row.stability_alp || '-',
                treeline: row.stability_tln || '-',
                below: row.stability_btl || '-',
                trend: row.stability_trend || '-'
            };
        });

        this._stabilityChartData = {
            alpine: alpine.sort((a, b) => a[0] - b[0]),
            treeline: treeline.sort((a, b) => a[0] - b[0]),
            belowTreeline: below.sort((a, b) => a[0] - b[0])
        };
        this._gridData = gridData;
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Stability Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Stability', value: 'stability' }]}"
                        selectedMode="stability"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-card title="Stability Ratings Overview">
                        <powdercloud-dashboard-chart
                            title="Stability Ratings Over Time"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Stability Level' },
                    categories: ['', 'Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'],
                    min: 1, max: 5
                },
                series: [
                    { name: 'Alpine', data: this._stabilityChartData.alpine, color: '#FF0000' },
                    { name: 'Treeline', data: this._stabilityChartData.treeline, color: '#FFA500' },
                    { name: 'Below Treeline', data: this._stabilityChartData.belowTreeline, color: '#00FF00' }
                ]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <br />

                    <powdercloud-dashboard-grid
                        title="Stability Records"
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

customElements.define('analysis-stability-page', AnalysisStabilityPage);
