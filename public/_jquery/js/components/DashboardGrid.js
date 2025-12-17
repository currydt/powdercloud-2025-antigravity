import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class DashboardGrid extends LitElement {
    static properties = {
        title: { type: String },
        columns: { type: Array },
        data: { type: Array }
    };

    createRenderRoot() {
        return this; // Use Light DOM for global styles
    }

    render() {
        return html`
      <div class="dashboard-grid-container" style="margin-bottom: 20px;">
        ${this.title ? html`<h3>${this.title}</h3>` : ''}
        <table class="tbl">
            <thead>
                <tr>
                    ${this.columns.map(col => html`
                        <th class="thSpaced" style="${col.width ? `width: ${col.width};` : ''}">${col.header}</th>
                    `)}
                </tr>
            </thead>
            <tbody>
                ${this.data && this.data.length > 0
                ? this.data.map((row, i) => html`
                        <tr class="${i % 2 === 0 ? 'trOdd' : 'trEven'}">
                            ${this.columns.map(col => html`
                                <td>${row[col.field] || ''}</td>
                            `)}
                        </tr>
                    `)
                : html`<tr><td colspan="${this.columns.length}">No data found</td></tr>`
            }
            </tbody>
        </table>
      </div>
    `;
    }
}

customElements.define('dashboard-grid', DashboardGrid);
