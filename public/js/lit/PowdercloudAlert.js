import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudAlert extends LitElement {
    static properties = {
        level: { type: String }, // 'info', 'warning', 'error', 'success'
        title: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            margin-bottom: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        :host(:last-of-type) {
            margin-bottom: 0;
        }
        .alert {
            padding: 15px 20px;
            border-left: 4px solid;
            border-radius: 4px;
            display: flex;
            align-items: flex-start;
        }
        .icon {
            margin-right: 15px;
            font-size: 1.2em;
            line-height: 1;
        }
        .content {
            flex: 1;
        }
        .title {
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
        }
        
        /* Level: Warning (Default) */
        .warning {
            background-color: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        .warning .title { color: #856404; }

        /* Level: Info */
        .info {
            background-color: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        .info .title { color: #0c5460; }

        /* Level: Error */
        .error {
            background-color: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .error .title { color: #721c24; }

        /* Level: Success */
        .success {
            background-color: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        .success .title { color: #155724; }
    `;

    constructor() {
        super();
        this.level = 'warning';
        this.title = '';
    }

    _getIcon() {
        switch (this.level) {
            case 'info': return 'ℹ️';
            case 'error': return '⛔';
            case 'success': return '✅';
            case 'warning':
            default: return '⚠️';
        }
    }

    render() {
        return html`
            <div class="alert ${this.level}">
                <div class="icon">${this._getIcon()}</div>
                <div class="content">
                    ${this.title ? html`<span class="title">${this.title}</span>` : ''}
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('powdercloud-alert', PowdercloudAlert);
