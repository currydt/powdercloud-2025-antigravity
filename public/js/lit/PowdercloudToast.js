import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudToast extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
        message: { type: String },
        variant: { type: String }, // 'success', 'error', 'info', 'warning'
        duration: { type: Number }
    };

    constructor() {
        super();
        this.open = false;
        this.message = '';
        this.variant = 'info';
        this.duration = 3000;
        this._timer = null;
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    updated(changedProperties) {
        if (changedProperties.has('open') && this.open) {
            this._startTimer();
        }
    }

    _startTimer() {
        if (this._timer) clearTimeout(this._timer);
        if (this.duration > 0) {
            this._timer = setTimeout(() => {
                this.open = false;
                this.dispatchEvent(new CustomEvent('close'));
            }, this.duration);
        }
    }

    close() {
        this.open = false;
        if (this._timer) clearTimeout(this._timer);
        this.dispatchEvent(new CustomEvent('close'));
    }

    render() {
        if (!this.open) return html``;

        const bgColors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        return html`
            <style>
                .app-toast {
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #323232;
                    color: white;
                    padding: 14px 24px;
                    border-radius: 4px;
                    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 11000;
                    min-width: 288px;
                    max-width: 568px;
                    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Roboto', 'Segoe UI', sans-serif;
                    font-size: 0.875rem;
                }

                .app-toast.success { background-color: #43a047; }
                .app-toast.error { background-color: #d32f2f; }
                .app-toast.warning { background-color: #ffa000; color: #fff; }
                .app-toast.info { background-color: #323232; }

                .app-toast-icon {
                    font-size: 1.2rem;
                }

                .app-toast-message {
                    flex: 1;
                }

                .app-toast-action {
                    background: none;
                    border: none;
                    color: inherit;
                    text-transform: uppercase;
                    font-weight: bold;
                    cursor: pointer;
                    margin-left: 12px;
                    padding: 0;
                    opacity: 0.8;
                }
                .app-toast-action:hover { opacity: 1; }

                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            </style>

            <div class="app-toast ${this.variant}">
                <span class="app-toast-icon">${icons[this.variant]}</span>
                <span class="app-toast-message">${this.message}</span>
                <button class="app-toast-action" @click="${this.close}">DISMISS</button>
            </div>
        `;
    }
}

customElements.define('powdercloud-toast', PowdercloudToast);
