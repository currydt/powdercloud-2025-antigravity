import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppFieldset extends LitElement {
    static properties = {
        legend: { type: String }
    };

    constructor() {
        super();
        this.legend = '';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <style>
                .app-fieldset {
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 20px;
                    margin-bottom: 20px;
                    background-color: #fff;
                }

                .app-legend {
                    font-family: inherit;
                    font-weight: 600;
                    color: #5399a5;
                    padding: 0 10px;
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            </style>

            <fieldset class="app-fieldset">
                ${this.legend ? html`<legend class="app-legend">${this.legend}</legend>` : ''}
                <slot></slot>
            </fieldset>
        `;
    }
}

customElements.define('app-fieldset', AppFieldset);
