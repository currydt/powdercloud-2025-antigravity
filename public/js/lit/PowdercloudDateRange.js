import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudDateRange extends LitElement {
    static properties = {
        start: { type: String }, // YYYY-MM-DD
        end: { type: String },   // YYYY-MM-DD
        label: { type: String }
    };

    constructor() {
        super();
        this.start = '';
        this.end = '';
        this.label = 'Date Range';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _handleStartChange(e) {
        this.start = e.target.value;
        this._dispatchChange();
    }

    _handleEndChange(e) {
        this.end = e.target.value;
        this._dispatchChange();
    }

    _dispatchChange() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: { start: this.start, end: this.end },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <style>
                .app-date-range-container {
                    margin-bottom: 20px;
                }
                
                .app-date-range-label {
                    display: block;
                    font-size: 0.875rem;
                    color: #666;
                    margin-bottom: 8px;
                }

                .app-date-range-inputs {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .app-date-range-separator {
                    color: #999;
                }

                /* Reuse AppInput styles roughly or just use native inputs styled nicely */
                .app-date-input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: 1rem;
                    background: #f9f9f9;
                }

                .app-date-input:focus {
                    outline: none;
                    border-color: #5399a5;
                    background: #fff;
                }
            </style>

            <div class="app-date-range-container">
                <label class="app-date-range-label">${this.label}</label>
                <div class="app-date-range-inputs">
                    <input 
                        type="date" 
                        class="app-date-input" 
                        .value="${this.start}"
                        @change="${this._handleStartChange}"
                    >
                    <span class="app-date-range-separator">to</span>
                    <input 
                        type="date" 
                        class="app-date-input" 
                        .value="${this.end}"
                        @change="${this._handleEndChange}"
                    >
                </div>
            </div>
        `;
    }
}

customElements.define('powdercloud-date-range', PowdercloudDateRange);
