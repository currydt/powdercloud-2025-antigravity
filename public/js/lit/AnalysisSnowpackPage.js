import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudLayout.js';
import './components/PowdercloudFilterPanel.js';
import './components/PowdercloudDashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudGoogleMap.js';
import './components/PowdercloudAvalancheRose.js';

export class AnalysisSnowpackPage extends LitElement {
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
            // Fetch 'Observation' entity, subtype 'snowpack_test', limit 100
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=snowpack_test&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                console.error('Failed to load snowpack data:', json);
            }
        } catch (e) {
            console.error('Network error loading snowpack data:', e);
        }
    }

    _processData(rows) {
        this._gridData = rows.map(row => {
            return {
                id: row.id,
                date: row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '',
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Unknown',
                type: row.fracture_character || row.test_type || '-',
                quality: row.shear_quality || '-',
                height: row.depth || '-',
                result: row.test_result || row.comments || '-'
            };
        });
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Snowpack Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Snowpack Test', value: 'snowpack_test' }]}"
                        selectedMode="snowpack_test"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-card title="Map Overlay" collapsible>
                        <div style="height: 400px; width: 100%;">
                            <!-- Assuming API key is handled globally or via config, or we pass a placeholder/demo key if available -->
                            <powdercloud-google-map 
                                .lat="${50.1163}" 
                                .lng="${-122.9574}" 
                                .zoom="${11}"
                                .markers="${[
                { lat: 50.1163, lng: -122.9574, title: 'Whistler', color: '#EA4335' },
                { lat: 50.1100, lng: -122.9400, title: 'Blackcomb', color: '#4285F4' }
            ]}"
                            ></powdercloud-google-map>
                        </div>
                    </powdercloud-card>

                    <br />

                    <powdercloud-card title="Rose Overlay" collapsible collapsed>
                        <div style="height: 400px;">
                            <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                        </div>
                    </powdercloud-card>

                    <br />

                    <powdercloud-dashboard-grid
                        title="Snowpack Test Records"
                        .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Quality', field: 'quality' },
                { header: 'Height', field: 'height' },
                { header: 'Result', field: 'result' }
            ]}"
                        .data="${this._gridData}"
                        paginated
                    ></powdercloud-dashboard-grid>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-snowpack-page', AnalysisSnowpackPage);
