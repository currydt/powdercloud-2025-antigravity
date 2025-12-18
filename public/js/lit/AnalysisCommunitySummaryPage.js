import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudFilterPanel.js';
import './components/PowdercloudDashboardChart.js';
import './components/PowdercloudDashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudAvalancheRose.js';
import './components/PowdercloudTabs.js';

export class AnalysisCommunitySummaryPage extends LitElement {
    static properties = {
        _hsHn24Data: { state: true },
        _tempData: { state: true },
        _windData: { state: true },
        _failureTypeData: { state: true },
        _triggerTypeData: { state: true },
        _weatherGridData: { state: true },
        _avalancheGridData: { state: true }
    };

    constructor() {
        super();
        this._hsHn24Data = this._generateMockHsHn24Data();
        this._tempData = this._generateMockTempData();
        this._windData = this._generateMockWindData();
        this._failureTypeData = [5, 12, 3, 8, 2, 0, 1]; // S, L, LS, C, CS, I, IS
        this._triggerTypeData = [10, 5, 2, 1, 0, 0, 0, 0, 0, 0]; // N, X, S, B, C, M, V, H, O, U
        this._weatherGridData = this._generateMockWeatherGridData();
        this._avalancheGridData = this._generateMockAvalancheGridData();
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _generateMockHsHn24Data() {
        const hs = [];
        const hn24 = [];
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            hs.push([date.getTime(), 150 + Math.random() * 50]);
            hn24.push([date.getTime(), Math.random() * 20]);
        }
        return { hs, hn24 };
    }

    _generateMockTempData() {
        const max = [];
        const min = [];
        const present = [];
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const base = -5 - Math.random() * 10;
            max.push([date.getTime(), base + 5]);
            min.push([date.getTime(), base - 5]);
            present.push([date.getTime(), base]);
        }
        return { max, min, present };
    }

    _generateMockWindData() {
        const data = [];
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.push([date.getTime(), Math.floor(Math.random() * 6)]); // 0-5 scale
        }
        return data;
    }

    _generateMockWeatherGridData() {
        return [
            { date: '2025-11-29', location: 'Study Plot 1', temp: '-5.0', wind: 'L', sky: 'OVC', precip: 'S-1' },
            { date: '2025-11-28', location: 'Study Plot 1', temp: '-8.0', wind: 'M', sky: 'BKN', precip: 'Nil' },
            { date: '2025-11-27', location: 'Study Plot 1', temp: '-10.0', wind: 'C', sky: 'CLR', precip: 'Nil' }
        ];
    }

    _generateMockAvalancheGridData() {
        return [
            { date: '2025-11-29', operation: 'Whistler', location: 'Bowl 1', type: 'Slab', size: '2.5', trigger: 'Skier' },
            { date: '2025-11-29', operation: 'Blackcomb', location: 'Chute 3', type: 'Loose', size: '1.0', trigger: 'Natural' }
        ];
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Community Summary
                </h1>

                <powdercloud-filter-panel 
                    .modes="${[{ label: 'Community', value: 'community' }]}"
                    selectedMode="community"
                    showDateRange
                ></powdercloud-filter-panel>

                <br />

                <powdercloud-grid cols="2" gap="lg">
                    <powdercloud-card title="HS & HN24">
                        <powdercloud-dashboard-chart
                            title="Snow Height"
                            type="column"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: { title: { text: 'cm' } },
                series: [
                    { name: 'HS', data: this._hsHn24Data.hs, color: '#4572A7' },
                    { name: 'HN24', data: this._hsHn24Data.hn24, color: '#89A54E' }
                ]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Temperature Range">
                        <powdercloud-dashboard-chart
                            title="Temperature"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: { title: { text: '°C' } },
                series: [
                    { name: 'Max', data: this._tempData.max, color: '#AA4643' },
                    { name: 'Present', data: this._tempData.present, color: '#4572A7' },
                    { name: 'Min', data: this._tempData.min, color: '#89A54E' }
                ]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Wind Speed">
                        <powdercloud-dashboard-chart
                            title="Wind Speed"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Speed' },
                    categories: ['C', 'L', 'M', 'S', 'G', 'X'],
                    min: 0, max: 5
                },
                series: [{ name: 'Wind', data: this._windData, color: '#4572A7' }]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Avalanche Rose">
                        <div style="height: 300px;">
                            <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                        </div>
                    </powdercloud-card>

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

                <powdercloud-tabs>
                    <app-tab label="Weather" active>
                        <powdercloud-dashboard-grid
                            title="Weather Observations"
                            .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Temp (°C)', field: 'temp' },
                { header: 'Wind', field: 'wind' },
                { header: 'Sky', field: 'sky' },
                { header: 'Precip', field: 'precip' }
            ]}"
                            .data="${this._weatherGridData}"
                            paginated
                        ></powdercloud-dashboard-grid>
                    </app-tab>
                    <app-tab label="Avalanches">
                        <powdercloud-dashboard-grid
                            title="Avalanche Observations"
                            .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Type', field: 'type' },
                { header: 'Size', field: 'size' },
                { header: 'Trigger', field: 'trigger' }
            ]}"
                            .data="${this._avalancheGridData}"
                            paginated
                        ></powdercloud-dashboard-grid>
                    </app-tab>
                </powdercloud-tabs>

            </powdercloud-container>
        `;
    }
}

customElements.define('analysis-community-summary-page', AnalysisCommunitySummaryPage);
