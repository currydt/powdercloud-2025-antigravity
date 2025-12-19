import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { PowdercloudSvgSnowprofile } from './PowdercloudSvgSnowprofile.js';

/**
 * PowdercloudSnowProfileChart
 * A specialized visualization component for displaying snow profiles.
 * Wraps the PowdercloudSvgSnowprofile SVG engine.
 */
export class PowdercloudSnowProfileChart extends LitElement {
    static properties = {
        width: { type: Number },
        height: { type: Number },
        data: { type: Object },
        preferences: { type: Object },
        layout: { type: String }, // 'basic' (default), 'flags', 'comments'
        showMockData: { type: Boolean }
    };

    static styles = css`
        :host {
            display: inline-block;
        }
        svg {
            display: block;
            width: 100%;
            height: auto;
            max-width: var(--chart-width, 450px);
            border: 1px solid #ccc;
            background: white;
            font-family: 'Roboto', sans-serif; /* Fallback */
        }
        /* Load font from public/fonts */
        @font-face {
            font-family: 'SnowSymbolsIacsSvg';
            src: url('/fonts/SnowSymbolsIACS.ttf') format('truetype');
        }
    `;

    static DEFAULT_PREFERENCES = {
        flagHexColor: "#FF0000",
        potentialFailureHexColor: "#FFA500",
        averageGrainSizeFlagValue: 2.0,
        snowHardnessCode: "4F",
        snowFormCodes: ["FC", "DH", "SH"],
        differenceAverageGrainSizeFlagValue: 0.5,
        differenceHardnessFlagValue: 1,
        depthOfInterfaceStart: 0,
        depthOfInterfaceEnd: 150,
        highlightInterfaceCount: 4
    };

    constructor() {
        super();
        this.width = 450;
        this.height = 550;
        this.data = null;
        this.preferences = {};
        this.layout = 'basic';
        this.chartEngine = null;
        this.showMockData = false;
    }

    firstUpdated() {
        this.initChart();
        if (this.showMockData) {
            this._loadMockData();
            this.draw();
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('width') || changedProperties.has('height')) {
            this.initChart();
        }
        if (changedProperties.has('data') || changedProperties.has('preferences') || changedProperties.has('layout') || changedProperties.has('showMockData')) {
            if (this.showMockData && !this.data) {
                this._loadMockData();
            }
            this.draw();
        }
    }

    _loadMockData() {
        this.data = {
            snowLayers: [
                { heightStart: 120, heightEnd: 100, snowHardness: 'F', snowForm01: 'PP', crystalSize01: 1.0, comments: "New snow" },
                { heightStart: 100, heightEnd: 70, snowHardness: '4F', snowForm01: 'DF', crystalSize01: 1.0, comments: "Decomposing" },
                { heightStart: 70, heightEnd: 40, snowHardness: '1F', snowForm01: 'RG', crystalSize01: 0.5, comments: "Rounded" },
                { heightStart: 40, heightEnd: 20, snowHardness: 'P', snowForm01: 'FC', crystalSize01: 2.0, comments: "Facets" },
                { heightStart: 20, heightEnd: 0, snowHardness: 'K', snowForm01: 'DH', crystalSize01: 3.0, comments: "Depth Hoar" }
            ],
            temperatureLayers: [
                { height: 120, temperature: -10 },
                { height: 100, temperature: -8 },
                { height: 60, temperature: -5 },
                { height: 0, temperature: -1 }
            ],
            surfaceTemperature: -12,
            airTemperature: -15,
            isLayersDescendingTopDown: true
        };
    }

    initChart() {
        const w = (this.width && !isNaN(this.width)) ? this.width : 450;
        const h = (this.height && !isNaN(this.height)) ? this.height : 550;
        this.chartEngine = new PowdercloudSvgSnowprofile(w, h);

        // Ensure initial draw happens (empty chart)
        const svg = this.shadowRoot.querySelector('svg');
        if (svg && this.chartEngine) {
            this.chartEngine.drawChart(svg);
        }
    }

    draw() {
        const svg = this.shadowRoot.querySelector('svg');
        if (!svg || !this.chartEngine) return;

        // 1. Configure Layout
        if (this.layout === 'flags') {
            this.chartEngine.setPropertiesTableType(this.chartEngine.TABLE_TYPE_FLAGS);
        } else if (this.layout === 'comments') {
            this.chartEngine.setPropertiesTableType(this.chartEngine.TABLE_TYPE_COMMENTS);
        } else {
            this.chartEngine.setPropertiesTableType(this.chartEngine.TABLE_TYPE_BASIC);
        }

        // 2. Draw
        if (!this.data) {
            this.chartEngine.drawChart(svg);
            return;
        }

        const activePrefs = {
            ...PowdercloudSnowProfileChart.DEFAULT_PREFERENCES,
            ...this.preferences
        };

        try {
            this.chartEngine.drawData(svg, this.data, activePrefs);
        } catch (e) {
            console.error("Error drawing snow profile:", e);
        }
    }

    render() {
        const w = (this.width && !isNaN(this.width)) ? this.width : 450;
        const h = (this.height && !isNaN(this.height)) ? this.height : 550;

        return html`
            <svg viewBox="0 0 ${w} ${h}" 
                 preserveAspectRatio="xMidYMid meet"
                 width="${w}" height="${h}">
            </svg>
        `;
    }
}

customElements.define('powdercloud-snow-profile-chart', PowdercloudSnowProfileChart);
