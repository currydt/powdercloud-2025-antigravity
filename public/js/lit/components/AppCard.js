import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppCard extends LitElement {
    static properties = {
        title: { type: String },
        subtitle: { type: String },
        image: { type: String },
        elevation: { type: Number } // 0-5
    };

    constructor() {
        super();
        this.title = '';
        this.subtitle = '';
        this.image = '';
        this.elevation = 1;
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <style>
                .app-card {
                    background-color: white;
                    border-radius: 4px;
                    transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    font-family: 'Segoe UI', sans-serif;
                    margin-bottom: 20px;
                }

                /* Elevation Levels */
                .app-card.elevation-0 { border: 1px solid #e0e0e0; }
                .app-card.elevation-1 { box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); }
                .app-card.elevation-2 { box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23); }
                .app-card.elevation-3 { box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23); }
                .app-card.elevation-4 { box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); }
                .app-card.elevation-5 { box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22); }

                .app-card-image {
                    position: relative;
                }
                .app-card-image img {
                    display: block;
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                }

                .app-card-header {
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .app-card-header-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #363636;
                    line-height: 1.125;
                }

                .app-card-subtitle {
                    font-size: 0.875rem;
                    color: #757575;
                    margin-top: 4px;
                    font-weight: 400;
                }

                .app-card-header-icon {
                    color: #757575;
                    cursor: pointer;
                }

                .app-card-content {
                    padding: 16px;
                    color: #4a4a4a;
                    font-size: 1rem;
                    flex-grow: 1;
                }
                
                /* Remove top padding if header exists */
                .app-card-header + .app-card-content {
                    padding-top: 0;
                }

                .app-card-footer {
                    border-top: 1px solid #ededed;
                    display: flex;
                    align-items: stretch;
                }

                .app-card-footer ::slotted(*) {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 12px;
                    color: #3273dc;
                    cursor: pointer;
                    text-decoration: none;
                    border-right: 1px solid #ededed;
                    transition: background-color 0.2s;
                    font-weight: 500;
                }

                .app-card-footer ::slotted(*:last-child) {
                    border-right: none;
                }

                .app-card-footer ::slotted(*:hover) {
                    background-color: #f5f5f5;
                }
            </style>

            <div class="app-card elevation-${this.elevation}">
                ${this.image ? html`
                    <div class="app-card-image">
                        <img src="${this.image}" alt="${this.title}">
                    </div>
                ` : ''}
                
                ${this.title ? html`
                    <div class="app-card-header">
                        <div class="app-card-header-title">
                            ${this.title}
                            ${this.subtitle ? html`<div class="app-card-subtitle">${this.subtitle}</div>` : ''}
                        </div>
                        <div class="app-card-header-icon">
                            <slot name="header-action"></slot>
                        </div>
                    </div>
                ` : ''}

                <div class="app-card-content">
                    <slot></slot>
                </div>

                <div class="app-card-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('app-card', AppCard);
