import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudDateSelector.js';
import './components/PowdercloudCollapsiblePanel.js';
import './components/PowdercloudAvalancheRose.js';

// Charts
import './components/PowdercloudSeasonalChart.js';
import './components/PowdercloudFailureTypesChart.js';
import './components/TriggerTypesChart.js';
import './components/PowdercloudSnowpackHeightChart.js';
import './components/TemperatureRangeChart.js';
import './components/WindSpeedChart.js';

// Grids
import './components/WeatherGrid.js';
import './components/PowdercloudAvalancheGrid.js';
import './components/PowdercloudSnowpackGrid.js';
import './components/StabilityGrid.js';
import './components/PowdercloudNewsGrid.js';

export class DashboardPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    constructor() {
        super();
        console.log("DashboardPage initialized");
    }

    render() {
        return html`
            <style>
                .chart-row {
                    margin-bottom: 20px;
                }
                .chart-row.three-col {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .chart-container {
                    flex: 1;
                    min-width: 300px;
                    height: 300px;
                }
                .full-width-chart {
                    height: 300px;
                    display: block;
                }
                /* Ensure Highcharts containers fill their parent */
                dashboard-chart, seasonal-chart, failure-types-chart, trigger-types-chart, 
                snowpack-height-chart, temperature-range-chart, wind-speed-chart {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            </style>

            <!-- Title & Date Selector -->
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                Operation Dashboard
            </h1>
            <p style="margin-bottom: 15px;">The following dashboard displays the current status of the operation.</p>

            <powdercloud-date-selector></powdercloud-date-selector>

            <!-- Charts Section -->
            <powdercloud-collapsible-panel title="Charts"
                tagline="The following is a presentation of data for the past seven days, from the selected date. You can manage the date range, by adjusting the selected end date.">
                
                <!-- Row 1: Seasonal Chart -->
                <div class="chart-row">
                    <powdercloud-seasonal-chart class="full-width-chart"></powdercloud-seasonal-chart>
                </div>

                <!-- Row 2: Rose, Failure, Trigger -->
                <div class="chart-row three-col">
                    <div class="chart-container">
                        <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                    </div>
                    <div class="chart-container">
                        <powdercloud-failure-types-chart></powdercloud-failure-types-chart>
                    </div>
                    <div class="chart-container">
                        <trigger-types-chart></trigger-types-chart>
                    </div>
                </div>

                <!-- Row 3: HS, Temp, Wind -->
                <div class="chart-row three-col">
                    <div class="chart-container">
                        <powdercloud-snowpack-height-chart></powdercloud-snowpack-height-chart>
                    </div>
                    <div class="chart-container">
                        <temperature-range-chart></temperature-range-chart>
                    </div>
                    <div class="chart-container">
                        <wind-speed-chart></wind-speed-chart>
                    </div>
                </div>
            </powdercloud-collapsible-panel>

            <br />

            <!-- Grids Section -->
            <powdercloud-collapsible-panel title="Weather Observations"
                tagline="The following table displays weather observations in textual format. You can select an individual column to resize it; change its position, or to hide and show the column. You can sort by date and time in ascending or descending order.">
                <weather-grid></weather-grid>
            </powdercloud-collapsible-panel>

            <br />

            <powdercloud-collapsible-panel title="Avalanche Activity"
                tagline="The following table displays avalanche activity in textual format. You can select an individual column to resize it; change its position, or to hide and show the column. You can sort by date and time in ascending or descending order.">
                <powdercloud-avalanche-grid></powdercloud-avalanche-grid>
            </powdercloud-collapsible-panel>

            <br />

            <powdercloud-collapsible-panel title="Snowpack Structure"
                tagline="The following table displays snowpack structure in textual format. You can select an individual column to resize it; change its position, or to hide and show the column. You can sort by date and time in ascending or descending order.">
                <powdercloud-snowpack-grid></powdercloud-snowpack-grid>
            </powdercloud-collapsible-panel>

            <br />

            <powdercloud-collapsible-panel title="Stability Ratings"
                tagline="The following table displays stability ratings in textual format. You can select an individual column to resize it; change its position, or to hide and show the column. You can sort by date and time in ascending or descending order.">
                <stability-grid></stability-grid>
            </powdercloud-collapsible-panel>

            <br />

            <powdercloud-collapsible-panel title="News & Updates"
                tagline="The following table displays news and updates in textual format. You can select an individual column to resize it; change its position, or to hide and show the column. You can sort by date and time in ascending or descending order.">
                <powdercloud-news-grid></powdercloud-news-grid>
            </powdercloud-collapsible-panel>
        `;
    }
}

customElements.define('dashboard-page', DashboardPage);
