import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppCombobox extends LitElement {
    static properties = {
        label: { type: String },
        value: { type: String },
        options: { type: Array }, // [{label: 'A', value: 'a'}]
        placeholder: { type: String },
        disabled: { type: Boolean },
        _isOpen: { state: true },
        _filter: { state: true },
        _displayValue: { state: true }
    };

    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.options = [];
        this.placeholder = '';
        this.disabled = false;
        this._isOpen = false;
        this._filter = '';
        this._displayValue = '';
        this._handleDocumentClick = this._handleDocumentClick.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._handleDocumentClick);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._handleDocumentClick);
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    willUpdate(changedProperties) {
        if (changedProperties.has('value') || changedProperties.has('options')) {
            const selected = this.options.find(o => o.value === this.value);
            this._displayValue = selected ? selected.label : '';
            if (!this._isOpen) {
                this._filter = this._displayValue;
            }
        }
    }

    _handleDocumentClick(e) {
        if (!this.contains(e.target)) {
            this._isOpen = false;
            // Reset filter to current selected label
            const selected = this.options.find(o => o.value === this.value);
            this._filter = selected ? selected.label : '';
            this.requestUpdate();
        }
    }

    _handleInput(e) {
        this._filter = e.target.value;
        this._isOpen = true;
        this.requestUpdate();
    }

    _handleFocus() {
        if (!this.disabled) {
            this._isOpen = true;
            this._filter = ''; // Clear filter on focus to show all options? Or keep?
            // Let's keep filter empty on focus to allow searching, or select all text.
            // For now, simple behavior:
            this.requestUpdate();
        }
    }

    _handleOptionClick(option) {
        this.value = option.value;
        this._filter = option.label;
        this._isOpen = false;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: this.value, option: option },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const filteredOptions = this.options.filter(opt =>
            opt.label.toLowerCase().includes((this._filter || '').toLowerCase())
        );

        return html`
            <style>
                .app-combobox-container {
                    position: relative;
                    margin-bottom: 20px;
                    font-family: inherit;
                }

                .app-combobox-input-wrapper {
                    position: relative;
                    background-color: #f5f5f5;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 1px solid #999;
                }

                .app-combobox-input-wrapper.focused {
                    background-color: #e8e8e8;
                    border-bottom: 2px solid #5399a5;
                }

                .app-combobox-input {
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

                .app-combobox-label {
                    position: absolute;
                    left: 12px;
                    top: 18px;
                    font-size: 1rem;
                    color: #666;
                    pointer-events: none;
                    transition: all 0.2s ease;
                    transform-origin: left top;
                }

                .app-combobox-input:focus + .app-combobox-label,
                .app-combobox-input:not(:placeholder-shown) + .app-combobox-label {
                    transform: translateY(-12px) scale(0.75);
                    color: #5399a5;
                }

                .app-combobox-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: white;
                    border-radius: 0 0 4px 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    z-index: 1000;
                    max-height: 200px;
                    overflow-y: auto;
                    display: none;
                }

                .app-combobox-dropdown.open {
                    display: block;
                }

                .app-combobox-option {
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background 0.1s;
                }

                .app-combobox-option:hover {
                    background-color: #f5f5f5;
                }

                .app-combobox-option.selected {
                    background-color: #e3f2fd;
                    color: #1976d2;
                }
                
                .app-combobox-icon {
                    position: absolute;
                    right: 12px;
                    top: 18px;
                    color: #666;
                    pointer-events: none;
                }
            </style>

            <div class="app-combobox-container">
                <div class="app-combobox-input-wrapper ${this._isOpen ? 'focused' : ''}">
                    <input 
                        class="app-combobox-input"
                        type="text"
                        .value="${this._filter}"
                        placeholder=" "
                        ?disabled="${this.disabled}"
                        @input="${this._handleInput}"
                        @focus="${this._handleFocus}"
                    >
                    <label class="app-combobox-label">${this.label}</label>
                    <i class="fa fa-chevron-down app-combobox-icon"></i>
                </div>

                <div class="app-combobox-dropdown ${this._isOpen ? 'open' : ''}">
                    ${filteredOptions.length > 0 ? filteredOptions.map(opt => html`
                        <div 
                            class="app-combobox-option ${opt.value === this.value ? 'selected' : ''}"
                            @click="${() => this._handleOptionClick(opt)}"
                        >
                            ${opt.label}
                        </div>
                    `) : html`
                        <div class="app-combobox-option" style="color: #999; cursor: default;">
                            No options found
                        </div>
                    `}
                </div>
            </div>
        `;
    }
}

customElements.define('app-combobox', AppCombobox);
