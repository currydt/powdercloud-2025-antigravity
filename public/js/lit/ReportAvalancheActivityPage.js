import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudLayout.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudCard.js';

export class ReportAvalancheActivityPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Avalanche Activity Report">
                <powdercloud-container>
                    <powdercloud-card>
                         <h2 style="margin-top: 0; color: #5399a5;">Avalanche Activity Analysis</h2>
                         <p>This report view is currently under development. To see the Avalanche Event Report data, please visit the <a href="/reports/avalanche_event.html">Avalanche Event Report</a>.</p>
                         <p style="color: grey; font-style: italic;">(This stub replaces the legacy ExtJS PivotGrid implementation)</p>
                    </powdercloud-card>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('report-avalanche-activity-page', ReportAvalancheActivityPage);
