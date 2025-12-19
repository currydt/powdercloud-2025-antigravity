import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudCheckbox extends LitElement {
    static properties = {
        label: { type: String },
        checked: { type: Boolean },
        disabled: { type: Boolean },
        name: { type: String },
        value: { type: String }
    };

    constructor() {
        super();
        this.label = '';
        this.checked = false;
        this.disabled = false;
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <style>
                .app-checkbox-label {
                    display: inline-flex;
                    align-items: center;
                    cursor: pointer;
                    font-family: inherit;
                    color: #333;
                    user-select: none;
                    margin-right: 15px;
                }

                .app-checkbox-label.disabled {
                    cursor: not-allowed;
                    color: #999;
                }

                .app-checkbox-input {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border: 2px solid #666;
                    border-radius: 2px;
                    margin-right: 8px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .app-checkbox-input:checked {
                    background-color: #5399a5;
                    border-color: #5399a5;
                }

                .app-checkbox-input:checked::after {
                    content: '';
                    position: absolute;
                    left: 5px;
                    top: 1px;
                    width: 4px;
                    height: 9px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .app-checkbox-input:disabled {
                    border-color: #ccc;
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                .app-checkbox-input:disabled:checked {
                    background-color: #ccc;
                }
            </style>

            <label class="app-checkbox-label ${this.disabled ? 'disabled' : ''}">
                <input 
                    type="checkbox" 
                    class="app-checkbox-input"
                    name="${this.name}"
                    value="${this.value}"
                    ?checked="${this.checked}"
                    ?disabled="${this.disabled}"
                    @change="${this._handleChange}"
                >
                ${this.label}
            </label>
        `;
    }

    _handleChange(e) {
        this.checked = e.target.checked;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { checked: this.checked, value: this.value },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('powdercloud-checkbox', PowdercloudCheckbox);
