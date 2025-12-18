import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/PowdercloudDashboardChart.js';
import './components/DashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudCard.js';

export class AnalysisDangerPage extends LitElement {
    static properties = {
        _dangerChartData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._dangerChartData = this._generateMockDangerData();
        this._gridData = this._generateMockGridData();
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _generateMockDangerData() {
        const alpine = [];
        const treeline = [];
        const belowTreeline = [];
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            alpine.push([date.getTime(), Math.floor(Math.random() * 4) + 1]); // 1-5
            treeline.push([date.getTime(), Math.floor(Math.random() * 3) + 1]); // 1-4
            belowTreeline.push([date.getTime(), Math.floor(Math.random() * 2) + 1]); // 1-3
        }
        return { alpine, treeline, belowTreeline };
    }

    _generateMockGridData() {
        return [
            { date: '2025-11-29', operation: 'Whistler', location: 'Peak', alpine: 'High', treeline: 'Cons.', below: 'Mod.', trend: 'Steady' },
            { date: '2025-11-28', operation: 'Blackcomb', location: 'Glacier', alpine: 'Cons.', treeline: 'Mod.', below: 'Low', trend: 'Decreasing' },
            { date: '2025-11-27', operation: 'Whistler', location: 'Bowl', alpine: 'High', treeline: 'High', below: 'Cons.', trend: 'Increasing' }
        ];
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Danger Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Danger', value: 'danger' }]}"
                    selectedMode="danger"
                    showDateRange
                ></filter-panel>

                <br />

                <powdercloud-card title="Danger Ratings Overview">
                    <powdercloud-dashboard-chart
                        title="Danger Ratings Over Time"
                        type="line"
                        .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Danger Level' },
                    categories: ['', 'Low', 'Moderate', 'Considerable', 'High', 'Extreme'],
                    min: 1, max: 5
                },
                series: [
                    { name: 'Alpine', data: this._dangerChartData.alpine, color: '#FF0000' },
                    { name: 'Treeline', data: this._dangerChartData.treeline, color: '#FFA500' },
                    { name: 'Below Treeline', data: this._dangerChartData.belowTreeline, color: '#FFFF00' }
                ]
            }}"
                    ></powdercloud-dashboard-chart>
                </powdercloud-card>

                <br />

                <dashboard-grid
                    title="Danger Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Alpine', field: 'alpine' },
                { header: 'Treeline', field: 'treeline' },
                { header: 'Below TL', field: 'below' },
                { header: 'Trend', field: 'trend' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></dashboard-grid>
            </powdercloud-container>
        `;
    }
}

customElements.define('analysis-danger-page', AnalysisDangerPage);
