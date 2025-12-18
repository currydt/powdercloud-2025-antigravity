import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudTerrainAtlasGrid.js';

export class AdminAtlasPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                Operation Terrains Atlas
            </h1>
            <p style="margin-bottom: 20px;">Manage operation terrain locations.</p>
            
            <powdercloud-terrain-atlas-grid></powdercloud-terrain-atlas-grid>
        `;
    }
}

customElements.define('admin-atlas-page', AdminAtlasPage);
