import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class DateSelector extends LitElement {
    static properties = {
        selectedDate: { type: String }
    };

    constructor() {
        super();
        // Default to today's date formatted as YYYY-MM-DD
        this.selectedDate = new Date().toISOString().split('T')[0];
    }

    createRenderRoot() {
        return this; // Use Light DOM to inherit global styles
    }

    _handleDateChange(e) {
        this.selectedDate = e.target.value;
        this.dispatchEvent(new CustomEvent('date-changed', {
            detail: { date: this.selectedDate },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div style="margin-bottom: 20px;">
                <label for="date-input" style="font-weight: bold; margin-right: 10px; color: #333;">Select Date:</label>
                <input type="date" id="date-input" 
                    .value="${this.selectedDate}" 
                    @change="${this._handleDateChange}"
                    style="padding: 5px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;" />
                <button type="button" 
                    style="margin-left: 10px; padding: 5px 10px; cursor: pointer; background: #eee; border: 1px solid #ccc; border-radius: 4px;"
                    @click="${() => this._handleDateChange({ target: { value: this.selectedDate } })}">
                    <span style="font-size: 1.2em; vertical-align: middle; margin-right: 5px;">📅</span>
                    Update
                </button>
            </div>
        `;
    }
}

customElements.define('date-selector', DateSelector);
