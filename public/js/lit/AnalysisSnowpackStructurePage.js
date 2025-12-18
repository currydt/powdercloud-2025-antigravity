import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/DashboardGrid.js';
import './components/AppContainer.js';
import './components/AppCard.js';

export class AnalysisSnowpackStructurePage extends LitElement {
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
            { date: '2025-11-29 08:00', operation: 'Whistler', location: 'Bowl 1', notable: 'Yes', subject: 'Weak Layer Found' },
            { date: '2025-11-28 09:30', operation: 'Whistler', location: 'Ridge 2', notable: 'No', subject: 'Stable' },
            { date: '2025-11-27 14:00', operation: 'Blackcomb', location: 'Glacier', notable: 'Yes', subject: 'Persistent Slab' }
        ];
    }

    render() {
        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Snowpack Structure Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Snowpack Structure', value: 'snowpack_structure' }]}"
                    selectedMode="snowpack_structure"
                    showDateRange
                ></filter-panel>

                <br />

                <app-card title="Map Overlay" collapsible>
                    <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #eee; color: #666;">
                        Map View Placeholder
                    </div>
                </app-card>

                <br />

                <dashboard-grid
                    title="Snowpack Structure Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Notable', field: 'notable' },
                { header: 'Description', field: 'subject' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></dashboard-grid>
            </app-container>
        `;
    }
}

customElements.define('analysis-snowpack-structure-page', AnalysisSnowpackStructurePage);
