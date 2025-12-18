import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudWeatherGrid.js';

export class ObservationMasterPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                Observations
            </h1>
            <p style="margin-bottom: 20px;">View and manage all observations.</p>

            <div style="border: 1px solid #ccc; padding: 10px; background: #fff;">
                <powdercloud-weather-grid></powdercloud-weather-grid>
            </div>
        `;
    }
}

customElements.define('observation-master-page', ObservationMasterPage);
