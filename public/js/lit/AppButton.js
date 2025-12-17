import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppButton extends LitElement {
    static properties = {
        label: { type: String },
        variant: { type: String }, // 'primary', 'secondary', 'outline', 'text', 'danger'
        size: { type: String },    // 'small', 'medium', 'large'
        disabled: { type: Boolean },
        icon: { type: String },    // Optional icon class (e.g., 'fa fa-save')
        type: { type: String }     // 'button', 'submit', 'reset'
    };

    constructor() {
        super();
        this.label = 'Button';
        this.variant = 'primary';
        this.size = 'medium';
        this.disabled = false;
        this.type = 'button';
    }

    createRenderRoot() {
        return this; // Light DOM for global font inheritance
    }

    render() {
        // Base styles are defined here to travel with the component in Light DOM
        // We use a unique class prefix 'app-btn' to avoid conflicts
        return html`
            <style>
                .app-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-family: inherit;
                    font-weight: 500;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                    outline: none;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    position: relative;
                    overflow: hidden;
                }

                .app-btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }

                /* Sizes */
                .app-btn.small {
                    padding: 6px 12px;
                    font-size: 0.75rem;
                }
                .app-btn.medium {
                    padding: 10px 20px;
                    font-size: 0.875rem;
                }
                .app-btn.large {
                    padding: 14px 28px;
                    font-size: 1rem;
                }

                /* Variants */
                .app-btn.primary {
                    background-color: #5399a5;
                    color: white;
                    border-color: #5399a5;
                }
                .app-btn.primary:hover:not(:disabled) {
                    background-color: #427c86;
                    border-color: #427c86;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .app-btn.secondary {
                    background-color: #6c757d;
                    color: white;
                    border-color: #6c757d;
                }
                .app-btn.secondary:hover:not(:disabled) {
                    background-color: #5a6268;
                    border-color: #545b62;
                }

                .app-btn.outline {
                    background-color: transparent;
                    color: #5399a5;
                    border-color: #5399a5;
                }
                .app-btn.outline:hover:not(:disabled) {
                    background-color: rgba(83, 153, 165, 0.1);
                }

                .app-btn.text {
                    background-color: transparent;
                    color: #5399a5;
                    border-color: transparent;
                    box-shadow: none;
                }
                .app-btn.text:hover:not(:disabled) {
                    background-color: rgba(83, 153, 165, 0.1);
                }

                .app-btn.danger {
                    background-color: #dc3545;
                    color: white;
                    border-color: #dc3545;
                }
                .app-btn.danger:hover:not(:disabled) {
                    background-color: #c82333;
                    border-color: #bd2130;
                }

                /* Ripple Effect (Simple CSS version) */
                .app-btn:active:not(:disabled) {
                    transform: translateY(1px);
                    box-shadow: none;
                }
            </style>

            <button 
                class="app-btn ${this.variant} ${this.size}" 
                ?disabled="${this.disabled}"
                type="${this.type}"
                @click="${this._handleClick}"
            >
                ${this.icon ? html`<i class="${this.icon}"></i>` : ''}
                ${this.label}
            </button>
        `;
    }

    _handleClick(e) {
        if (this.disabled) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}

customElements.define('app-button', AppButton);
