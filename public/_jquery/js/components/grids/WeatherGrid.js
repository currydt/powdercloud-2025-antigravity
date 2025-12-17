import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../DashboardGrid.js';

export class WeatherGrid extends LitElement {
    createRenderRoot() { return this; }

    render() {
        const columns = [
            { header: 'Date', field: 'date_time_start', width: '15%' },
            { header: 'Location', field: 'terrain_desc', width: '20%' },
            { header: 'Sky', field: 'sky_condition_code', width: '10%' },
            { header: 'Precip', field: 'precipitation_type_rate_code', width: '10%' },
            { header: 'Temp (Min)', field: 'air_temperature_min', width: '10%' },
            { header: 'Temp (Max)', field: 'air_temperature_max', width: '10%' },
            { header: 'HN24', field: 'hn24_accumulated', width: '10%' },
            { header: 'HS', field: 'hs_accumulated', width: '10%' }
        ];

        // Mock data for visual verification
        const data = [
            { date_time_start: '2025-11-29 08:00', terrain_desc: 'Study Plot 1', sky_condition_code: 'OVC', precipitation_type_rate_code: 'S-1', air_temperature_min: '-5.0', air_temperature_max: '-2.0', hn24_accumulated: '15', hs_accumulated: '120' },
            { date_time_start: '2025-11-29 08:00', terrain_desc: 'Ridge Top', sky_condition_code: 'OVC', precipitation_type_rate_code: 'S-1', air_temperature_min: '-8.0', air_temperature_max: '-6.0', hn24_accumulated: '20', hs_accumulated: '210' },
            { date_time_start: '2025-11-28 08:00', terrain_desc: 'Study Plot 1', sky_condition_code: 'SCT', precipitation_type_rate_code: 'Nil', air_temperature_min: '-10.0', air_temperature_max: '-4.0', hn24_accumulated: '0', hs_accumulated: '105' }
        ];

        return html`
            <dashboard-grid .columns="${columns}" .data="${data}"></dashboard-grid>
        `;
    }
}

customElements.define('weather-grid', WeatherGrid);
