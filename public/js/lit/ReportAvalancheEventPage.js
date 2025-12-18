import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudLayout.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudButton.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudSelect.js';
import './components/PowdercloudDateRange.js';

// Reference: public/reports/avalanche_event.html

export class ReportAvalancheEventPage extends LitElement {
    static properties = {
        data: { type: Array }
    };

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchData();
    }

    async _fetchData() {
        try {
            // Fetch data from our local Express server (which proxies/mocks Firestore)
            // We request 'Observation' entity, filtered by 'avalanche_event' subtype,
            // and asking for the 'avalanche_full' fieldset (schema).
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=avalanche_event&fieldset=avalanche_full');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this.data = json.rows.map(row => {
                    // Map API fields to Grid fields if necessary
                    // Our server mock returns snake_case fields which align with Grid configuration below
                    // except for maybe 'location' -> 'terrain_desc'
                    return {
                        ...row,
                        date: row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '',
                        location: row.terrain_desc || row.location, // Fallback
                        number: row.id.split('_').pop(), // Fake number from ID
                        type: row.avalanche_type,
                        size: row.size_r, // Using Size R as primary 'Size' for now, or combine R/D
                        trigger: row.trigger_type,
                        incline: row.aspect, // Mapping aspect to incline temporarily or just using plain aspect 
                        // Note: Mock data might not have 'incline', utilizing 'aspect' for visual check
                        elevation: row.elevation,
                        slab_thick: row.slab_thickness,
                        slab_width: row.width,
                        slab_length: row.vertical,
                        fail_type: row.weak_layer_crystal_type,
                        fail_age: row.weak_layer_hardness // Mapping hardness to age column for now
                    };
                });
            } else {
                console.error('Failed to load avalanche data:', json);
            }
        } catch (e) {
            console.error('Network error loading avalanche data:', e);
        }
    }

    _handleFilter() {
        alert('Filtering logic would re-fetch data based on date range.');
    }

    render() {
        return html`
            <style>
                /* Custom styles for the dense report table if needed */
                .report-header {
                    display: flex; gap: 20px; align-items: flex-end; margin-bottom: 20px;
                    background: #f5f5f5; padding: 15px; border-radius: 4px;
                }
            </style>

            <powdercloud-layout pageTitle="Avalanche Event Report">
                <powdercloud-container>
                    
                    <div class="report-header">
                        <div style="flex: 1;">
                            <powdercloud-select label="Mode" .options="${['Operations', 'Community', 'Favourites']}" value="Operations"></powdercloud-select>
                        </div>
                        <div style="flex: 2;">
                            <powdercloud-date-range label="Date Range"></powdercloud-date-range>
                        </div>
                        <div>
                            <powdercloud-button @click="${this._handleFilter}" icon="refresh">Update Report</powdercloud-button>
                        </div>
                    </div>

                    <powdercloud-card>
                        <!-- 
                            Legacy table had complex headers (rowspan/colspan). 
                            PowdercloudGrid supports flat headers. We'll use flattened names for now for clarity.
                        -->
                        <powdercloud-grid 
                            .columns="${[
                { header: 'Date', field: 'date', width: '12%' },
                { header: 'Location', field: 'location', width: '12%' },
                { header: '#', field: 'number', width: '5%' },
                { header: 'Type', field: 'type', width: '5%' },
                { header: 'Size', field: 'size', width: '5%' },
                { header: 'Trig', field: 'trigger', width: '5%' },
                { header: 'Incline', field: 'incline', width: '8%' },
                { header: 'Aspect', field: 'aspect', width: '5%' },
                { header: 'Elev', field: 'elevation', width: '8%' },
                { header: 'Thick', field: 'slab_thick', width: '5%' },
                { header: 'Width', field: 'slab_width', width: '5%' },
                { header: 'Length', field: 'slab_length', width: '5%' },
                { header: 'Fail Type', field: 'fail_type', width: '10%' },
                { header: 'Age', field: 'fail_age', width: '10%' }
            ]}" 
                            .data="${this.data}"
                            .paginated="${true}"
                        ></powdercloud-grid>
                    </powdercloud-card>

                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('report-avalanche-event-page', ReportAvalancheEventPage);
