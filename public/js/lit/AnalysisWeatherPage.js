import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/PowdercloudDashboardChart.js';
import './components/PowdercloudDashboardGrid.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudAvalancheRose.js';

export class AnalysisWeatherPage extends LitElement {
    static properties = {
        _hsHn24Data: { state: true },
        _tempData: { state: true },
        _windData: { state: true },
        _skyData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._hsHn24Data = this._generateMockHsHn24Data();
        this._tempData = this._generateMockTempData();
        this._windData = this._generateMockWindData();
        this._skyData = this._generateMockSkyData();
        this._gridData = this._generateMockGridData();
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
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const base = -5 - Math.random() * 10;
            max.push([date.getTime(), base + 5]);
            min.push([date.getTime(), base - 5]);
        }
        return { max, min };
    }

    _generateMockWindData() {
        const data = [];
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.push([date.getTime(), Math.floor(Math.random() * 6)]);
        }
        return data;
    }

    _generateMockSkyData() {
        const data = [];
        const now = new Date();
        for (let i = 14; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.push([date.getTime(), Math.floor(Math.random() * 6)]); // 0-5 for X, OVC, BKN, SCT, FEW, CLR
        }
        return data;
    }

    _generateMockGridData() {
        return [
            { date: '2025-11-29', location: 'Study Plot 1', temp: '-5.0', wind: 'L', sky: 'OVC', precip: 'S-1', hs: '180', hn24: '10' },
            { date: '2025-11-28', location: 'Study Plot 1', temp: '-8.0', wind: 'M', sky: 'BKN', precip: 'Nil', hs: '170', hn24: '0' },
            { date: '2025-11-27', location: 'Study Plot 1', temp: '-10.0', wind: 'C', sky: 'CLR', precip: 'Nil', hs: '170', hn24: '0' }
        ];
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Weather Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Weather', value: 'weather' }]}"
                    selectedMode="weather"
                    showDateRange
                ></filter-panel>

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

                    <powdercloud-card title="Sky Conditions">
                        <powdercloud-dashboard-chart
                            title="Sky Conditions"
                            type="line"
                            .options="${{
                xAxis: { type: 'datetime' },
                yAxis: {
                    title: { text: 'Condition' },
                    categories: ['X', 'OVC', 'BKN', 'SCT', 'FEW', 'CLR'],
                    min: 0, max: 5
                },
                series: [{ name: 'Sky', data: this._skyData, color: '#4572A7' }]
            }}"
                        ></powdercloud-dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Avalanche Rose (Weather)">
                        <div style="height: 300px;">
                            <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                        </div>
                    </powdercloud-card>
                </powdercloud-grid>

                <br />

                <powdercloud-dashboard-grid
                    title="Weather Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Temp (°C)', field: 'temp' },
                { header: 'Wind', field: 'wind' },
                { header: 'Sky', field: 'sky' },
                { header: 'Precip', field: 'precip' },
                { header: 'HS', field: 'hs' },
                { header: 'HN24', field: 'hn24' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></powdercloud-dashboard-grid>
            </powdercloud-container>
        `;
    }
}

customElements.define('analysis-weather-page', AnalysisWeatherPage);
