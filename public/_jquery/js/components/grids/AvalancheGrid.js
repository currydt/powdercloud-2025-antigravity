import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';

export class AvalancheGrid extends LitElement {
    createRenderRoot() { return this; }

    render() {
        const columns = [
            { header: 'Date', field: 'date_time_start', width: '15%' },
            { header: 'Location', field: 'terrain_desc', width: '20%' },
            { header: 'Type', field: 'type_desc', width: '15%' },
            { header: 'Size', field: 'destructive_size_max_code', width: '10%' },
            { header: 'Trigger', field: 'trigger_code', width: '10%' },
            { header: 'Aspect', field: 'aspect_start_code', width: '10%' },
            { header: 'Elevation', field: 'elevation_min', width: '10%' }
        ];

        const data = [
            { date_time_start: '2025-11-29 10:30', terrain_desc: 'North Bowl', type_desc: 'Slab', destructive_size_max_code: '2.0', trigger_code: 'Na', aspect_start_code: 'N', elevation_min: '2200' },
            { date_time_start: '2025-11-28 14:15', terrain_desc: 'West Face', type_desc: 'Loose Wet', destructive_size_max_code: '1.0', trigger_code: 'Sc', aspect_start_code: 'W', elevation_min: '1800' }
        ];

        return html`
            <dashboard-grid .columns="${columns}" .data="${data}"></dashboard-grid>
        `;
    }
}

customElements.define('avalanche-grid', AvalancheGrid);
