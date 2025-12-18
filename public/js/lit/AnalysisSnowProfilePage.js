import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/DashboardGrid.js';
import './components/AppContainer.js';
import './components/PowdercloudCard.js';
import './components/AvalancheRose.js';

export class AnalysisSnowProfilePage extends LitElement {
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
            { date: '2025-11-29 08:00', operation: 'Whistler', location: 'Bowl 1', type: 'Full', aspect: 'N', elevation: '1800', hs: '210', notable: 'Yes', subject: 'Weekly Profile' },
            { date: '2025-11-28 09:30', operation: 'Whistler', location: 'Ridge 2', type: 'Test', aspect: 'NE', elevation: '1950', hs: '190', notable: 'No', subject: 'Quick Pit' },
            { date: '2025-11-27 14:00', operation: 'Blackcomb', location: 'Glacier', type: 'Full', aspect: 'N', elevation: '2200', hs: '240', notable: 'Yes', subject: 'Deep Instability' }
        ];
    }

    render() {
        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Snow Profile Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Snow Profile', value: 'snow_profile' }]}"
                    selectedMode="snow_profile"
                    showDateRange
                ></filter-panel>

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
                    <div style="height: 400px;">
                        <avalanche-rose></avalanche-rose>
                    </div>
                </powdercloud-card>

                <br />

                <dashboard-grid
                    title="Snow Profile Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Aspect', field: 'aspect' },
                { header: 'Elev', field: 'elevation' },
                { header: 'HS', field: 'hs' },
                { header: 'Notable', field: 'notable' },
                { header: 'Subject', field: 'subject' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></dashboard-grid>
            </app-container>
        `;
    }
}

customElements.define('analysis-snow-profile-page', AnalysisSnowProfilePage);
