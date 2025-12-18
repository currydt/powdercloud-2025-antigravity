import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudComponentDoc.js';
import './components/PowdercloudDashboardChart.js';
import './components/PowdercloudAvalancheRose.js';
import './components/SnowProfileGraph.js';
import './components/SeasonalChart.js';
import './components/FailureTypesChart.js';
import './components/TriggerTypesChart.js';
import './components/SnowpackHeightChart.js';
import './components/TemperatureRangeChart.js';
import './components/WindSpeedChart.js';
import './components/SkyConditionsChart.js';

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
                        title="<seasonal-chart>" 
                        description="Seasonal overview chart."
                        .code="${`<seasonal-chart style='height: 300px;'></seasonal-chart>`}">
                        <seasonal-chart style="height: 300px;"></seasonal-chart>
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
                        title="<snowpack-height-chart>" 
                        description="Column chart comparing total snow height (HS) and new snow (HN24)."
                        .code="${`<snowpack-height-chart style='height: 300px;'></snowpack-height-chart>`}">
                        <snowpack-height-chart style="height: 300px;"></snowpack-height-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<temperature-range-chart>" 
                        description="Line chart showing daily maximum and minimum temperatures."
                        .code="${`<temperature-range-chart style='height: 300px;'></temperature-range-chart>`}">
                        <temperature-range-chart style="height: 300px;"></temperature-range-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<wind-speed-chart>" 
                        description="Line chart tracking wind speed categories."
                        .code="${`<wind-speed-chart style='height: 300px;'></wind-speed-chart>`}">
                        <wind-speed-chart style="height: 300px;"></wind-speed-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<sky-conditions-chart>" 
                        description="Line chart tracking sky coverage."
                        .code="${`<sky-conditions-chart style='height: 300px;'></sky-conditions-chart>`}">
                        <sky-conditions-chart style="height: 300px;"></sky-conditions-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<failure-types-chart>" 
                        description="Bar chart showing distribution of avalanche failure types."
                        .code="${`<failure-types-chart style='height: 300px;'></failure-types-chart>`}">
                        <failure-types-chart style="height: 300px;"></failure-types-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<trigger-types-chart>" 
                        description="Bar chart showing distribution of avalanche triggers."
                        .code="${`<trigger-types-chart style='height: 300px;'></trigger-types-chart>`}">
                        <trigger-types-chart style="height: 300px;"></trigger-types-chart>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<snow-profile-graph>" 
                        description="Interactive snow profile diagram."
                        .code="${`<snow-profile-graph></snow-profile-graph>`}">
                        <div style="height: 600px; width: 100%; max-width: 800px;">
                            <snow-profile-graph></snow-profile-graph>
                        </div>
                    </powdercloud-component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-graphics-page', DesignSystemGraphicsPage);
