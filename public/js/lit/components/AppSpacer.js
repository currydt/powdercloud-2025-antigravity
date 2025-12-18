import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppSpacer extends LitElement {
    static properties = {
        x: { type: Number }, // Horizontal space multiplier (x * 8px)
        y: { type: Number }  // Vertical space multiplier (y * 8px)
    };

    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <style>
                .app-spacer {
                    display: block;
                    flex-shrink: 0;
                }
            </style>
            <div class="app-spacer" style="
                width: calc(${this.x} * 8px);
                height: calc(${this.y} * 8px);
            "></div>
        `;
    }
}

customElements.define('app-spacer', AppSpacer);
