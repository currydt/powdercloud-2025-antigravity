import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';

export class StabilityGrid extends LitElement {
    createRenderRoot() { return this; }

    render() {
        const columns = [
            { header: 'Date', field: 'date_time_start', width: '15%' },
            { header: 'Location', field: 'terrain_desc', width: '20%' },
            { header: 'Alpine', field: 'rating_alpine', width: '15%' },
            { header: 'Treeline', field: 'rating_tl', width: '15%' },
            { header: 'Below TL', field: 'rating_btl', width: '15%' },
            { header: 'Confidence', field: 'confidence', width: '10%' }
        ];

        const data = [
            { date_time_start: '2025-11-29 06:00', terrain_desc: 'Region A', rating_alpine: 'Considerable', rating_tl: 'Moderate', rating_btl: 'Low', confidence: 'Good' },
            { date_time_start: '2025-11-28 06:00', terrain_desc: 'Region A', rating_alpine: 'Moderate', rating_tl: 'Moderate', rating_btl: 'Low', confidence: 'Fair' }
        ];

        return html`
            <dashboard-grid .columns="${columns}" .data="${data}"></dashboard-grid>
        `;
    }
}

customElements.define('stability-grid', StabilityGrid);
