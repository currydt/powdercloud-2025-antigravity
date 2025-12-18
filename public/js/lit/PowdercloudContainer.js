import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudContainer extends LitElement {
    static properties = {
        fluid: { type: Boolean } // If true, width is 100%. If false, max-width is applied.
    };

    constructor() {
        super();
        this.fluid = false;
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <style>
                .app-container {
                    width: 100%;
                    margin-right: auto;
                    margin-left: auto;
                    padding-right: 16px;
                    padding-left: 16px;
                    box-sizing: border-box;
                }

                .app-container:not(.fluid) {
                    max-width: 1200px;
                }

                /* Responsive max-widths for non-fluid containers */
                @media (min-width: 576px) { .app-container:not(.fluid) { max-width: 540px; } }
                @media (min-width: 768px) { .app-container:not(.fluid) { max-width: 720px; } }
                @media (min-width: 992px) { .app-container:not(.fluid) { max-width: 960px; } }
                @media (min-width: 1200px) { .app-container:not(.fluid) { max-width: 1140px; } }
                @media (min-width: 1400px) { .app-container:not(.fluid) { max-width: 1320px; } }
            </style>
            <div class="app-container ${this.fluid ? 'fluid' : ''}">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('powdercloud-container', PowdercloudContainer);
