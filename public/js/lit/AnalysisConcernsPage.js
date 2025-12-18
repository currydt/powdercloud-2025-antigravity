import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/FilterPanel.js';
import './components/DashboardChart.js';
import './components/DashboardGrid.js';
import './components/AppContainer.js';
import './components/AppGrid.js';
import './components/PowdercloudCard.js';

export class AnalysisConcernsPage extends LitElement {
    static properties = {
        _alpineData: { state: true },
        _treelineData: { state: true },
        _belowTreelineData: { state: true },
        _gridData: { state: true }
    };

    constructor() {
        super();
        this._alpineData = this._generateMockHazardData();
        this._treelineData = this._generateMockHazardData();
        this._belowTreelineData = this._generateMockHazardData();
        this._gridData = this._generateMockGridData();
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _generateMockHazardData() {
        const data = [];
        for (let i = 0; i < 20; i++) {
            // Size (1-5), Likelihood (1-9)
            data.push([1 + Math.random() * 4, 1 + Math.random() * 8]);
        }
        return data;
    }

    _generateMockGridData() {
        return [
            { date: '2025-11-29', operation: 'Whistler', location: 'Peak', alpine_size: '2.5', alpine_like: 'L', treeline_size: '2.0', treeline_like: 'P' },
            { date: '2025-11-29', operation: 'Blackcomb', location: 'Glacier', alpine_size: '3.0', alpine_like: 'P', treeline_size: '1.5', treeline_like: 'U' },
            { date: '2025-11-28', operation: 'Whistler', location: 'Bowl', alpine_size: '2.0', alpine_like: 'L', treeline_size: '1.0', treeline_like: 'VU' }
        ];
    }

    render() {
        const scatterOptions = {
            chart: { type: 'scatter', zoomType: 'xy' },
            xAxis: { title: { text: 'Size (Destructive)' }, min: 1, max: 5 },
            yAxis: { title: { text: 'Likelihood' }, min: 1, max: 9 },
            plotOptions: {
                scatter: {
                    marker: { radius: 5, states: { hover: { enabled: true, lineColor: 'rgb(100,100,100)' } } },
                    tooltip: { headerFormat: '<b>{series.name}</b><br>', pointFormat: 'Size: {point.x}, Likelihood: {point.y}' }
                }
            }
        };

        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Concerns Analysis
                </h1>

                <filter-panel 
                    .modes="${[{ label: 'Concerns', value: 'concerns' }]}"
                    selectedMode="concerns"
                    showDateRange
                ></filter-panel>

                <br />

                <app-grid cols="3" gap="lg">
                    <powdercloud-card title="Alpine Hazard">
                        <dashboard-chart
                            title="Alpine"
                            type="scatter"
                            .options="${{
                ...scatterOptions,
                series: [{ name: 'Alpine', data: this._alpineData, color: 'rgba(223, 83, 83, .5)' }]
            }}"
                        ></dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Treeline Hazard">
                        <dashboard-chart
                            title="Treeline"
                            type="scatter"
                            .options="${{
                ...scatterOptions,
                series: [{ name: 'Treeline', data: this._treelineData, color: 'rgba(119, 152, 191, .5)' }]
            }}"
                        ></dashboard-chart>
                    </powdercloud-card>

                    <powdercloud-card title="Below Treeline Hazard">
                        <dashboard-chart
                            title="Below Treeline"
                            type="scatter"
                            .options="${{
                ...scatterOptions,
                series: [{ name: 'Below TL', data: this._belowTreelineData, color: 'rgba(144, 237, 125, .5)' }]
            }}"
                        ></dashboard-chart>
                    </powdercloud-card>
                </app-grid>

                <br />

                <dashboard-grid
                    title="Concerns Records"
                    .columns="${[
                { header: 'Date', field: 'date', sortable: true },
                { header: 'Operation', field: 'operation', sortable: true },
                { header: 'Location', field: 'location', sortable: true },
                { header: 'Alpine Size', field: 'alpine_size' },
                { header: 'Alpine Likelihood', field: 'alpine_like' },
                { header: 'TL Size', field: 'treeline_size' },
                { header: 'TL Likelihood', field: 'treeline_like' }
            ]}"
                    .data="${this._gridData}"
                    paginated
                ></dashboard-grid>
            </app-container>
        `;
    }
}

customElements.define('analysis-concerns-page', AnalysisConcernsPage);
