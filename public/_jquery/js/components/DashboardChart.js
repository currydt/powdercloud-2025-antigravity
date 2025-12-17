import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class DashboardChart extends LitElement {
    static properties = {
        chartId: { type: String },
        title: { type: String },
        type: { type: String },
        options: { type: Object }
    };

    constructor() {
        super();
        // Generate a random ID if one isn't provided
        this._internalId = 'chart_' + Math.random().toString(36).substr(2, 9);
    }

    createRenderRoot() {
        return this; // Light DOM is fine here as we don't use slots
    }

    updated(changedProperties) {
        if (changedProperties.has('options') && this.options) {
            this.initChart();
        }
    }

    firstUpdated() {
        if (this.options) {
            this.initChart();
        }
    }

    initChart() {
        if (!this.options) return;
        if (typeof Highcharts === 'undefined') {
            console.error('Highcharts is not loaded');
            return;
        }

        // We target the inner div, which we ensure has a unique ID or we find it via DOM query
        const containerId = (this.chartId || this._internalId) + '_container';

        // Wait for render to complete so the div exists
        setTimeout(() => {
            const container = this.querySelector(`#${containerId}`);
            if (container) {
                try {
                    // Highcharts 2.x uses new Highcharts.Chart(options)
                    // and renderTo is part of the chart options
                    new Highcharts.Chart({
                        chart: {
                            renderTo: container,
                            type: this.type || 'line',
                            backgroundColor: 'transparent',
                            style: { fontFamily: 'Arial, sans-serif' },
                            events: {
                                load: function () {
                                    // Ensure chart fits container
                                    // reflow() might not exist or work the same in 2.x, but we can try
                                    if (this.reflow) this.reflow();
                                }
                            }
                        },
                        title: {
                            text: this.title,
                            style: { color: '#333333', fontSize: '14px', fontWeight: 'bold' }
                        },
                        credits: { enabled: false },
                        ...this.options
                    });
                } catch (e) {
                    console.error('Error creating Highchart:', e);
                }
            } else {
                console.warn(`Container #${containerId} not found for chart`);
            }
        }, 100); // Increased timeout slightly to ensure DOM is ready
    }

    render() {
        const renderId = (this.chartId || this._internalId) + '_container';
        return html`
            <div id="${renderId}" style="width: 100%; height: 300px; margin-bottom: 20px;"></div>
        `;
    }
}

customElements.define('dashboard-chart', DashboardChart);
