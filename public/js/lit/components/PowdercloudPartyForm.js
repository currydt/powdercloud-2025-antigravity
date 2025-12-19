import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './PowdercloudTabs.js';
import './PowdercloudLookup.js';

export class PowdercloudPartyForm extends LitElement {
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
        this._activeTab = 'profile';
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
        if (confirm('Delete this party?')) {
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
            { id: 'profile', label: 'Profile' },
            { id: 'contact', label: 'Contact Info' },
            { id: 'preferences', label: 'Preferences' }
        ];

        return html`
            <div class="form-container">
                <div class="header">
                    <div class="title">
                        ${!this.data.id ? 'New Party' : (this.readOnly ? (this.data.first_name + ' ' + this.data.last_name) : 'Edit Party')}
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
                    
                    <div slot="profile" class="tab-content ${this._activeTab === 'profile' ? 'active' : ''}">
                        <div class="form-grid">
                            <div class="field">
                                <label>First Name</label>
                                ${this.readOnly ? html`<div class="value">${this.data.first_name || '-'}</div>` :
                html`<input type="text" name="first_name" .value="${this.data.first_name || ''}">`}
                            </div>
                            <div class="field">
                                <label>Last Name</label>
                                ${this.readOnly ? html`<div class="value">${this.data.last_name || '-'}</div>` :
                html`<input type="text" name="last_name" .value="${this.data.last_name || ''}">`}
                            </div>
                            <div class="field">
                                <powdercloud-lookup 
                                    label="Type" 
                                    name="type_desc" 
                                    lookupCode="party_type" 
                                    .value="${this.data.type_desc || ''}" 
                                    .readOnly="${this.readOnly}">
                                </powdercloud-lookup>
                            </div>
                            <div class="field">
                                <label>Status</label>
                                ${this.readOnly ? html`<div class="value">${this.data.status || 'Active'}</div>` :
                html`<select name="status">
                                        <option value="Active" ?selected="${this.data.status === 'Active'}">Active</option>
                                        <option value="Inactive" ?selected="${this.data.status === 'Inactive'}">Inactive</option>
                                    </select>`}
                            </div>
                        </div>
                    </div>

                    <div slot="contact" class="tab-content ${this._activeTab === 'contact' ? 'active' : ''}">
                        <div class="form-grid">
                            <div class="field full-width">
                                <label>Email</label>
                                ${this.readOnly ? html`<div class="value">${this.data.email || '-'}</div>` :
                html`<input type="email" name="email" .value="${this.data.email || ''}">`}
                            </div>
                            <div class="field">
                                <label>Phone</label>
                                ${this.readOnly ? html`<div class="value">${this.data.phone || '-'}</div>` :
                html`<input type="text" name="phone" .value="${this.data.phone || ''}">`}
                            </div>
                            <div class="field">
                                <label>Mobile</label>
                                ${this.readOnly ? html`<div class="value">${this.data.mobile || '-'}</div>` :
                html`<input type="text" name="mobile" .value="${this.data.mobile || ''}">`}
                            </div>
                        </div>
                    </div>

                    <div slot="preferences" class="tab-content ${this._activeTab === 'preferences' ? 'active' : ''}">
                         <div class="form-grid">
                            <div class="field full-width">
                                <label>Notes</label>
                                ${this.readOnly ? html`<div class="value">${this.data.notes || '-'}</div>` :
                html`<textarea name="notes" rows="4">${this.data.notes || ''}</textarea>`}
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

customElements.define('powdercloud-party-form', PowdercloudPartyForm);
