import { DashboardChart } from './DashboardChart.js';

export class SnowpackHeightChart extends DashboardChart {
    constructor() {
        super();
        this.title = "HS & HN24";
        this.type = "column";
        this.options = {
            chart: { zoomType: 'xy' },
            xAxis: [{ categories: ['Nov 21', 'Nov 22', 'Nov 23', 'Nov 24', 'Nov 25', 'Nov 26', 'Nov 27', 'Nov 28', 'Nov 29', 'Nov 30'], crosshair: true }],
            yAxis: [
                { // Primary yAxis
                    labels: { format: '{value} cm', style: { color: '#4572A7' } },
                    title: { text: 'Snow Height', style: { color: '#4572A7' } }
                },
                { // Secondary yAxis
                    title: { text: 'New Snow', style: { color: '#89A54E' } },
                    labels: { format: '{value} cm', style: { color: '#89A54E' } },
                    opposite: true
                }
            ],
            tooltip: { shared: true },
            legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', borderWidth: 0 },
            series: [
                { name: 'HS', type: 'column', yAxis: 1, data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1], color: '#4572A7', tooltip: { valueSuffix: ' cm' } },
                { name: 'HN24', type: 'spline', data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3], color: '#89A54E', tooltip: { valueSuffix: ' cm' } }
            ]
        };
    }
}

customElements.define('snowpack-height-chart', SnowpackHeightChart);
