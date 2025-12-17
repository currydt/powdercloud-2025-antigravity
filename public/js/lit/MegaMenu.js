import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class MegaMenu extends LitElement {
    static properties = {
        title: { type: String },
        subtitle: { type: String },
        url: { type: String },
        active: { type: Boolean },
        menuData: { type: Array }, // Array of Columns, where each Column is an Array of Groups
        _isOpen: { state: true }
    };

    constructor() {
        super();
        this.url = '#';
        this.active = false;
        this.menuData = [];
        this._isOpen = false;
    }

    createRenderRoot() {
        return this; // Light DOM to inherit global styles
    }

    render() {
        return html`
            <li class="liNav1 ${this.active ? 'active' : ''}" 
                @mouseenter="${this._handleMouseEnter}" 
                @mouseleave="${this._handleMouseLeave}">
                <a href="${this.url}">
                    <strong>${this.title}</strong>
                    <span>${this.subtitle}</span>
                </a>
                ${this._renderDropdown()}
            </li>
        `;
    }

    _renderDropdown() {
        if (!this.menuData || this.menuData.length === 0) return '';

        return html`
            <div class="dvMenuSub" style="display: ${this._isOpen ? 'block' : 'none'}; opacity: ${this._isOpen ? 1 : 0}; transition: opacity 0.2s; width: 800px;">
                ${this.menuData.map(col => html`
                    <div class="col" style="float: left; width: 180px; margin-right: 10px;">
                        ${col.map(group => html`
                            ${group.title ? html`<h3>${group.title}</h3>` : ''}
                            ${group.links.map(link => html`
                                <a href="${link.url}" style="display: block; padding: 2px 0; color: #333; text-decoration: none;">${link.label}</a>
                            `)}
                            <br />
                        `)}
                    </div>
                `)}
                <div style="clear: both;"></div>
            </div>
        `;
    }

    _handleMouseEnter() {
        if (this._closeTimer) {
            clearTimeout(this._closeTimer);
            this._closeTimer = null;
        }
        if (this.menuData && this.menuData.length > 0) {
            this._isOpen = true;
        }
    }

    _handleMouseLeave() {
        this._closeTimer = setTimeout(() => {
            this._isOpen = false;
        }, 300); // 300ms delay
    }
}

customElements.define('mega-menu', MegaMenu);
