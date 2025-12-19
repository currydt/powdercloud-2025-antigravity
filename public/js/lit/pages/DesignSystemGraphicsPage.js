import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudContainer.js';
import '../utils/PowdercloudComponentDoc.js';
import '../utils/PowdercloudDashboardChart.js';
import '../utils/PowdercloudAvalancheRose.js';
import '../utils/PowdercloudSnowProfileGraph.js';
import '../charts/PowdercloudSeasonalChart.js';
import '../charts/PowdercloudFailureTypesChart.js';
import '../charts/PowdercloudTriggerTypesChart.js';
import '../charts/PowdercloudSnowpackHeightChart.js';
import '../charts/PowdercloudTemperatureRangeChart.js';
import '../charts/PowdercloudWindSpeedChart.js';
import '../charts/PowdercloudSkyConditionsChart.js';

export class DesignSystemGraphicsPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Graphical Elements
                </h1>
                
                <div style="padding: 20px;">
                    
                    <powdercloud-component-doc 
                        title="<powdercloud-avalanche-rose>" 
                        description="SVG Rose diagram for avalanche observations."
                        .code="${`<powdercloud-avalanche-rose></powdercloud-avalanche-rose>`}">
                        <div style="height: 400px; width: 100%; max-width: 600px;">
                            <powdercloud-avalanche-rose></powdercloud-avalanche-rose>
                        </div>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-seasonal-chart>" 
                        description="Seasonal overview chart."
                        .code="${`<powdercloud-seasonal-chart style='height: 300px;'></powdercloud-seasonal-chart>`}">
                        <powdercloud-seasonal-chart style="height: 300px;"></powdercloud-seasonal-chart>
                    </powdercloud-component-doc>

                    <style>
                        seasonal-chart, snowpack-height-chart, temperature-range-chart, 
                        wind-speed-chart, sky-conditions-chart, failure-types-chart, 
                        trigger-types-chart, avalanche-rose, snow-profile-graph {
                            display: block;
                            width: 100%;
                        }
                    </style>

                    <powdercloud-component-doc 
                        title="<powdercloud-snowpack-height-chart>" 
                        description="Column chart comparing total snow height (HS) and new snow (HN24)."
                        .code="${`<powdercloud-snowpack-height-chart style='height: 300px;'></powdercloud-snowpack-height-chart>`}">
                        <powdercloud-snowpack-height-chart style="height: 300px;"></powdercloud-snowpack-height-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-temperature-range-chart>" 
                        description="Line chart showing daily maximum and minimum temperatures."
                        .code="${`<powdercloud-temperature-range-chart style='height: 300px;'></powdercloud-temperature-range-chart>`}">
                        <powdercloud-temperature-range-chart style="height: 300px;"></powdercloud-temperature-range-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-wind-speed-chart>" 
                        description="Line chart tracking wind speed categories."
                        .code="${`<powdercloud-wind-speed-chart style='height: 300px;'></powdercloud-wind-speed-chart>`}">
                        <powdercloud-wind-speed-chart style="height: 300px;"></powdercloud-wind-speed-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-sky-conditions-chart>" 
                        description="Line chart tracking sky coverage."
                        .code="${`<powdercloud-sky-conditions-chart style='height: 300px;'></powdercloud-sky-conditions-chart>`}">
                        <powdercloud-sky-conditions-chart style="height: 300px;"></powdercloud-sky-conditions-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-failure-types-chart>" 
                        description="Bar chart showing distribution of avalanche failure types."
                        .code="${`<powdercloud-failure-types-chart style='height: 300px;'></powdercloud-failure-types-chart>`}">
                        <powdercloud-failure-types-chart style="height: 300px;"></powdercloud-failure-types-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-trigger-types-chart>" 
                        description="Bar chart showing distribution of avalanche triggers."
                        .code="${`<powdercloud-trigger-types-chart style='height: 300px;'></powdercloud-trigger-types-chart>`}">
                        <powdercloud-trigger-types-chart style="height: 300px;"></powdercloud-trigger-types-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-snow-profile-graph>" 
                        description="Interactive snow profile diagram."
                        .code="${`<powdercloud-snow-profile-graph></powdercloud-snow-profile-graph>`}">
                        <div style="height: 600px; width: 100%; max-width: 800px;">
                            <powdercloud-snow-profile-graph></powdercloud-snow-profile-graph>
                        </div>
                    </powdercloud-component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-graphics-page', DesignSystemGraphicsPage);
