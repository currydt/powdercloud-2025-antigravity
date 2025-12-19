import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../navigation/PowdercloudTabs.js';
import '../data-display/PowdercloudLookup.js';

export class PowdercloudRoleForm extends LitElement {
    static properties = {
        data: { type: Object },
        readOnly: { type: Boolean },
        _menuOpen: { state: true },
        _activeTab: { state: true }
    };

    static styles = css`
        :host { display: block; font-family: 'Inter', sans-serif; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .title { font-size: 1.2rem; font-weight: 600; color: #333; }
        .menu-container { position: relative; }
        .menu-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0 8px; color: #666; }
        .dropdown { position: absolute; top: 100%; right: 0; background: white; border: 1px solid #eee; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10; min-width: 120px; display: none; }
        .dropdown.open { display: block; }
        .dropdown-item { padding: 8px 16px; cursor: pointer; font-size: 0.9rem; color: #333; }
        .dropdown-item:hover { background-color: #f5f5f5; }
        .dropdown-item.delete { color: #dc3545; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 10px 0; }
        .field { display: flex; flex-direction: column; gap: 4px; }
        label { font-size: 0.85rem; color: #666; font-weight: 500; }
        .value { font-size: 1rem; color: #333; padding: 8px; background: #f9f9f9; border-radius: 4px; border: 1px solid #eee; min-height: 20px; }
        input, select, textarea { font-size: 1rem; padding: 8px; border-radius: 4px; border: 1px solid #ccc; width: 100%; box-sizing: border-box; }
        .full-width { grid-column: 1 / -1; }
        .save-actions { margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; }
        button.save { background-color: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    `;

    constructor() {
        super();
        this.data = {};
        this.readOnly = true;
        this._menuOpen = false;
        this._activeTab = 'details';
    }

    _toggleMenu() { this._menuOpen = !this._menuOpen; }
    _handleEdit() { this.readOnly = false; this._menuOpen = false; }

    _handleSave() {
        const formData = { ...this.data };
        const inputs = this.shadowRoot.querySelectorAll('input, textarea, select, app-lookup');
        inputs.forEach(input => {
            if (input.name) formData[input.name] = input.value;
        });
        this.dispatchEvent(new CustomEvent('save', { detail: formData, bubbles: true, composed: true }));
    }

    _handleDelete() {
        if (confirm('Delete this role?')) {
            this.dispatchEvent(new CustomEvent('delete', { detail: { id: this.data.id }, bubbles: true, composed: true }));
        }
    }

    _handleCancel() {
        if (!this.data.id) this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
        else this.readOnly = true;
    }

    render() {
        if (!this.data) return html`<div>Loading...</div>`;

        const tabs = [
            { id: 'details', label: 'Role Details' },
            { id: 'permissions', label: 'Permissions' }
        ];

        return html`
            <div class="form-container">
                <div class="header">
                    <div class="title">
                        ${!this.data.id ? 'New Role' : (this.readOnly ? this.data.name : 'Edit Role')}
                    </div>
                    ${this.readOnly && this.data.id ? html`
                        <div class="menu-container">
                            <button class="menu-btn" @click="${this._toggleMenu}">&#8942;</button>
                            <div class="dropdown ${this._menuOpen ? 'open' : ''}">
                                <div class="dropdown-item" @click="${this._handleEdit}">Edit</div>
                                <div class="dropdown-item delete" @click="${this._handleDelete}">Delete</div>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <powdercloud-tabs .tabs="${tabs}" .activeTab="${this._activeTab}" @tab-change="${e => this._activeTab = e.detail.tabId}">
                    
                    <div slot="details" class="tab-content ${this._activeTab === 'details' ? 'active' : ''}">
                        <div class="form-grid">
                            <div class="field full-width">
                                <label>Role Name</label>
                                ${this.readOnly ? html`<div class="value">${this.data.name || '-'}</div>` :
                html`<input type="text" name="name" .value="${this.data.name || ''}">`}
                            </div>
                            <div class="field full-width">
                                <label>Description</label>
                                ${this.readOnly ? html`<div class="value">${this.data.description || '-'}</div>` :
                html`<textarea name="description" rows="3">${this.data.description || ''}</textarea>`}
                            </div>
                        </div>
                    </div>

                    <div slot="permissions" class="tab-content ${this._activeTab === 'permissions' ? 'active' : ''}">
                        <div class="form-grid">
                            <div class="field full-width">
                                <label>Permissions (JSON)</label>
                                ${this.readOnly ? html`<div class="value"><pre>${JSON.stringify(this.data.permissions || {}, null, 2)}</pre></div>` :
                html`<textarea name="permissions" rows="10">${JSON.stringify(this.data.permissions || {}, null, 2)}</textarea>`}
                            </div>
                        </div>
                    </div>

                </powdercloud-tabs>

                ${!this.readOnly ? html`
                    <div class="save-actions">
                        <button class="save" @click="${this._handleSave}">Save</button>
                        <button @click="${this._handleCancel}">Cancel</button>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('powdercloud-role-form', PowdercloudRoleForm);
