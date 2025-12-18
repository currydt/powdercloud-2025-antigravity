import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudProgress extends LitElement {
    static properties = {
        type: { type: String }, // 'linear' or 'circular'
        value: { type: Number }, // 0-100, or undefined for indeterminate
        label: { type: String }
    };

    constructor() {
        super();
        this.type = 'linear';
        this.value = undefined;
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const isIndeterminate = this.value === undefined || this.value === null;

        return html`
            <style>
                .app-progress-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 20px;
                    font-family: inherit;
                }

                /* Linear Progress */
                .app-progress-linear {
                    position: relative;
                    width: 100%;
                    height: 4px;
                    background-color: #e0e0e0;
                    overflow: hidden;
                    border-radius: 2px;
                }

                .app-progress-bar {
                    height: 100%;
                    background-color: #5399a5;
                    transition: width 0.2s ease;
                }

                .app-progress-bar.indeterminate {
                    width: 50%;
                    position: absolute;
                    animation: linear-indeterminate 1.5s infinite ease-in-out;
                }

                @keyframes linear-indeterminate {
                    0% { left: -50%; width: 50%; }
                    100% { left: 100%; width: 50%; }
                }

                /* Circular Progress */
                .app-progress-circular {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e0e0e0;
                    border-top-color: #5399a5;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .app-progress-label {
                    font-size: 0.85em;
                    color: #666;
                }
            </style>

            <div class="app-progress-container">
                ${this.label ? html`<div class="app-progress-label">${this.label}</div>` : ''}
                
                ${this.type === 'circular' ? html`
                    <div class="app-progress-circular"></div>
                ` : html`
                    <div class="app-progress-linear">
                        <div class="app-progress-bar ${isIndeterminate ? 'indeterminate' : ''}" 
                             style="${!isIndeterminate ? `width: ${this.value}%` : ''}">
                        </div>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('powdercloud-progress', PowdercloudProgress);
