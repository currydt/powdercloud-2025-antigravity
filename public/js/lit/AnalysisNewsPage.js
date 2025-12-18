import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/DashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudCard.js';

export class AnalysisNewsPage extends LitElement {
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
            { date: '2025-11-29', operation: 'Whistler', location: 'Base', notable: 'Yes', description: 'Heavy snowfall warning in effect.' },
            { date: '2025-11-28', operation: 'Blackcomb', location: 'Peak', notable: 'No', description: 'Routine maintenance on lift.' },
            { date: '2025-11-27', operation: 'Whistler', location: 'Village', notable: 'Yes', description: 'Community event scheduled for Saturday.' }
        ];
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    News Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'News', value: 'news' }]}"
                    selectedMode="news"
                    showDateRange
                ></filter-panel>

                <br />

                <dashboard-grid
                    title="News Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Notable', field: 'notable' },
                { header: 'Description', field: 'description', width: '50%' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></dashboard-grid>
            </powdercloud-container>
        `;
    }
}

customElements.define('analysis-news-page', AnalysisNewsPage);
