import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './PowdercloudDashboardGrid.js';
import './PowdercloudModal.js';
import './PowdercloudPartyForm.js';

export class PowdercloudPartyListGrid extends LitElement {
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
            const response = await fetch('/json/entity_query_all/?entity=Party');
            const json = await response.json();
            if (json && json.rows) {
                this._data = json.rows.map(row => ({
                    ...row,
                    full_name: `${row.first_name || ''} ${row.last_name || ''}`.trim()
                }));
                this._isMock = false;
            } else {
                this._data = [];
                this._isMock = false;
            }
        } catch (e) {
            console.error('Error fetching parties:', e);
            this._data = [];
            this._isMock = true;
        }
    }

    _handleCreate() {
        this._selectedItem = {
            first_name: '',
            last_name: '',
            status: 'Active'
        };
        this._isModalOpen = true;
    }

    async _handleSave(e) {
        const data = e.detail;
        console.log('Saving party:', data);
        alert('Party saved (Mock)');
        this._closeModal();
        this._fetchData();
    }

    async _handleDelete(e) {
        const { id } = e.detail;
        console.log('Deleting party:', id);
        alert('Party deleted (Mock)');
        this._closeModal();
        this._fetchData();
    }

    _handleRowClick(e) {
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
            { header: 'Name', field: 'full_name', width: '30%' },
            { header: 'Type', field: 'type_desc', width: '20%' },
            { header: 'Email', field: 'email', width: '30%' },
            { header: 'Status', field: 'status', width: '20%' }
        ];

        return html`
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <button @click="${this._handleCreate}" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    + New Party
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
                title="Party Details" 
                size="medium"
                @close="${this._closeModal}"
            >
                ${this._selectedItem ? html`
                    <powdercloud-party-form 
                        .data="${this._selectedItem}"
                        .readOnly="${!!this._selectedItem.id}"
                        @close="${this._closeModal}"
                        @save="${this._handleSave}"
                        @delete="${this._handleDelete}"
                    ></powdercloud-party-form>
                ` : html`<p>Loading...</p>`}
            </powdercloud-modal>
        `;
    }
}

customElements.define('powdercloud-party-list-grid', PowdercloudPartyListGrid);
