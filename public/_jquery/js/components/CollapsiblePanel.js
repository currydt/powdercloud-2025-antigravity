import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class CollapsiblePanel extends LitElement {
    static properties = {
        title: { type: String },
        tagline: { type: String },
        open: { type: Boolean }
    };

    constructor() {
        super();
        this.open = true;
    }

    toggle() {
        this.open = !this.open;
        // Dispatch resize event to force charts to reflow if they are inside
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 0);
    }

    render() {
        return html`
            <link href="/css/main.css" rel="stylesheet" type="text/css" />
            <link href="/css/mainNew.css" rel="stylesheet" type="text/css" />
            <div class="dvFilterWrap">
                <div id="dvFilterHead" 
                     class="${this.open ? 'dvFilterHeadOpen' : 'dvFilterHeadClosed'}"
                     @click="${this.toggle}">
                     <img id="imgFilter" src="${this.open ? '/img/arrow-down.gif' : '/img/arrow-right.gif'}" /> 
                     ${this.title}
                </div>
                <div id="dvFilter" style="${this.open ? '' : 'display: none;'}">
                    ${this.tagline ? html`<div style="padding: 4px 10px 15px 10px; color: #666; font-style: italic; font-size: 0.9em;">${this.tagline}</div>` : ''}
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('collapsible-panel', CollapsiblePanel);
