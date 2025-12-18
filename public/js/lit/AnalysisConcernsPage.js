import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudLayout.js';
import './components/PowdercloudFilterPanel.js';
import './components/PowdercloudDashboardChart.js';
import './components/PowdercloudDashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudCard.js';

export class AnalysisConcernsPage extends LitElement {
    static properties = {
        _alpineData: { state: true },
        _treelineData: { state: true },
        _belowTreelineData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._alpineData = [];
        this._treelineData = [];
        this._belowTreelineData = [];
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
            // Fetch 'Observation' entity, subtype 'hazard_assessment' (likely), limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=hazard_assessment&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                console.error('Failed to load concerns data:', json);
            }
        } catch (e) {
            console.error('Network error loading concerns data:', e);
        }
    }

    _processData(rows) {
        const alpine = [], treeline = [], below = [];

        // Helper to map Likelihood enum to numeric for scatter
        // Assuming values like 'Unlikely', 'Possible', 'Likely', 'Very Likely', 'Certain' etc. 
        // Or 1-9 scale directly? Let's assume text and map it, or use raw if numeric.
        // For now, simple mock parsing logic:
        const parseLike = (val) => {
            if (!val) return 0;
            const v = val.toLowerCase();
            if (v.includes('unlikely')) return 2;
            if (v.includes('possible')) return 4;
            if (v.includes('likely')) return 6;
            if (v.includes('certain')) return 8;
            const n = parseFloat(val);
            return isNaN(n) ? 0 : n;
        };

        const parseSize = (val) => {
            const n = parseFloat(val);
            return isNaN(n) ? 0 : n;
        };

        const gridData = rows.map(row => {
            const dateStr = row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '';

            /* Assuming fields: 
               alp_size, alp_like 
               tln_size, tln_like
               btl_size, btl_like 
            */
            const aS = parseSize(row.alp_max_size);
            const aL = parseLike(row.alp_likelihood);
            if (aS > 0 && aL > 0) alpine.push([aS, aL]);

            const tS = parseSize(row.tln_max_size);
            const tL = parseLike(row.tln_likelihood);
            if (tS > 0 && tL > 0) treeline.push([tS, tL]);

            const bS = parseSize(row.btl_max_size);
            const bL = parseLike(row.btl_likelihood);
            if (bS > 0 && bL > 0) below.push([bS, bL]);

            return {
                id: row.id,
                date: dateStr,
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Unknown',
                alpine_size: row.alp_max_size || '-',
                alpine_like: row.alp_likelihood || '-',
                treeline_size: row.tln_max_size || '-',
                treeline_like: row.tln_likelihood || '-',
                // below fields not in grid cols but processed for chart
            };
        });

        this._alpineData = alpine;
        this._treelineData = treeline;
        this._belowTreelineData = below;
        this._gridData = gridData;
    }

    render() {
        const scatterOptions = {
            chart: { type: 'scatter', zoomType: 'xy' },
            xAxis: { title: { text: 'Size (Destructive)' }, min: 1, max: 5 },
            yAxis: { title: { text: 'Likelihood' }, min: 1, max: 9 },
            plotOptions: {
                scatter: {
                    marker: { radius: 5, states: { hover: { enabled: true, lineColor: 'rgb(100,100,100)' } } },
                    tooltip: { headerFormat: '<b>{series.name}</b><br>', pointFormat: 'Size: {point.x}, Likelihood: {point.y}' }
                }
            }
        };

        return html`
            <powdercloud-layout pageTitle="Concerns Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Concerns', value: 'concerns' }]}"
                        selectedMode="concerns"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-grid cols="3" gap="lg">
                        <powdercloud-card title="Alpine Hazard">
                            <powdercloud-dashboard-chart
                                title="Alpine"
                                type="scatter"
                                .options="${{
                ...scatterOptions,
                series: [{ name: 'Alpine', data: this._alpineData, color: 'rgba(223, 83, 83, .5)' }]
            }}"
                            ></powdercloud-dashboard-chart>
                        </powdercloud-card>

                        <powdercloud-card title="Treeline Hazard">
                            <powdercloud-dashboard-chart
                                title="Treeline"
                                type="scatter"
                                .options="${{
                ...scatterOptions,
                series: [{ name: 'Treeline', data: this._treelineData, color: 'rgba(119, 152, 191, .5)' }]
            }}"
                            ></powdercloud-dashboard-chart>
                        </powdercloud-card>

                        <powdercloud-card title="Below Treeline Hazard">
                            <powdercloud-dashboard-chart
                                title="Below Treeline"
                                type="scatter"
                                .options="${{
                ...scatterOptions,
                series: [{ name: 'Below TL', data: this._belowTreelineData, color: 'rgba(144, 237, 125, .5)' }]
            }}"
                            ></powdercloud-dashboard-chart>
                        </powdercloud-card>
                    </powdercloud-grid>

                    <br />

                    <powdercloud-dashboard-grid
                        title="Concerns Records"
                        .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Alpine Size', field: 'alpine_size' },
                { header: 'Alpine Likelihood', field: 'alpine_like' },
                { header: 'TL Size', field: 'treeline_size' },
                { header: 'TL Likelihood', field: 'treeline_like' }
            ]}"
                        .data="${this._gridData}"
                        paginated
                    ></powdercloud-dashboard-grid>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-concerns-page', AnalysisConcernsPage);
