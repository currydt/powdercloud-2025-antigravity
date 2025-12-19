import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudLayout.js';
import '../components/PowdercloudFilterPanel.js';
import '../components/PowdercloudDashboardGrid.js';
import '../components/PowdercloudContainer.js';
import '../components/PowdercloudCard.js';

export class AnalysisSightingsPage extends LitElement {
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
            // Fetch 'Observation' entity, using 'incident' since 'sighting' isn't standard in typical models
            // Or 'sighting_event' based on previous context. Let's try 'incident' first.
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=incident&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                // Try 'sighting_event' fallback
                const retryParams = new URLSearchParams({ entity: 'Observation', subtype: 'sighting_event', limit: 100 });
                const retryResp = await fetch(`/json/entity_query_all/?${retryParams}`);
                const retryJson = await retryResp.json();

                if (retryJson && retryJson.success && Array.isArray(retryJson.rows)) {
                    this._processData(retryJson.rows);
                } else {
                    console.error('Failed to load sightings data:', json);
                }
            }
        } catch (e) {
            console.error('Network error loading sightings data:', e);
        }
    }

    _processData(rows) {
        this._gridData = rows.map(row => {
            return {
                id: row.id,
                date: row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '',
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Unknown',
                type: row.incident_type || 'Sighting',
                subject: row.comments || row.incident_description || '-'
            };
        });
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Sightings Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'Sightings', value: 'sightings' }]}"
                        selectedMode="sightings"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-dashboard-grid
                        title="Sightings Records"
                        .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                // { header: 'Notable', field: 'notable' },
                { header: 'Subject', field: 'subject', width: '40%' }
            ]}"
                        .data="${this._gridData}"
                        paginated
                    ></powdercloud-dashboard-grid>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-sightings-page', AnalysisSightingsPage);
