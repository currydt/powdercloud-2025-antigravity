import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudFilterPanel.js';
import './components/PowdercloudDashboardChart.js';
import './components/PowdercloudDashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudCard.js';

export class AnalysisAvalancheActivityPage extends LitElement {
    static properties = {
        _chartData: { state: true },
        _failureTypeData: { state: true },
        _triggerTypeData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._chartData = this._generateMockTimeData();
        this._failureTypeData = [5, 12, 3, 8, 2, 0, 1]; // S, L, LS, C, CS, I, IS
        this._triggerTypeData = [10, 5, 2, 1, 0, 0, 0, 0, 0, 0]; // N, X, S, B, C, M, V, H, O, U
        this._gridData = this._generateMockGridData();
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _generateMockTimeData() {
        const data = [];
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            // Random count between 0 and 10
            data.push([date.getTime(), Math.floor(Math.random() * 10)]);
        }
        return data;
    }

    _generateMockGridData() {
        return [
            { id: 1, date: '2025-11-29 14:30', operation: 'Whistler', location: 'Bowl 1', type: 'Slab', size: '2.5', trigger: 'Skier' },
            { id: 2, date: '2025-11-29 10:15', operation: 'Blackcomb', location: 'Chute 3', type: 'Loose', size: '1.0', trigger: 'Natural' },
            { id: 3, date: '2025-11-28 16:45', operation: 'Whistler', location: 'Ridge', type: 'Slab', size: '1.5', trigger: 'Explosive' },
            { id: 4, date: '2025-11-28 09:00', operation: 'Blackcomb', location: 'Glacier', type: 'Slab', size: '2.0', trigger: 'Natural' },
            { id: 5, date: '2025-11-27 11:20', operation: 'Whistler', location: 'Trees', type: 'Loose', size: '1.0', trigger: 'Skier' }
        ];
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Avalanche Activity Analysis
                </h1>

                <powdercloud-filter-panel 
                    .modes="${[{ label: 'Operation', value: 'operation' }]}"
                    selectedMode="operation"
                    showDateRange
                ></powdercloud-filter-panel>

                <br />

                <powdercloud-card title="Avalanche Activity Overview">
                    <powdercloud-dashboard-chart
                        title="Number of Avalanches"
                        type="column"
                        .options="${{
                xAxis: { type: 'datetime' },
                yAxis: { title: { text: 'Count' } },
                series: [{ name: 'Avalanches', data: this._chartData, color: '#4572A7' }]
            }}"
                    ></powdercloud-dashboard-chart>
                </powdercloud-card>

                <br />

                <powdercloud-grid cols="2" gap="lg">
                    <powdercloud-card title="Failure Types">
                        <powdercloud-dashboard-chart
                            title="Failure Types"
                            type="bar"
                            .options="${{
                xAxis: { categories: ['S', 'L', 'LS', 'C', 'CS', 'I', 'IS'] },
                yAxis: { title: { text: null } },
                series: [{ name: 'Count', data: this._failureTypeData, color: '#AA4643' }]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Trigger Types">
                        <powdercloud-dashboard-chart
                            title="Trigger Types"
                            type="bar"
                            .options="${{
                xAxis: { categories: ['N', 'X', 'S', 'B', 'C', 'M', 'V', 'H', 'O', 'U'] },
                yAxis: { title: { text: null } },
                series: [{ name: 'Count', data: this._triggerTypeData, color: '#89A54E' }]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>
                </powdercloud-grid>

                <br />

                <powdercloud-dashboard-grid
                    title="Avalanche Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Size', field: 'size' },
                { header: 'Trigger', field: 'trigger' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></powdercloud-dashboard-grid>
            </powdercloud-container>
        `;
    }
}

customElements.define('analysis-avalanche-activity-page', AnalysisAvalancheActivityPage);
