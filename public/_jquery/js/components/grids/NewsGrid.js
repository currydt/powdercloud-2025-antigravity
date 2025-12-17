import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';

export class NewsGrid extends LitElement {
    createRenderRoot() { return this; }

    render() {
        const columns = [
            { header: 'Date', field: 'date_time_start', width: '15%' },
            { header: 'Subject', field: 'subject', width: '40%' },
            { header: 'Author', field: 'author', width: '20%' },
            { header: 'Type', field: 'type', width: '15%' }
        ];

        const data = [
            { date_time_start: '2025-11-29 07:00', subject: 'Morning Meeting Notes', author: 'Ops Manager', type: 'Meeting' },
            { date_time_start: '2025-11-28 16:30', subject: 'End of Day Summary', author: 'Lead Guide', type: 'Summary' }
        ];

        return html`
            <dashboard-grid .columns="${columns}" .data="${data}"></dashboard-grid>
        `;
    }
}

customElements.define('news-grid', NewsGrid);
