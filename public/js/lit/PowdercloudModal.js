import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudModal extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
        title: { type: String },
        size: { type: String }, // 'small', 'medium', 'large'
        persistent: { type: Boolean } // If true, clicking backdrop won't close
    };

    constructor() {
        super();
        this.open = false;
        this.title = '';
        this.size = 'medium';
        this.persistent = false;
        this._handleKeydown = this._handleKeydown.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('keydown', this._handleKeydown);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('keydown', this._handleKeydown);
    }

    createRenderRoot() {
        return this; // Light DOM for global styles
    }

    _handleKeydown(e) {
        if (this.open && e.key === 'Escape' && !this.persistent) {
            this.close();
        }
    }

    close() {
        this.open = false;
        this.dispatchEvent(new CustomEvent('close'));
    }

    _handleBackdropClick(e) {
        if (e.target.classList.contains('app-modal-backdrop') && !this.persistent) {
            this.close();
        }
    }

    render() {
        if (!this.open) return html``;

        return html`
            <style>
                .app-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000; /* High z-index to sit above everything */
                    opacity: 0;
                    animation: fadeIn 0.2s forwards;
                }

                .app-modal-container {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                    width: 90%;
                    transform: scale(0.95);
                    opacity: 0;
                    animation: scaleIn 0.2s 0.1s forwards;
                }

                .app-modal-container.small { max-width: 400px; }
                .app-modal-container.medium { max-width: 600px; }
                .app-modal-container.large { max-width: 900px; }

                .app-modal-header {
                    padding: 16px 24px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .app-modal-title {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #333;
                }

                .app-modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }

                .app-modal-close:hover {
                    color: #333;
                }

                .app-modal-body {
                    padding: 24px;
                    overflow-y: auto;
                }

                .app-modal-footer {
                    padding: 16px 24px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    background-color: #f9f9f9;
                    border-radius: 0 0 8px 8px;
                }

                @keyframes fadeIn {
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    to { transform: scale(1); opacity: 1; }
                }
            </style>

            <div class="app-modal-backdrop" @click="${this._handleBackdropClick}">
                <div class="app-modal-container ${this.size}">
                    <div class="app-modal-header">
                        <h2 class="app-modal-title">${this.title}</h2>
                        <button class="app-modal-close" @click="${this.close}">&times;</button>
                    </div>
                    <div class="app-modal-body">
                        <slot></slot>
                    </div>
                    <div class="app-modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('powdercloud-modal', PowdercloudModal);
