import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudLayout.js';
import '../components/PowdercloudFilterPanel.js';
import '../components/PowdercloudDashboardGrid.js';
import '../components/PowdercloudContainer.js';
import '../components/PowdercloudCard.js';
import '../components/PowdercloudAvalancheRose.js';

export class AnalysisSnowProfilePage extends LitElement {
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
            // Fetch 'Observation' entity, subtype 'snow_profile_standard' (likely), limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=snow_profile_standard&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                console.error('Failed to load snow profile data:', json);
            }
        } catch (e) {
            console.error('Network error loading snow profile data:', e);
        }
    }

    _processData(rows) {
        this._gridData = rows.map(row => {
            return {
                id: row.id,
                date: row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '',
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Unknown',
                type: row.profile_type || '-',
                aspect: row.aspect || '-',
                elevation: row.elevation ? row.elevation + 'm' : '-',
                hs: row.snowpack_depth ? row.snowpack_depth + 'cm' : '-',
                subject: row.comments || '-'
            };
        });
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Snow Profile Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Snow Profile', value: 'snow_profile' }]}"
                        selectedMode="snow_profile"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-card title="Snow Profile Chart" collapsible>
                        <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #f9f9f9; border: 1px dashed #ccc; color: #666;">
                            Snow Profile Visualization Coming Soon (SVG/Canvas Implementation)
                        </div>
                    </powdercloud-card>

                    <br />

                    <powdercloud-card title="Map Overlay" collapsible>
                        <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #eee; color: #666;">
                            Map View Placeholder
                        </div>
                    </powdercloud-card>

                    <br />

                    <powdercloud-card title="Rose Overlay" collapsible collapsed>
                        <div style="height: 400px; display: flex; justify-content: center; align-items: center;">
                            <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                        </div>
                    </powdercloud-card>

                    <br />

                    <powdercloud-dashboard-grid
                        title="Snow Profile Records"
                        .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Aspect', field: 'aspect' },
                { header: 'Elev', field: 'elevation' },
                { header: 'HS', field: 'hs' },
                // { header: 'Notable', field: 'notable' }, // Not a standard field usually
                { header: 'Subject', field: 'subject' }
            ]}"
                        .data="${this._gridData}"
                        paginated
                    ></powdercloud-dashboard-grid>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-snow-profile-page', AnalysisSnowProfilePage);
