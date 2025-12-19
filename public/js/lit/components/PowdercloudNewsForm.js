import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './PowdercloudTabs.js';
import './PowdercloudLookup.js';

export class PowdercloudNewsForm extends LitElement {
    static properties = {
        data: { type: Object },
        readOnly: { type: Boolean },
        _activeTab: { state: true },
        _formData: { state: true }
    };

    constructor() {
        super();
        this.data = {};
        this.readOnly = false;
        this._activeTab = 'general';
        this._formData = {};
    }

    updated(changedProperties) {
        if (changedProperties.has('data') && this.data) {
            this._formData = { ...this.data };
        }
    }

    createRenderRoot() { return this; }

    _handleTabChange(e) {
        this._activeTab = e.detail.tab;
    }

    _handleInputChange(e) {
        const field = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this._formData = { ...this._formData, [field]: value };
    }

    _handleSave() {
        this.dispatchEvent(new CustomEvent('save', {
            detail: this._formData,
            bubbles: true,
            composed: true
        }));
    }

    _handleDelete() {
        if (confirm('Are you sure you want to delete this item?')) {
            this.dispatchEvent(new CustomEvent('delete', {
                detail: { id: this._formData.id },
                bubbles: true,
                composed: true
            }));
        }
    }

    _handleCancel() {
        this.dispatchEvent(new CustomEvent('close', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const tabs = [
            { id: 'general', label: 'General' },
            { id: 'details', label: 'Details' }
        ];

        return html`
            <div style="display: flex; flex-direction: column; height: 100%;">
                <powdercloud-tabs .tabs="${tabs}" .activeTab="${this._activeTab}" @tab-change="${this._handleTabChange}"></powdercloud-tabs>
                
                <div style="flex: 1; overflow-y: auto; padding: 20px; border: 1px solid #ddd; border-top: none; background: #fff;">
                    ${this._activeTab === 'general' ? this._renderGeneralTab() : ''}
                    ${this._activeTab === 'details' ? this._renderDetailsTab() : ''}
                </div>

                <div style="padding: 15px; border-top: 1px solid #ddd; background: #f9f9f9; display: flex; justify-content: flex-end; gap: 10px;">
                    ${!this.readOnly ? html`
                        <button @click="${this._handleDelete}" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                    ` : ''}
                    <button @click="${this._handleCancel}" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button @click="${this._handleSave}" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        ${this.readOnly ? 'Save Changes' : 'Create'}
                    </button>
                </div>
            </div>
        `;
    }

    _renderGeneralTab() {
        return html`
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="grid-column: span 2;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Subject</label>
                    <input type="text" name="subject" .value="${this._formData.subject || ''}" @input="${this._handleInputChange}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Date/Time</label>
                    <input type="datetime-local" name="date_time_start" .value="${this._formData.date_time_start ? this._formData.date_time_start.slice(0, 16) : ''}" @input="${this._handleInputChange}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Type</label>
                    <powdercloud-lookup 
                        lookupCode="OBS_TYPE" 
                        .value="${this._formData.type}" 
                        @change="${(e) => this._formData = { ...this._formData, type: e.detail.value }}"
                    ></powdercloud-lookup>
                </div>
            </div>
        `;
    }

    _renderDetailsTab() {
        return html`
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Content</label>
                <textarea name="content" .value="${this._formData.content || ''}" @input="${this._handleInputChange}" style="width: 100%; height: 200px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            </div>
        `;
    }
}

customElements.define('powdercloud-news-form', PowdercloudNewsForm);
