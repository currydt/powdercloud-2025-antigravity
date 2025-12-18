import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppStack extends LitElement {
    static properties = {
        direction: { type: String }, // 'row' or 'column'
        gap: { type: String },       // 'none', 'sm', 'md', 'lg', 'xl'
        align: { type: String },     // 'start', 'center', 'end', 'stretch', 'baseline'
        justify: { type: String },   // 'start', 'center', 'end', 'between', 'around', 'evenly'
        wrap: { type: Boolean }      // Allow wrapping
    };

    constructor() {
        super();
        this.direction = 'column';
        this.gap = 'md';
        this.align = 'stretch';
        this.justify = 'start';
        this.wrap = false;
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

        const alignMap = {
            'start': 'flex-start',
            'center': 'center',
            'end': 'flex-end',
            'stretch': 'stretch',
            'baseline': 'baseline'
        };

        const justifyMap = {
            'start': 'flex-start',
            'center': 'center',
            'end': 'flex-end',
            'between': 'space-between',
            'around': 'space-around',
            'evenly': 'space-evenly'
        };

        return html`
            <style>
                .app-stack {
                    display: flex;
                    box-sizing: border-box;
                }
            </style>
            <div class="app-stack" style="
                flex-direction: ${this.direction};
                gap: ${gapMap[this.gap] || '16px'};
                align-items: ${alignMap[this.align] || 'stretch'};
                justify-content: ${justifyMap[this.justify] || 'flex-start'};
                flex-wrap: ${this.wrap ? 'wrap' : 'nowrap'};
            ">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('app-stack', AppStack);
