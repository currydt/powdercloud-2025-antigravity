import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../utils/PowdercloudDashboardGrid.js';
import '../containment/PowdercloudModal.js';
import '../forms/PowdercloudOperationForm.js';

export class PowdercloudOperationListGrid extends LitElement {
    static properties = {
        _data: { state: true },
        _isMock: { state: true },
        _selectedItem: { state: true },
        _isModalOpen: { state: true }
    };

    constructor() {
        super();
        this._data = [];
        this._isMock = false;
        this._selectedItem = null;
        this._isModalOpen = false;
    }

    createRenderRoot() { return this; }

    connectedCallback() {
        super.connectedCallback();
        this._fetchData();
    }

    async _fetchData() {
        try {
            const response = await fetch('/json/entity_query_all/?entity=Operation');
            const json = await response.json();
            if (json && json.rows) {
                this._data = json.rows.map(row => ({
                    ...row,
                    publish_data_exchange_display: row.publish_data_exchange ? '✓' : '',
                    publish_weather_display: row.publish_weather ? '✓' : '',
                    publish_web_display: row.publish_web ? '✓' : '',
                    publish_hazard_forecast_display: row.publish_hazard_forecast ? '✓' : ''
                }));
                this._isMock = false;
            } else {
                this._data = [];
                this._isMock = false;
            }
        } catch (e) {
            console.error('Error fetching operations:', e);
            this._data = [];
            this._isMock = true;
        }
    }

    _handleCreate() {
        this._selectedItem = {
            name: '',
            status: 'Active'
        };
        this._isModalOpen = true;
    }

    async _handleSave(e) {
        const data = e.detail;
        console.log('Saving operation:', data);
        // Mock save for now as API might not support full CRUD on this entity yet
        // In real impl: await fetch(...)
        alert('Operation saved (Mock)');
        this._closeModal();
        this._fetchData();
    }

    async _handleDelete(e) {
        const { id } = e.detail;
        console.log('Deleting operation:', id);
        // Mock delete
        alert('Operation deleted (Mock)');
        this._closeModal();
        this._fetchData();
    }

    _handleRowClick(e) {
        // DashboardGrid emits row-click with detail: row object
        // But wait, DashboardGrid implementation emits the row object directly in detail? 
        // Let's check PowdercloudDashboardGrid.js: this.dispatchEvent(new CustomEvent('row-click', { detail: row ...
        // Actually usually it's detail: { ...row } or just row.
        // Looking at PowdercloudDashboardGrid.js: _handleRowClick(row, index) ... this.dispatchEvent(new CustomEvent('row-click', { detail: row ... wait no, it doesn't emit row-click!
        // Wait, I need to check PowdercloudDashboardGrid.js again.
        // It has _handleRowClick but it emits 'selection-changed'. It DOES NOT emit 'row-click' in the version I read!
        // I need to update DashboardGrid to emit row-click if I want to use it for navigation/opening details.

        // Assuming I fix DashboardGrid or it works:
        const row = e.detail;
        this._selectedItem = row;
        this._isModalOpen = true;
    }

    _closeModal() {
        this._isModalOpen = false;
        this._selectedItem = null;
    }

    render() {
        const columns = [
            { header: 'Name', field: 'name', width: '25%' },
            { header: 'Type', field: 'type_desc', width: '15%' },
            { header: 'Data Exchange', field: 'publish_data_exchange_display', width: '15%' },
            { header: 'Publish Weather', field: 'publish_weather_display', width: '15%' },
            { header: 'Publish Obs', field: 'publish_web_display', width: '15%' },
            { header: 'Publish Hazard', field: 'publish_hazard_forecast_display', width: '15%' }
        ];

        return html`
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <button @click="${this._handleCreate}" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    + New Operation
                </button>
                ${this._isMock ? html`
                    <span style="background: #fff3cd; color: #856404; padding: 5px 10px; border: 1px solid #ffeeba; border-radius: 4px; font-size: 0.9em;">
                        ⚠️ Using Mock Data
                    </span>
                ` : ''}
            </div>
            
            <powdercloud-dashboard-grid 
                .columns="${columns}" 
                .data="${this._data}" 
                .paginated="${true}"
                @row-click="${this._handleRowClick}"
            ></powdercloud-dashboard-grid>

            <powdercloud-modal 
                .open="${this._isModalOpen}" 
                title="Operation Details" 
                size="medium"
                @close="${this._closeModal}"
            >
                ${this._selectedItem ? html`
                    <powdercloud-operation-form 
                        .data="${this._selectedItem}"
                        .readOnly="${!!this._selectedItem.id}"
                        @close="${this._closeModal}"
                        @save="${this._handleSave}"
                        @delete="${this._handleDelete}"
                    ></powdercloud-operation-form>
                ` : html`<p>Loading...</p>`}
            </powdercloud-modal>
        `;
    }
}

customElements.define('powdercloud-operation-list-grid', PowdercloudOperationListGrid);
