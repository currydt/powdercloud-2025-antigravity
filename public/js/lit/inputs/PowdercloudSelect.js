import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudSelect extends LitElement {
    static properties = {
        label: { type: String },
        value: { type: String },
        options: { type: Array }, // Array of { label, value, group? }
        disabled: { type: Boolean },
        required: { type: Boolean },
        error: { type: String },
        helper: { type: String },
        name: { type: String }
    };

    constructor() {
        super();
        this.label = 'Select Option';
        this.value = '';
        this.options = [];
        this.disabled = false;
        this.required = false;
        this.error = '';
        this.helper = '';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const isInvalid = this.error && this.error.length > 0;

        return html`
            <style>
                .app-input-container {
                    position: relative;
                    margin-bottom: 20px;
                    font-family: inherit;
                }

                .app-input-wrapper {
                    position: relative;
                    background-color: #f5f5f5;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 1px solid #999;
                    transition: background-color 0.2s;
                }

                .app-input-wrapper:hover {
                    background-color: #ececec;
                }

                .app-input-wrapper.focused {
                    background-color: #e8e8e8;
                    border-bottom: 2px solid #5399a5;
                }

                .app-input-wrapper.error {
                    border-bottom-color: #dc3545;
                }

                .app-input-wrapper.disabled {
                    background-color: #f9f9f9;
                    border-bottom: 1px dotted #ccc;
                    cursor: not-allowed;
                }

                .app-select-field {
                    width: 100%;
                    padding: 24px 12px 8px 12px;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #333;
                    outline: none;
                    box-sizing: border-box;
                    height: 56px;
                    appearance: none; /* Remove default arrow */
                    -webkit-appearance: none;
                    cursor: pointer;
                }

                .app-select-field:disabled {
                    color: #999;
                    cursor: not-allowed;
                }

                /* Custom Arrow */
                .app-select-arrow {
                    position: absolute;
                    right: 12px;
                    top: 20px;
                    pointer-events: none;
                    color: #666;
                    font-size: 0.8em;
                }

                .app-input-label {
                    position: absolute;
                    left: 12px;
                    top: 18px;
                    font-size: 1rem;
                    color: #666;
                    pointer-events: none;
                    transition: all 0.2s ease;
                    transform-origin: left top;
                }

                /* Always float label for Select if it has a value or is focused, 
                   but standard select always shows something (even empty option), 
                   so we usually keep label floating or use a placeholder logic.
                   For Material Select, label usually floats if a value is selected. */
                
                .app-select-field:focus + .app-input-label,
                .app-select-field:not([value=""]) + .app-input-label,
                .app-select-field:valid + .app-input-label {
                     transform: translateY(-12px) scale(0.75);
                     color: #5399a5;
                }

                /* If value is empty string, we might want label to sit inside. 
                   But native select is tricky. Let's force float if we have a value. */
                
                .app-input-wrapper.error .app-input-label {
                    color: #dc3545;
                }
                
                .app-input-wrapper.disabled .app-input-label {
                    color: #aaa;
                }

                .app-input-helper {
                    font-size: 0.75rem;
                    color: #666;
                    padding: 4px 12px 0 12px;
                    min-height: 1.2em;
                }

                .app-input-helper.error {
                    color: #dc3545;
                }
            </style>

            <div class="app-input-container">
                <div class="app-input-wrapper ${isInvalid ? 'error' : ''} ${this.disabled ? 'disabled' : ''}">
                    <select 
                        class="app-select-field"
                        name="${this.name}"
                        ?disabled="${this.disabled}"
                        ?required="${this.required}"
                        @change="${this._handleChange}"
                        @focus="${this._handleFocus}"
                        @blur="${this._handleBlur}"
                    >
                        <option value="" disabled ?selected="${!this.value}"></option>
                        ${this.options.map(opt => {
            if (opt.group) {
                return html`
                                    <optgroup label="${opt.label}">
                                        ${opt.options.map(subOpt => html`
                                            <option value="${subOpt.value}" ?selected="${this.value === subOpt.value}">
                                                ${subOpt.label}
                                            </option>
                                        `)}
                                    </optgroup>
                                `;
            }
            return html`
                                <option value="${opt.value}" ?selected="${this.value === opt.value}">
                                    ${opt.label}
                                </option>
                            `;
        })}
                    </select>
                    <label class="app-input-label">
                        ${this.label}${this.required ? ' *' : ''}
                    </label>
                    <div class="app-select-arrow">▼</div>
                </div>
                ${this.error || this.helper ? html`
                    <div class="app-input-helper ${isInvalid ? 'error' : ''}">
                        ${this.error || this.helper}
                    </div>
                ` : ''}
            </div>
        `;
    }

    _handleChange(e) {
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    _handleFocus(e) {
        e.target.closest('.app-input-wrapper').classList.add('focused');
    }

    _handleBlur(e) {
        e.target.closest('.app-input-wrapper').classList.remove('focused');
    }
}

customElements.define('powdercloud-select', PowdercloudSelect);
