import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudChip extends LitElement {
    static properties = {
        label: { type: String },
        removable: { type: Boolean },
        variant: { type: String }, // 'default', 'outline', 'primary'
        icon: { type: String }
    };

    constructor() {
        super();
        this.label = '';
        this.removable = false;
        this.variant = 'default';
        this.icon = '';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <style>
                .app-chip {
                    display: inline-flex;
                    align-items: center;
                    height: 32px;
                    padding: 0 12px;
                    border-radius: 16px;
                    font-size: 0.875rem;
                    font-family: inherit;
                    color: #333;
                    background-color: #e0e0e0;
                    margin-right: 8px;
                    margin-bottom: 8px;
                    user-select: none;
                    transition: background-color 0.2s;
                    border: 1px solid transparent;
                }

                /* Variants */
                .app-chip.primary {
                    background-color: #e0f2f1;
                    color: #00695c;
                }

                .app-chip.outline {
                    background-color: transparent;
                    border-color: #bdbdbd;
                    color: #666;
                }

                /* Icon */
                .app-chip i {
                    margin-right: 6px;
                    font-size: 1.1em;
                    color: inherit;
                    opacity: 0.7;
                }

                /* Remove Button */
                .app-chip-remove {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    margin-left: 8px;
                    margin-right: -4px;
                    border-radius: 50%;
                    background-color: rgba(0,0,0,0.1);
                    cursor: pointer;
                    font-size: 12px;
                    line-height: 1;
                }

                .app-chip-remove:hover {
                    background-color: rgba(0,0,0,0.2);
                }
            </style>

            <span class="app-chip ${this.variant}">
                ${this.icon ? html`<i class="${this.icon}"></i>` : ''}
                ${this.label}
                ${this.removable ? html`
                    <span class="app-chip-remove" @click="${this._handleRemove}">✕</span>
                ` : ''}
            </span>
        `;
    }

    _handleRemove(e) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('remove', {
            detail: { label: this.label },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('powdercloud-chip', PowdercloudChip);
