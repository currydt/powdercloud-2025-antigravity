import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppGrid extends LitElement {
    static properties = {
        cols: { type: Number },      // Default columns (mobile first)
        colsMd: { type: Number },    // Columns on medium screens
        colsLg: { type: Number },    // Columns on large screens
        gap: { type: String }        // 'none', 'sm', 'md', 'lg', 'xl'
    };

    constructor() {
        super();
        this.cols = 1;
        this.gap = 'md';
    }

    createRenderRoot() {
        return this;
    }

    render() {
        const gapMap = {
            'none': '0',
            'sm': '8px',
            'md': '16px',
            'lg': '24px',
            'xl': '32px'
        };
        const gapSize = gapMap[this.gap] || '16px';

        return html`
            <style>
                .app-grid {
                    display: grid;
                    width: 100%;
                    gap: var(--grid-gap, 16px);
                    grid-template-columns: repeat(var(--cols-default, 1), 1fr);
                }

                @media (min-width: 768px) {
                    .app-grid {
                        grid-template-columns: repeat(var(--cols-md, var(--cols-default)), 1fr);
                    }
                }

                @media (min-width: 1200px) {
                    .app-grid {
                        grid-template-columns: repeat(var(--cols-lg, var(--cols-md, var(--cols-default))), 1fr);
                    }
                }
            </style>
            <div class="app-grid" style="
                --grid-gap: ${gapSize};
                --cols-default: ${this.cols};
                ${this.colsMd ? `--cols-md: ${this.colsMd};` : ''}
                ${this.colsLg ? `--cols-lg: ${this.colsLg};` : ''}
            ">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('app-grid', AppGrid);
