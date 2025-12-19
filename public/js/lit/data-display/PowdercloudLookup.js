import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudLookup extends LitElement {
    static properties = {
        label: { type: String },
        value: { type: String },
        lookupCode: { type: String },
        readOnly: { type: Boolean },
        name: { type: String },
        _options: { state: true },
        _loading: { state: true }
    };

    static styles = css`
        :host {
            display: block;
            margin-bottom: 10px;
        }
        label {
            display: block;
            font-size: 0.85rem;
            color: #666;
            font-weight: 500;
            margin-bottom: 4px;
        }
        select {
            width: 100%;
            padding: 8px;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            background-color: white;
        }
        .value-display {
            font-size: 1rem;
            color: #333;
            padding: 8px;
            background: #f9f9f9;
            border-radius: 4px;
            border: 1px solid #eee;
            min-height: 20px;
        }
    `;

    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.lookupCode = '';
        this.readOnly = false;
        this._options = [];
        this._loading = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.lookupCode) {
            this._fetchOptions();
        }
    }

    async _fetchOptions() {
        this._loading = true;
        try {
            const response = await fetch(`/json/lookup_query_all/?lookup_code=${this.lookupCode}`);
            const result = await response.json();
            if (result.success && result.rows) {
                this._options = result.rows;
            }
        } catch (e) {
            console.error(`Error fetching lookups for ${this.lookupCode}:`, e);
        } finally {
            this._loading = false;
        }
    }

    _handleChange(e) {
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.readOnly) {
            // Find label for value if possible
            const selectedOption = this._options.find(o => o.id === this.value || o.code === this.value);
            const displayValue = selectedOption ? (selectedOption.name || selectedOption.code) : (this.value || '-');

            return html`
                ${this.label ? html`<label>${this.label}</label>` : ''}
                <div class="value-display">${displayValue}</div>
            `;
        }

        return html`
            ${this.label ? html`<label>${this.label}</label>` : ''}
            <select name="${this.name}" @change="${this._handleChange}" ?disabled="${this._loading}">
                <option value="">Select...</option>
                ${this._options.map(opt => html`
                    <option value="${opt.id}" ?selected="${opt.id === this.value || opt.code === this.value}">
                        ${opt.name || opt.code}
                    </option>
                `)}
            </select>
        `;
    }
}

customElements.define('powdercloud-lookup', PowdercloudLookup);
