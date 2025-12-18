import { DashboardChart } from './DashboardChart.js';

export class SkyConditionsChart extends DashboardChart {
    constructor() {
        super();
        this.title = "Sky Conditions";
        this.type = "line";
        this.options = {
            title: { text: 'Sky Conditions' },
            xAxis: { categories: ['Nov 21', 'Nov 22', 'Nov 23', 'Nov 24', 'Nov 25', 'Nov 26', 'Nov 27', 'Nov 28', 'Nov 29', 'Nov 30'] },
            yAxis: {
                title: { text: 'Condition' },
                categories: ['X', 'OVC', 'BKN', 'SCT', 'FEW', 'CLR'],
                min: 0, max: 5
            },
            tooltip: { valueSuffix: '' },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0 },
            series: [{ name: 'Sky', data: [2, 1, 5, 4, 3, 2, 1, 0, 1, 2], color: '#4572A7' }]
        };
    }
}

customElements.define('sky-conditions-chart', SkyConditionsChart);
