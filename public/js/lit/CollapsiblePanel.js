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
                     style="background-color: transparent; border: none; border-bottom: 1px solid #e0e0e0; padding: 10px 0; color: #5399a5; font-size: 1.2em; font-weight: normal; cursor: pointer; font-family: Arial, sans-serif; text-transform: uppercase;"
                     @click="${this.toggle}">
                     <span style="
                        display: inline-block; 
                        width: 18px; 
                        height: 18px; 
                        line-height: 18px; 
                        text-align: center; 
                        background-color: #5399a5; 
                        color: #fff; 
                        border-radius: 3px; 
                        margin-right: 8px; 
                        font-size: 10px; 
                        vertical-align: middle;">
                        ${this.open ? '▼' : '▶'}
                     </span>
                     ${this.title}
                </div>
                <div id="dvFilter" style="${this.open ? '' : 'display: none;'} width: 100%;">
                    ${this.tagline ? html`<div style="padding: 4px 10px 15px 10px; color: #666; font-style: italic; font-size: 0.9em;">${this.tagline}</div>` : ''}
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('collapsible-panel', CollapsiblePanel);
