import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';
import '../AppModal.js';
import '../forms/RoleForm.js';

export class RoleListGrid extends LitElement {
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
            const response = await fetch('/json/entity_query_all/?entity=RoleType');
            const json = await response.json();
            if (json && json.rows) {
                this._data = json.rows;
                this._isMock = false;
            } else {
                this._data = [];
                this._isMock = false;
            }
        } catch (e) {
            console.error('Error fetching roles:', e);
            this._data = [];
            this._isMock = true;
        }
    }

    _handleCreate() {
        this._selectedItem = {
            name: '',
            description: ''
        };
        this._isModalOpen = true;
    }

    async _handleSave(e) {
        const data = e.detail;
        console.log('Saving role:', data);
        alert('Role saved (Mock)');
        this._closeModal();
        this._fetchData();
    }

    async _handleDelete(e) {
        const { id } = e.detail;
        console.log('Deleting role:', id);
        alert('Role deleted (Mock)');
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
            { header: 'Name', field: 'name', width: '30%' },
            { header: 'Description', field: 'description', width: '70%' }
        ];

        return html`
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <button @click="${this._handleCreate}" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    + New Role
                </button>
                ${this._isMock ? html`
                    <span style="background: #fff3cd; color: #856404; padding: 5px 10px; border: 1px solid #ffeeba; border-radius: 4px; font-size: 0.9em;">
                        ⚠️ Using Mock Data
                    </span>
                ` : ''}
            </div>
            
            <dashboard-grid 
                .columns="${columns}" 
                .data="${this._data}" 
                @row-click="${this._handleRowClick}"
            ></dashboard-grid>

            <app-modal 
                .open="${this._isModalOpen}" 
                title="Role Details" 
                size="medium"
                @close="${this._closeModal}"
            >
                ${this._selectedItem ? html`
                    <role-form 
                        .data="${this._selectedItem}"
                        .readOnly="${!!this._selectedItem.id}"
                        @close="${this._closeModal}"
                        @save="${this._handleSave}"
                        @delete="${this._handleDelete}"
                    ></role-form>
                ` : html`<p>Loading...</p>`}
            </app-modal>
        `;
    }
}

customElements.define('role-list-grid', RoleListGrid);
