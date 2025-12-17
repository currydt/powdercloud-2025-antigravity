import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';

export class SnowpackGrid extends LitElement {
    createRenderRoot() { return this; }

    render() {
        const columns = [
            { header: 'Date', field: 'date_time_start', width: '15%' },
            { header: 'Location', field: 'terrain_desc', width: '20%' },
            { header: 'Structure', field: 'structure_desc', width: '30%' },
            { header: 'Test Result', field: 'test_result', width: '20%' },
            { header: 'Observer', field: 'observer_desc', width: '15%' }
        ];

        const data = [
            { date_time_start: '2025-11-29 09:00', terrain_desc: 'Study Plot 1', structure_desc: 'Facets on Crust', test_result: 'CT12 SP @ 45cm', observer_desc: 'J. Doe' },
            { date_time_start: '2025-11-28 11:00', terrain_desc: 'Ridge Top', structure_desc: 'Wind Slab', test_result: 'ECTP 15 @ 20cm', observer_desc: 'A. Smith' }
        ];

        return html`
            <dashboard-grid .columns="${columns}" .data="${data}"></dashboard-grid>
        `;
    }
}

customElements.define('snowpack-grid', SnowpackGrid);
