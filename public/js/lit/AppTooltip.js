import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppTooltip extends LitElement {
    static properties = {
        content: { type: String },
        position: { type: String } // 'top', 'bottom', 'left', 'right'
    };

    constructor() {
        super();
        this.content = '';
        this.position = 'top';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <style>
                .app-tooltip-wrapper {
                    position: relative;
                    display: inline-block;
                }

                .app-tooltip-content {
                    visibility: hidden;
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    padding: 6px 10px;
                    border-radius: 4px;
                    position: absolute;
                    z-index: 1000;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.2s;
                    pointer-events: none;
                }

                .app-tooltip-wrapper:hover .app-tooltip-content {
                    visibility: visible;
                    opacity: 1;
                }

                /* Positions */
                .app-tooltip-content.top {
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-bottom: 8px;
                }
                .app-tooltip-content.top::after {
                    content: " ";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #333 transparent transparent transparent;
                }

                .app-tooltip-content.bottom {
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-top: 8px;
                }
                .app-tooltip-content.bottom::after {
                    content: " ";
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent transparent #333 transparent;
                }

                .app-tooltip-content.left {
                    top: 50%;
                    right: 100%;
                    transform: translateY(-50%);
                    margin-right: 8px;
                }
                .app-tooltip-content.left::after {
                    content: " ";
                    position: absolute;
                    top: 50%;
                    left: 100%;
                    margin-top: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent transparent transparent #333;
                }

                .app-tooltip-content.right {
                    top: 50%;
                    left: 100%;
                    transform: translateY(-50%);
                    margin-left: 8px;
                }
                .app-tooltip-content.right::after {
                    content: " ";
                    position: absolute;
                    top: 50%;
                    right: 100%;
                    margin-top: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent #333 transparent transparent;
                }
            </style>

            <div class="app-tooltip-wrapper">
                <slot></slot>
                <div class="app-tooltip-content ${this.position}">
                    ${this.content}
                </div>
            </div>
        `;
    }
}

customElements.define('app-tooltip', AppTooltip);
