import { DashboardChart } from './DashboardChart.js';

export class PowdercloudTemperatureRangeChart extends DashboardChart {
    constructor() {
        super();
        this.title = "Temperature Range";
        this.type = "line";
        this.options = {

            xAxis: { categories: ['Nov 21', 'Nov 22', 'Nov 23', 'Nov 24', 'Nov 25', 'Nov 26', 'Nov 27', 'Nov 28', 'Nov 29', 'Nov 30'] },
            yAxis: { title: { text: 'Temperature (°C)' }, plotLines: [{ value: 0, width: 1, color: '#808080' }] },
            tooltip: { valueSuffix: '°C' },
            legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom', borderWidth: 0 },
            series: [
                { name: 'Max Temp', data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3], color: '#AA4643' },
                { name: 'Min Temp', data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1], color: '#4572A7' }
            ]
        };
    }
}

customElements.define('powdercloud-temperature-range-chart', PowdercloudTemperatureRangeChart);
