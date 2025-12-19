import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class ReportSnowpackPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                Snowpack Structure Report
            </h1>
            <p>Stub page for Snowpack Structure Report.</p>
        `;
    }
}

customElements.define('report-snowpack-page', ReportSnowpackPage);
