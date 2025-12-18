import { DashboardChart } from './DashboardChart.js';

export class FailureTypesChart extends DashboardChart {
    constructor() {
        super();
        this.title = "Failure Types";
        this.type = "bar";
        this.options = {
            chart: { type: 'bar' },

            xAxis: { categories: ['S', 'L', 'LS', 'C', 'CS', 'I', 'IS'], title: { text: null } },
            yAxis: { min: 0, title: { text: 'Count', align: 'high' }, labels: { overflow: 'justify' } },
            tooltip: { valueSuffix: ' occurrences' },
            plotOptions: { bar: { dataLabels: { enabled: true } } },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'top', x: -40, y: 80, floating: true, borderWidth: 1, backgroundColor: '#FFFFFF', shadow: true },
            series: [
                { name: 'Failure Types', data: [107, 31, 635, 203, 2, 5, 25], color: '#AA4643' }
            ]
        };
    }
}

customElements.define('failure-types-chart', FailureTypesChart);
