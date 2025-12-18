import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/DashboardGrid.js';
import './components/AppContainer.js';
import './components/AppCard.js';
import './components/AvalancheRose.js';

export class AnalysisSnowpackPage extends LitElement {
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
            { date: '2025-11-29 08:00', operation: 'Whistler', location: 'Bowl 1', type: 'CT', quality: 'Q1', height: '30', result: 'CTM 12 (Q1)' },
            { date: '2025-11-28 09:30', operation: 'Whistler', location: 'Ridge 2', type: 'ECT', quality: 'Q2', height: '45', result: 'ECTP 22' },
            { date: '2025-11-27 14:00', operation: 'Blackcomb', location: 'Glacier', type: 'RB', quality: 'Q1', height: '25', result: 'RB 4' }
        ];
    }

    render() {
        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Snowpack Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Snowpack Test', value: 'snowpack_test' }]}"
                    selectedMode="snowpack_test"
                    showDateRange
                ></filter-panel>

                <br />

                <app-card title="Map Overlay" collapsible>
                    <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #eee; color: #666;">
                        Map View Placeholder
                    </div>
                </app-card>

                <br />

                <app-card title="Rose Overlay" collapsible collapsed>
                    <div style="height: 400px;">
                        <avalanche-rose></avalanche-rose>
                    </div>
                </app-card>

                <br />

                <dashboard-grid
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
                ></dashboard-grid>
            </app-container>
        `;
    }
}

customElements.define('analysis-snowpack-page', AnalysisSnowpackPage);
