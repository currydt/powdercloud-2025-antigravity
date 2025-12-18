import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/PowdercloudDashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudCard.js';

export class AnalysisSightingsPage extends LitElement {
    static properties = {
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._gridData = this._generateMockGridData();
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _generateMockGridData() {
        return [
            { date: '2025-11-29', operation: 'Whistler', location: 'Peak', type: 'Sighting', notable: 'Yes', subject: 'Wolverine tracks spotted.' },
            { date: '2025-11-28', operation: 'Blackcomb', location: 'Glacier', type: 'Narrative', notable: 'No', subject: 'Group of 4 skiers observed.' }
        ];
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Sightings Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Sightings', value: 'sightings' }]}"
                    selectedMode="sightings"
                    showDateRange
                ></filter-panel>

                <br />

                <powdercloud-dashboard-grid
                    title="Sightings Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Notable', field: 'notable' },
                { header: 'Subject', field: 'subject', width: '40%' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></powdercloud-dashboard-grid>
            </powdercloud-container>
        `;
    }
}

customElements.define('analysis-sightings-page', AnalysisSightingsPage);
