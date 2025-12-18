import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudDivider extends LitElement {
    static properties = {
        vertical: { type: Boolean },
        spacing: { type: String } // 'small', 'medium', 'large'
    };

    constructor() {
        super();
        this.vertical = false;
        this.spacing = 'medium';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <style>
                .app-divider {
                    background-color: #e0e0e0;
                    margin: 0;
                    border: none;
                }

                .app-divider.horizontal {
                    height: 1px;
                    width: 100%;
                }

                .app-divider.vertical {
                    display: inline-block;
                    width: 1px;
                    height: 100%;
                    min-height: 1em;
                    vertical-align: middle;
                }

                /* Spacing */
                .app-divider.spacing-small { margin: 8px 0; }
                .app-divider.spacing-medium { margin: 16px 0; }
                .app-divider.spacing-large { margin: 24px 0; }

                .app-divider.vertical.spacing-small { margin: 0 8px; }
                .app-divider.vertical.spacing-medium { margin: 0 16px; }
                .app-divider.vertical.spacing-large { margin: 0 24px; }
            </style>

            <hr class="app-divider ${this.vertical ? 'vertical' : 'horizontal'} spacing-${this.spacing}">
        `;
    }
}

customElements.define('powdercloud-divider', PowdercloudDivider);
