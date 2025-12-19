import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudLayout.js';
import '../utils/PowdercloudFilterPanel.js';
import '../utils/PowdercloudDashboardGrid.js';
import '../layout/PowdercloudContainer.js';
import '../containment/PowdercloudCard.js';

export class AnalysisNewsPage extends LitElement {
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
            // Fetch 'Observation' entity, subtype 'news' (or 'news_item')
            const response = await fetch('/json/entity_query_all/?entity=Observation&subtype=news_item&limit=100');
            const json = await response.json();

            if (json && json.success && Array.isArray(json.rows)) {
                this._processData(json.rows);
            } else {
                // Try 'news' fallback
                const retryParams = new URLSearchParams({ entity: 'Observation', subtype: 'news', limit: 100 });
                const retryResp = await fetch(`/json/entity_query_all/?${retryParams}`);
                const retryJson = await retryResp.json();

                if (retryJson && retryJson.success && Array.isArray(retryJson.rows)) {
                    this._processData(retryJson.rows);
                } else {
                    console.error('Failed to load news data:', json);
                }
            }
        } catch (e) {
            console.error('Network error loading news data:', e);
        }
    }

    _processData(rows) {
        this._gridData = rows.map(row => {
            return {
                id: row.id,
                date: row.date_time_start ? new Date(row.date_time_start).toLocaleString() : '',
                operation: row.operation_name || 'My Operation',
                location: row.terrain_desc || row.location || 'Unknown',
                description: row.comments || row.news_story || row.description || '-'
            };
        });
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="News Analysis">
                <powdercloud-container>
                    
                    <powdercloud-filter-panel 
                        .modes="${[{ label: 'News', value: 'news' }]}"
                        selectedMode="news"
                        showDateRange
                    ></powdercloud-filter-panel>

                    <br />

                    <powdercloud-dashboard-grid
                        title="News Records"
                        .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                // { header: 'Notable', field: 'notable' }, // Usually not standard
                { header: 'Description', field: 'description', width: '50%' }
            ]}"
                        .data="${this._gridData}"
                        paginated
                    ></powdercloud-dashboard-grid>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('analysis-news-page', AnalysisNewsPage);
