import { DashboardChart } from '../DashboardChart.js';

export class WindSpeedChart extends DashboardChart {
    constructor() {
        super();
        this.title = "Wind Speed";
        this.type = "bar";
        this.options = {

            xAxis: { categories: ['Nov 21', 'Nov 22', 'Nov 23', 'Nov 24', 'Nov 25', 'Nov 26', 'Nov 27', 'Nov 28', 'Nov 29', 'Nov 30'] },
            yAxis: { title: { text: 'Wind Speed (km/h)' }, plotLines: [{ value: 0, width: 1, color: '#808080' }] },
            tooltip: { valueSuffix: ' km/h' },
            legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', borderWidth: 0 },
            series: [
                { name: 'Wind Speed', data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3], color: '#4572A7' }
            ]
        };
    }
}

customElements.define('wind-speed-chart', WindSpeedChart);
