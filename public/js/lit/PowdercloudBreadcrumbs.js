import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudBreadcrumbs extends LitElement {
    static properties = {
        path: { type: Array } // Array of { label: 'Home', url: '/' }
    };

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div id="dvCrumbs">
                <div>
                    ${this.path ? this.path.map((item, index) => html`
                        ${index > 0 ? ' > ' : ''}
                        ${item.url ? html`<a href="${item.url}">${item.label}</a>` : item.label}
                    `) : html`Home > Dashboard`}
                </div>
            </div>
        `;
    }
}

customElements.define('powdercloud-breadcrumbs', PowdercloudBreadcrumbs);
