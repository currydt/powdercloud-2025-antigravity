import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';

export class ObservationTypeListGrid extends LitElement {
    static properties = {
        _data: { state: true },
        _isMock: { state: true }
    };

    createRenderRoot() { return this; }

    connectedCallback() {
        super.connectedCallback();
        this._fetchData();
    }

    async _fetchData() {
        try {
            const response = await fetch('/json/entity_query_all/?entity=ObservationType');
            const json = await response.json();
            if (json && json.rows) {
                this._data = json.rows;
                this._isMock = false;
            } else {
                this._data = [];
                this._isMock = false;
            }
        } catch (e) {
            console.error('Error fetching observation types:', e);
            // Fallback to mock data
            this._data = [
                {
                    id: 'avalanche-event-brief',
                    name: 'avalancheeventbrief',
                    slug: 'avalanche-event-brief',
                    created_date_time: '2011-11-03T20:41:03.886Z',
                    modified_date_time: '2011-11-03T20:41:03.886Z',
                    original_id: '526786'
                },
                {
                    id: 'weather-observation-standard',
                    name: 'weatherobservationstandard',
                    slug: 'weather-observation-standard',
                    created_date_time: '2011-11-03T20:41:03.886Z',
                    modified_date_time: '2011-11-03T20:41:03.886Z',
                    original_id: '526787'
                }
            ];
            this._isMock = true;
        }
    }

    render() {
        const columns = [
            { header: 'ID', field: 'id', width: '20%' },
            { header: 'Name', field: 'name', width: '20%' },
            { header: 'Slug', field: 'slug', width: '20%' },
            { header: 'Created', field: 'created_date_time', width: '20%' },
            { header: 'Modified', field: 'modified_date_time', width: '20%' }
        ];

        return html`
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <button class="fg-button ui-state-default fg-button-icon-left ui-corner-all" style="cursor: pointer; padding: 5px 10px;">
                    <span class="ui-icon ui-icon-plus" style="display: inline-block; vertical-align: text-top;"></span> Add Type
                </button>
                ${this._isMock ? html`
                    <span style="background: #fff3cd; color: #856404; padding: 5px 10px; border: 1px solid #ffeeba; border-radius: 4px; font-size: 0.9em;">
                        ⚠️ Using Mock Data
                    </span>
                ` : ''}
            </div>
            <dashboard-grid .columns="${columns}" .data="${this._data}"></dashboard-grid>
        `;
    }
}

customElements.define('observation-type-list-grid', ObservationTypeListGrid);
