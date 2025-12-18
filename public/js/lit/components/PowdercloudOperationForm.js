import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../AppTabs.js';
import '../AppLookup.js';

export class PowdercloudOperationForm extends LitElement {
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
        this._activeTab = 'general';
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
        if (confirm('Delete this operation?')) {
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
            { id: 'general', label: 'General' },
            { id: 'settings', label: 'Settings' },
            { id: 'contact', label: 'Contact' }
        ];

        return html`
            <div class="form-container">
                <div class="header">
                    <div class="title">
                        ${!this.data.id ? 'New Operation' : (this.readOnly ? this.data.name : 'Edit Operation')}
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

                <app-tabs .tabs="${tabs}" .activeTab="${this._activeTab}" @tab-change="${e => this._activeTab = e.detail.tabId}">
                    
                    <div slot="general" class="tab-content ${this._activeTab === 'general' ? 'active' : ''}">
                        <div class="form-grid">
                            <div class="field full-width">
                                <label>Name</label>
                                ${this.readOnly ? html`<div class="value">${this.data.name || '-'}</div>` :
                html`<input type="text" name="name" .value="${this.data.name || ''}">`}
                            </div>
                            <div class="field">
                                <app-lookup 
                                    label="Type" 
                                    name="type_desc" 
                                    lookupCode="operation_type" 
                                    .value="${this.data.type_desc || ''}" 
                                    .readOnly="${this.readOnly}">
                                </app-lookup>
                            </div>
                            <div class="field">
                                <label>Status</label>
                                ${this.readOnly ? html`<div class="value">${this.data.status || 'Active'}</div>` :
                html`<select name="status">
                                        <option value="Active" ?selected="${this.data.status === 'Active'}">Active</option>
                                        <option value="Inactive" ?selected="${this.data.status === 'Inactive'}">Inactive</option>
                                    </select>`}
                            </div>
                            <div class="field full-width">
                                <label>Description</label>
                                ${this.readOnly ? html`<div class="value">${this.data.description || '-'}</div>` :
                html`<textarea name="description" rows="3">${this.data.description || ''}</textarea>`}
                            </div>
                        </div>
                    </div>

                    <div slot="settings" class="tab-content ${this._activeTab === 'settings' ? 'active' : ''}">
                        <div class="form-grid">
                            <div class="field">
                                <label>Publish Data Exchange</label>
                                ${this.readOnly ? html`<div class="value">${this.data.publish_data_exchange ? 'Yes' : 'No'}</div>` :
                html`<input type="checkbox" name="publish_data_exchange" ?checked="${this.data.publish_data_exchange}">`}
                            </div>
                            <div class="field">
                                <label>Publish Weather</label>
                                ${this.readOnly ? html`<div class="value">${this.data.publish_weather ? 'Yes' : 'No'}</div>` :
                html`<input type="checkbox" name="publish_weather" ?checked="${this.data.publish_weather}">`}
                            </div>
                            <div class="field">
                                <label>Publish Web</label>
                                ${this.readOnly ? html`<div class="value">${this.data.publish_web ? 'Yes' : 'No'}</div>` :
                html`<input type="checkbox" name="publish_web" ?checked="${this.data.publish_web}">`}
                            </div>
                            <div class="field">
                                <label>Publish Hazard Forecast</label>
                                ${this.readOnly ? html`<div class="value">${this.data.publish_hazard_forecast ? 'Yes' : 'No'}</div>` :
                html`<input type="checkbox" name="publish_hazard_forecast" ?checked="${this.data.publish_hazard_forecast}">`}
                            </div>
                        </div>
                    </div>

                    <div slot="contact" class="tab-content ${this._activeTab === 'contact' ? 'active' : ''}">
                         <div class="form-grid">
                            <div class="field">
                                <label>Email</label>
                                ${this.readOnly ? html`<div class="value">${this.data.email || '-'}</div>` :
                html`<input type="email" name="email" .value="${this.data.email || ''}">`}
                            </div>
                            <div class="field">
                                <label>Phone</label>
                                ${this.readOnly ? html`<div class="value">${this.data.phone || '-'}</div>` :
                html`<input type="text" name="phone" .value="${this.data.phone || ''}">`}
                            </div>
                            <div class="field full-width">
                                <label>Address</label>
                                ${this.readOnly ? html`<div class="value">${this.data.address || '-'}</div>` :
                html`<textarea name="address" rows="2">${this.data.address || ''}</textarea>`}
                            </div>
                        </div>
                    </div>

                </app-tabs>

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

customElements.define('powdercloud-operation-form', PowdercloudOperationForm);
