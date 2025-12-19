import { DashboardChart } from './PowdercloudDashboardChart.js';

export class PowdercloudTriggerTypesChart extends DashboardChart {
    constructor() {
        super();
        this.title = "Trigger Types";
        this.type = "bar";
        this.options = {
            chart: { type: 'bar' },

            xAxis: { categories: ['N', 'X', 'S', 'B', 'C', 'M', 'V', 'H', 'O', 'U'], title: { text: null } },
            yAxis: { min: 0, title: { text: 'Count', align: 'high' }, labels: { overflow: 'justify' } },
            tooltip: { valueSuffix: ' occurrences' },
            plotOptions: { bar: { dataLabels: { enabled: true } } },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'top', x: -40, y: 80, floating: true, borderWidth: 1, backgroundColor: '#FFFFFF', shadow: true },
            series: [
                { name: 'Trigger Types', data: [107, 31, 635, 203, 2, 5, 25, 10, 5, 2], color: '#89A54E' }
            ]
        };
    }
}

customElements.define('powdercloud-trigger-types-chart', PowdercloudTriggerTypesChart);
