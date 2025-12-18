import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppRadio extends LitElement {
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
                .app-radio-label {
                    display: inline-flex;
                    align-items: center;
                    cursor: pointer;
                    font-family: inherit;
                    color: #333;
                    user-select: none;
                    margin-right: 15px;
                }

                .app-radio-label.disabled {
                    cursor: not-allowed;
                    color: #999;
                }

                .app-radio-input {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border: 2px solid #666;
                    border-radius: 50%;
                    margin-right: 8px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .app-radio-input:checked {
                    border-color: #5399a5;
                }

                .app-radio-input:checked::after {
                    content: '';
                    position: absolute;
                    left: 3px;
                    top: 3px;
                    width: 8px;
                    height: 8px;
                    background-color: #5399a5;
                    border-radius: 50%;
                }

                .app-radio-input:disabled {
                    border-color: #ccc;
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                .app-radio-input:disabled:checked::after {
                    background-color: #ccc;
                }
            </style>

            <label class="app-radio-label ${this.disabled ? 'disabled' : ''}">
                <input 
                    type="radio" 
                    class="app-radio-input"
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
        // Radio buttons only fire change when checked
        if (e.target.checked) {
            this.checked = true;
            this.dispatchEvent(new CustomEvent('change', {
                detail: { checked: true, value: this.value },
                bubbles: true,
                composed: true
            }));
        }
    }
}

customElements.define('app-radio', AppRadio);
