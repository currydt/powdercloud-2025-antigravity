import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudComponentDoc extends LitElement {
    static properties = {
        title: { type: String },
        description: { type: String },
        code: { type: String },
        isOpen: { type: Boolean }
    };

    constructor() {
        super();
        this.isOpen = true;
    }

    static styles = css`
        :host {
            display: block;
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            background: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: all 0.3s ease;
        }
        .header {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            transition: background 0.2s;
        }
        .header:hover {
            background: #f1f3f5;
        }
        .header-content {
            flex: 1;
        }
        .title {
            margin: 0;
            font-size: 1.2em;
            color: #2c3e50;
            font-weight: 600;
        }
        .description {
            margin: 5px 0 0;
            color: #666;
            font-size: 0.95em;
        }
        .toggle-icon {
            margin-left: 15px;
            color: #6c757d;
            transition: transform 0.3s ease;
        }
        .toggle-icon.open {
            transform: rotate(180deg);
        }
        .content {
            display: none;
        }
        .content.open {
            display: block;
            animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .preview {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            background: #fff;
        }
        .controls {
            background: #f9f9f9;
            border-bottom: 1px solid #e0e0e0;
            padding: 0;
        }
        .controls ::slotted(*) {
            padding: 15px 20px;
        }
        .code-block {
            position: relative;
            background: #2d2d2d;
            padding: 0;
        }
        pre {
            margin: 0;
            padding: 20px;
            overflow-x: auto;
            color: #f8f8f2;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
            line-height: 1.5;
        }
        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8em;
            transition: background 0.2s;
        }
        .copy-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        .copy-btn:active {
            background: rgba(255, 255, 255, 0.3);
        }
    `;

    _copyCode(e) {
        e.stopPropagation();
        navigator.clipboard.writeText(this.code).then(() => {
            const btn = this.shadowRoot.querySelector('.copy-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }

    _toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            // Dispatch a resize event to trigger Highcharts reflow
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 300); // Wait for animation to complete
        }
    }

    render() {
        return html`
            <div class="header" @click="${this._toggle}">
                <div class="header-content">
                    <h3 class="title">${this.title}</h3>
                    ${this.description ? html`<p class="description">${this.description}</p>` : ''}
                </div>
                <div class="toggle-icon ${this.isOpen ? 'open' : ''}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>
            
            <div class="content ${this.isOpen ? 'open' : ''}">
                <div class="preview">
                    <slot></slot>
                </div>

                <div class="controls">
                    <slot name="controls"></slot>
                </div>

                <div class="code-block">
                    <button class="copy-btn" @click="${this._copyCode}">Copy Code</button>
                    <pre><code>${this.code}</code></pre>
                </div>
            </div>
        `;
    }
}

customElements.define('powdercloud-component-doc', PowdercloudComponentDoc);
