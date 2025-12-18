import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudSwitch extends LitElement {
    static properties = {
        label: { type: String },
        checked: { type: Boolean },
        disabled: { type: Boolean },
        name: { type: String }
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
                .app-switch-label {
                    display: inline-flex;
                    align-items: center;
                    cursor: pointer;
                    font-family: inherit;
                    color: #333;
                    user-select: none;
                    margin-right: 15px;
                }

                .app-switch-label.disabled {
                    cursor: not-allowed;
                    color: #999;
                }

                .app-switch-track {
                    position: relative;
                    width: 36px;
                    height: 14px;
                    background-color: #b0b0b0;
                    border-radius: 7px;
                    margin-right: 12px;
                    transition: background-color 0.2s;
                }

                .app-switch-thumb {
                    position: absolute;
                    top: -3px;
                    left: -2px;
                    width: 20px;
                    height: 20px;
                    background-color: #f5f5f5;
                    border-radius: 50%;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
                    transition: transform 0.2s;
                }

                /* Checked State */
                .app-switch-input:checked + .app-switch-track {
                    background-color: #9bc5cd; /* Light version of primary */
                }

                .app-switch-input:checked + .app-switch-track .app-switch-thumb {
                    background-color: #5399a5;
                    transform: translateX(20px);
                }

                /* Disabled State */
                .app-switch-input:disabled + .app-switch-track {
                    background-color: #e0e0e0;
                }
                .app-switch-input:disabled + .app-switch-track .app-switch-thumb {
                    background-color: #bdbdbd;
                }

                .app-switch-input {
                    display: none;
                }
            </style>

            <label class="app-switch-label ${this.disabled ? 'disabled' : ''}">
                <input 
                    type="checkbox" 
                    class="app-switch-input"
                    name="${this.name}"
                    ?checked="${this.checked}"
                    ?disabled="${this.disabled}"
                    @change="${this._handleChange}"
                >
                <div class="app-switch-track">
                    <div class="app-switch-thumb"></div>
                </div>
                ${this.label}
            </label>
        `;
    }

    _handleChange(e) {
        this.checked = e.target.checked;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { checked: this.checked },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('powdercloud-switch', PowdercloudSwitch);
