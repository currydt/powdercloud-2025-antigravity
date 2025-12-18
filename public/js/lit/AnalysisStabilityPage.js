import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/PowdercloudDashboardChart.js';
import './components/DashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudCard.js';

export class AnalysisStabilityPage extends LitElement {
    static properties = {
        _stabilityChartData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._stabilityChartData = this._generateMockStabilityData();
        this._gridData = this._generateMockGridData();
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _generateMockStabilityData() {
        const alpine = [];
        const treeline = [];
        const belowTreeline = [];
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            alpine.push([date.getTime(), Math.floor(Math.random() * 5) + 1]); // 1-5
            treeline.push([date.getTime(), Math.floor(Math.random() * 4) + 2]); // 2-5
            belowTreeline.push([date.getTime(), Math.floor(Math.random() * 3) + 3]); // 3-5
        }
        return { alpine, treeline, belowTreeline };
    }

    _generateMockGridData() {
        return [
            { date: '2025-11-29', operation: 'Whistler', location: 'Peak', alpine: 'Poor', treeline: 'Fair', below: 'Good', trend: 'Steady' },
            { date: '2025-11-28', operation: 'Blackcomb', location: 'Glacier', alpine: 'Fair', treeline: 'Good', below: 'V. Good', trend: 'Improving' },
            { date: '2025-11-27', operation: 'Whistler', location: 'Bowl', alpine: 'Poor', treeline: 'Poor', below: 'Fair', trend: 'Declining' }
        ];
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Stability Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Stability', value: 'stability' }]}"
                    selectedMode="stability"
                    showDateRange
                ></filter-panel>

                <br />

                <powdercloud-card title="Stability Ratings Overview">
                    <powdercloud-dashboard-chart
                        title="Stability Ratings Over Time"
                        type="line"
                        .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Stability Level' },
                    categories: ['', 'Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'],
                    min: 1, max: 5
                },
                series: [
                    { name: 'Alpine', data: this._stabilityChartData.alpine, color: '#FF0000' },
                    { name: 'Treeline', data: this._stabilityChartData.treeline, color: '#FFA500' },
                    { name: 'Below Treeline', data: this._stabilityChartData.belowTreeline, color: '#00FF00' }
                ]
            }}"
                    ></powdercloud-dashboard-chart>
                </powdercloud-card>

                <br />

                <dashboard-grid
                    title="Stability Records"
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

customElements.define('analysis-stability-page', AnalysisStabilityPage);
