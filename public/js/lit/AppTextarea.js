import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppTextarea extends LitElement {
    static properties = {
        label: { type: String },
        value: { type: String },
        placeholder: { type: String },
        rows: { type: Number },
        disabled: { type: Boolean },
        required: { type: Boolean },
        error: { type: String },
        helper: { type: String },
        name: { type: String }
    };

    constructor() {
        super();
        this.label = 'Label';
        this.value = '';
        this.placeholder = '';
        this.rows = 4;
        this.disabled = false;
        this.required = false;
        this.error = '';
        this.helper = '';
    }

    createRenderRoot() {
        return this; // Light DOM
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

                .app-textarea-field {
                    width: 100%;
                    padding: 24px 12px 8px 12px;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #333;
                    outline: none;
                    box-sizing: border-box;
                    resize: vertical;
                    min-height: 56px;
                    font-family: inherit;
                }

                .app-textarea-field:disabled {
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
                .app-textarea-field:focus + .app-input-label,
                .app-textarea-field:not(:placeholder-shown) + .app-input-label {
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
                    <textarea 
                        class="app-textarea-field"
                        name="${this.name}"
                        rows="${this.rows}"
                        ?disabled="${this.disabled}"
                        ?required="${this.required}"
                        placeholder=" " 
                        @input="${this._handleInput}"
                        @focus="${this._handleFocus}"
                        @blur="${this._handleBlur}"
                    >${this.value}</textarea>
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

customElements.define('app-textarea', AppTextarea);
