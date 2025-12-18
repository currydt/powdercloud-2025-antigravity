import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './AppDateRange.js';
import './AppButton.js';

export class PowdercloudFilterPanel extends LitElement {
    static properties = {
        modes: { type: Array }, // [{label: 'My Community', value: 'c'}, ...]
        selectedMode: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        showDateRange: { type: Boolean },
        _isOpen: { state: true }
    };

    constructor() {
        super();
        this.modes = [
            { label: 'My Community', value: 'community' },
            { label: 'My Favourites', value: 'favourites' },
            { label: 'My Operation', value: 'operation' }
        ];
        this.selectedMode = 'operation';
        this.startDate = '';
        this.endDate = '';
        this.showDateRange = true;
        this._isOpen = true;
    }

    createRenderRoot() {
        return this; // Light DOM for global styles
    }

    _toggleOpen() {
        this._isOpen = !this._isOpen;
    }

    _handleModeClick(value) {
        this.selectedMode = value;
        this.dispatchEvent(new CustomEvent('mode-change', { detail: { value } }));
    }

    _handleDateChange(e) {
        this.startDate = e.detail.start;
        this.endDate = e.detail.end;
    }

    _handleUpdate() {
        this.dispatchEvent(new CustomEvent('update', {
            detail: {
                mode: this.selectedMode,
                start: this.startDate,
                end: this.endDate
            }
        }));
    }

    render() {
        return html`
            <style>
                .filter-panel {
                    border: 1px solid #d0d0d0;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    font-family: Arial, sans-serif;
                    background: #fff;
                }

                .filter-header {
                    background: #e6e6e6 url('/img/glass-bg.png') repeat-x 50% 50%; /* Legacy style mimic */
                    background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
                    padding: 8px 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #d0d0d0;
                    font-weight: bold;
                    color: #555;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .filter-body {
                    padding: 15px;
                    display: none;
                }

                .filter-body.open {
                    display: block;
                }

                .filter-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 30px;
                    flex-wrap: wrap;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .filter-label {
                    font-size: 11px;
                    color: #333;
                    font-weight: bold;
                }

                /* Button Group Styles */
                .mode-group {
                    display: flex;
                }

                .mode-btn {
                    padding: 6px 12px;
                    border: 1px solid #ccc;
                    background: #f6f6f6;
                    color: #555;
                    font-size: 12px;
                    cursor: pointer;
                    margin-right: -1px; /* Merge borders */
                }

                .mode-btn:first-child {
                    border-radius: 3px 0 0 3px;
                }

                .mode-btn:last-child {
                    border-radius: 0 3px 3px 0;
                }

                .mode-btn:hover {
                    background: #ededed;
                }

                .mode-btn.active {
                    background: #fff;
                    font-weight: bold;
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                }

                .update-btn-container {
                    margin-left: auto; /* Push to right */
                }
                
                /* Icon rotation */
                .filter-arrow {
                    transition: transform 0.2s;
                    font-size: 10px;
                }
                .filter-arrow.closed {
                    transform: rotate(-90deg);
                }
            </style>

            <div class="filter-panel">
                <div class="filter-header" @click="${this._toggleOpen}">
                    <span class="filter-arrow ${this._isOpen ? '' : 'closed'}">▼</span>
                    Filter
                </div>
                <div class="filter-body ${this._isOpen ? 'open' : ''}">
                    <div class="filter-row">
                        
                        ${this.modes && this.modes.length > 0 ? html`
                            <div class="filter-group">
                                <span class="filter-label">Mode:</span>
                                <div class="mode-group">
                                    ${this.modes.map(mode => html`
                                        <button 
                                            class="mode-btn ${this.selectedMode === mode.value ? 'active' : ''}"
                                            @click="${() => this._handleModeClick(mode.value)}"
                                        >
                                            ${mode.label}
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        ${this.showDateRange ? html`
                            <div class="filter-group">
                                <!-- Reuse AppDateRange but maybe style it to match? 
                                     For now, let's use the component but we might need to adjust its label handling 
                                     since this design has "From" and "To" separate. 
                                     Actually, AppDateRange has one label. 
                                     Let's manually build the inputs here to match the exact design 
                                     or update AppDateRange to be more flexible.
                                     
                                     The design has "From:" [input] "To:" [input].
                                     I'll implement it directly here for pixel perfection with the screenshot.
                                -->
                                <div style="display: flex; gap: 20px;">
                                    <div style="display: flex; flex-direction: column; gap: 5px;">
                                        <span class="filter-label">From:</span>
                                        <input type="date" .value="${this.startDate}" @change="${(e) => this.startDate = e.target.value}" style="padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; width: 130px;">
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 5px;">
                                        <span class="filter-label">To:</span>
                                        <input type="date" .value="${this.endDate}" @change="${(e) => this.endDate = e.target.value}" style="padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px; width: 130px;">
                                    </div>
                                </div>
                            </div>
                        ` : ''}

                        <div class="update-btn-container">
                            <app-button label="Update" icon="fa fa-refresh" size="small" @click="${this._handleUpdate}"></app-button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('powdercloud-filter-panel', PowdercloudFilterPanel);
