import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';

export class PowdercloudTerrainAtlasGrid extends LitElement {
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
            const response = await fetch('/json/entity_query_all/?entity=Terrain');
            const json = await response.json();
            if (json && json.rows) {
                this._data = json.rows;
                this._isMock = false;
            } else {
                this._data = [];
                this._isMock = false;
            }
        } catch (e) {
            console.error('Error fetching terrain:', e);
            // Fallback to mock data
            this._data = [
                { name: 'Bowl 1', name_nick: 'B1', elevation: 2100, aspect: 'N' },
                { name: 'Ridge Top', name_nick: 'RT', elevation: 2400, aspect: 'NE' },
                { name: 'Lower Trees', name_nick: 'LT', elevation: 1500, aspect: 'E' },
                { name: 'Summit', name_nick: 'SUM', elevation: 2800, aspect: 'N' }
            ];
            this._isMock = true;
        }
    }

    render() {
        const columns = [
            { header: 'Name', field: 'name', width: '25%' },
            { header: 'Abbreviation', field: 'abbreviation', width: '15%' },
            { header: 'Feature Type', field: 'feature_type', width: '15%' },
            { header: 'Elevation Min', field: 'elevation_min', width: '15%' },
            { header: 'Elevation Max', field: 'elevation_max', width: '15%' },
            { header: 'Aspect', field: 'aspect_start', width: '15%' }
        ];

        return html`
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <button class="fg-button ui-state-default fg-button-icon-left ui-corner-all" style="cursor: pointer; padding: 5px 10px;">
                    <span class="ui-icon ui-icon-plus" style="display: inline-block; vertical-align: text-top;"></span> Add Terrain
                </button>
                ${this._isMock ? html`
                    <span style="background: #fff3cd; color: #856404; padding: 5px 10px; border: 1px solid #ffeeba; border-radius: 4px; font-size: 0.9em;">
                        ⚠️ Using Mock Data
                    </span>
                ` : ''}
            </div>
            <dashboard-grid .columns="${columns}" .data="${this._data}" .paginated="${true}"></dashboard-grid>
        `;
    }
}

customElements.define('powdercloud-terrain-atlas-grid', PowdercloudTerrainAtlasGrid);
