import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudInput extends LitElement {
    static properties = {
        label: { type: String },
        value: { type: String },
        placeholder: { type: String },
        type: { type: String }, // 'text', 'password', 'email', 'number'
        disabled: { type: Boolean },
        required: { type: Boolean },
        error: { type: String }, // Error message
        helper: { type: String }, // Helper text
        name: { type: String },
        validators: { type: Array }
    };

    constructor() {
        super();
        this.label = 'Label';
        this.value = '';
        this.placeholder = '';
        this.type = 'text';
        this.disabled = false;
        this.required = false;
        this.error = '';
        this.helper = '';
        this.validators = [];
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    validate() {
        // 1. Check HTML5 Required
        if (this.required && (!this.value || this.value.trim() === '')) {
            this.error = 'This field is required.';
            return false;
        }

        // 2. Check Custom Validators
        if (this.validators && this.validators.length > 0) {
            for (const validator of this.validators) {
                const errorMsg = validator(this.value);
                if (errorMsg) {
                    this.error = errorMsg;
                    return false;
                }
            }
        }

        // 3. Clear Error if Valid
        this.error = '';
        return true;
    }

    render() {
        const hasValue = this.value && this.value.length > 0;
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

                .app-input-field {
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
                }

                .app-input-field:disabled {
                    color: #999;
                    cursor: not-allowed;
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

                /* Floating Label State */
                .app-input-field:focus + .app-input-label,
                .app-input-field:not(:placeholder-shown) + .app-input-label {
                    transform: translateY(-12px) scale(0.75);
                    color: #5399a5;
                }

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
                    <input 
                        class="app-input-field"
                        type="${this.type}"
                        name="${this.name}"
                        .value="${this.value}"
                        ?disabled="${this.disabled}"
                        ?required="${this.required}"
                        placeholder=" " 
                        @input="${this._handleInput}"
                        @focus="${this._handleFocus}"
                        @blur="${this._handleBlur}"
                    >
                    <label class="app-input-label">
                        ${this.label}${this.required ? ' *' : ''}
                    </label>
                </div>
                ${this.error || this.helper ? html`
                    <div class="app-input-helper ${isInvalid ? 'error' : ''}">
                        ${this.error || this.helper}
                    </div>
                ` : ''}
            </div>
        `;
    }

    _handleInput(e) {
        this.value = e.target.value;
        this.validate();
        this.dispatchEvent(new CustomEvent('input', {
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

customElements.define('powdercloud-input', PowdercloudInput);
