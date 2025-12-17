import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppTabs extends LitElement {
    static properties = {
        tabs: { type: Array }, // [{ id: 'tab1', label: 'General' }, ...]
        activeTab: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }
        .tab-header {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 16px;
        }
        .tab-btn {
            padding: 10px 20px;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 1rem;
            color: #666;
            border-bottom: 2px solid transparent;
        }
        .tab-btn:hover {
            color: #333;
            background-color: #f9f9f9;
        }
        .tab-btn.active {
            color: #007bff;
            border-bottom: 2px solid #007bff;
            font-weight: 600;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
            animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;

    constructor() {
        super();
        this.tabs = [];
        this.activeTab = '';
    }

    _handleTabClick(id) {
        this.activeTab = id;
        this.dispatchEvent(new CustomEvent('tab-change', { detail: { tabId: id } }));
    }

    render() {
        if (!this.tabs || this.tabs.length === 0) return html``;

        // If no active tab is set, default to the first one
        if (!this.activeTab && this.tabs.length > 0) {
            this.activeTab = this.tabs[0].id;
        }

        return html`
            <div class="tab-header">
                ${this.tabs.map(tab => html`
                    <button 
                        class="tab-btn ${this.activeTab === tab.id ? 'active' : ''}"
                        @click="${() => this._handleTabClick(tab.id)}"
                    >
                        ${tab.label}
                    </button>
                `)}
            </div>
            <div class="tab-body">
                <slot name="${this.activeTab}"></slot>
            </div>
        `;
    }
}

customElements.define('app-tabs', AppTabs);
