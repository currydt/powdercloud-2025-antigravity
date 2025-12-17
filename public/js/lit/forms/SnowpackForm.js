import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class SnowpackForm extends LitElement {
    static properties = {
        data: { type: Object },
        readOnly: { type: Boolean },
        _menuOpen: { state: true }
    };

    static styles = css`
        :host {
            display: block;
            font-family: 'Inter', sans-serif;
            position: relative;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
        }

        .menu-container {
            position: relative;
        }

        .menu-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0 8px;
            color: #666;
        }

        .menu-btn:hover {
            color: #333;
        }

        .dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #eee;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10;
            min-width: 120px;
            display: none;
        }

        .dropdown.open {
            display: block;
        }

        .dropdown-item {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 0.9rem;
            color: #333;
        }

        .dropdown-item:hover {
            background-color: #f5f5f5;
        }

        .dropdown-item.delete {
            color: #dc3545;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        label {
            font-size: 0.85rem;
            color: #666;
            font-weight: 500;
        }

        .value {
            font-size: 1rem;
            color: #333;
            padding: 8px;
            background: #f9f9f9;
            border-radius: 4px;
            border: 1px solid #eee;
            min-height: 20px;
        }

        input, select, textarea {
            font-size: 1rem;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 100%;
            box-sizing: border-box;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .save-actions {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        button.save {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
    `;

    constructor() {
        super();
        this.data = {};
        this.readOnly = true;
        this._menuOpen = false;
    }

    _formatDate(isoString) {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleString();
    }

    _getValue(key) {
        if (!this.data) return '-';
        const val = this.data[key];
        if (val === null || val === undefined) return '-';
        if (typeof val === 'object' && val.name) return val.name;
        return val;
    }

    _toggleMenu() {
        this._menuOpen = !this._menuOpen;
    }

    _handleEdit() {
        this.readOnly = false;
        this._menuOpen = false;
    }

    _handleSave() {
        const formData = { ...this.data };
        const inputs = this.shadowRoot.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value;
            }
        });

        this.dispatchEvent(new CustomEvent('save', {
            detail: formData,
            bubbles: true,
            composed: true
        }));
    }

    _handleDelete() {
        if (confirm('Are you sure you want to delete this observation?')) {
            this.dispatchEvent(new CustomEvent('delete', {
                detail: { id: this.data.id },
                bubbles: true,
                composed: true
            }));
        }
    }

    _handleCancel() {
        if (!this.data.id) {
            this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
        } else {
            this.readOnly = true;
        }
    }

    render() {
        if (!this.data) return html`<div>Loading...</div>`;

        return html`
            <div class="form-container">
                <div class="header">
                    <div class="title">
                        ${!this.data.id ? 'New Snowpack Observation' : (this.readOnly ? 'Snowpack Details' : 'Edit Snowpack')}
                    </div>
                    
                    ${this.readOnly && this.data.id ? html`
                        <div class="menu-container">
                            <button class="menu-btn" @click="${this._toggleMenu}">&#8942;</button>
                            <div class="dropdown ${this._menuOpen ? 'open' : ''}">
                                <div class="dropdown-item" @click="${this._handleEdit}">Edit</div>
                                <div class="dropdown-item delete" @click="${this._handleDelete}">Delete</div>
                            </div>
                        </div>
                    ` : html``}
                </div>

                <div class="form-grid">
                    <div class="field">
                        <label>Date & Time</label>
                        ${this.readOnly ?
                html`<div class="value">${this._formatDate(this.data.date_time_start)}</div>` :
                html`<input type="datetime-local" name="date_time_start" .value="${this.data.date_time_start ? this.data.date_time_start.slice(0, 16) : ''}">`
            }
                    </div>
                    <div class="field">
                        <label>Location</label>
                        <div class="value">${this._getValue('terrain_desc') || this._getValue('terrain')}</div>
                    </div>
                    
                    <div class="field full-width">
                        <label>Snowpack Narrative</label>
                        ${this.readOnly ?
                html`<div class="value">${this._getValue('snowpack_narrative') || '-'}</div>` :
                html`<textarea name="snowpack_narrative" rows="3">${this.data.snowpack_narrative || ''}</textarea>`
            }
                    </div>

                    <div class="field">
                        <label>Test Result</label>
                        ${this.readOnly ?
                html`<div class="value">${this._getValue('test_result') || '-'}</div>` :
                html`<input type="text" name="test_result" .value="${this.data.test_result || ''}">`
            }
                    </div>

                    <div class="field">
                        <label>Observer</label>
                        <div class="value">${this._getValue('observer_desc')}</div>
                    </div>
                    
                    <div class="field full-width">
                        <label>Comments</label>
                        ${this.readOnly ?
                html`<div class="value">${this._getValue('comments_internal') || '-'}</div>` :
                html`<textarea name="comments_internal" rows="3">${this.data.comments_internal || ''}</textarea>`
            }
                    </div>
                </div>

                ${!this.readOnly ? html`
                    <div class="save-actions">
                        <button class="save" @click="${this._handleSave}">Save</button>
                        <button @click="${this._handleCancel}">Cancel</button>
                    </div>
                ` : html``}
            </div>
        `;
    }
}

customElements.define('snowpack-form', SnowpackForm);
