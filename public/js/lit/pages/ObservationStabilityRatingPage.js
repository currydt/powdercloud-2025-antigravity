import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudStabilityGrid.js';

export class ObservationStabilityRatingPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                Stability Rating
            </h1>
            <p style="margin-bottom: 20px;">Manage stability and danger ratings.</p>
            
            <powdercloud-stability-grid></powdercloud-stability-grid>
        `;
    }
}

customElements.define('observation-stability-rating-page', ObservationStabilityRatingPage);
