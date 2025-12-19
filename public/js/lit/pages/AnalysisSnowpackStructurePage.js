import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudLayout.js';
import '../utils/PowdercloudFilterPanel.js';
import '../utils/PowdercloudDashboardGrid.js';
import '../layout/PowdercloudContainer.js';
import '../containment/PowdercloudCard.js';

export class AnalysisSnowpackStructurePage extends LitElement {
    static properties = {
        _gridData: { state: true }
    };

    constructor() {
        super();
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
            // Fetch 'Observation' entity, subtype 'snowpack_layer' (likely), limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=snowpack_layer&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                console.error('Failed to load snowpack structure data:', json);
            }
        } catch (e) {
            console.error('Network error loading snowpack structure data:', e);
        }
    }

    _processData(rows) {
        this._gridData = rows.map(row => {
            return {
                id: row.id,
                date: row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '',
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Unknown',
                subject: row.comments || '-',
                grain_type: row.grain_type || '-',
                grain_size: row.grain_size ? row.grain_size + 'mm' : '-'
            };
        });
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Snowpack Structure Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Snowpack Structure', value: 'snowpack_structure' }]}"
                        selectedMode="snowpack_structure"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-card title="Map Overlay" collapsible>
                        <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #eee; color: #666;">
                            Map View Placeholder
                        </div>
                    </powdercloud-card>

                    <br />

                    <powdercloud-dashboard-grid
                        title="Snowpack Structure Records"
                        .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                // { header: 'Notable', field: 'notable' }, // Usually calculated or boolean
                { header: 'Description', field: 'subject' },
                { header: 'Grain Type', field: 'grain_type' },
                { header: 'Size', field: 'grain_size' }
            ]}"
                        .data="${this._gridData}"
                        paginated
                    ></powdercloud-dashboard-grid>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-snowpack-structure-page', AnalysisSnowpackStructurePage);
