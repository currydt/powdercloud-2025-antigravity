import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './AppHeader.js';
import './AppFooter.js';
import './AppDisclaimer.js';
import './Breadcrumbs.js';

export class AppLayout extends LitElement {
    static properties = {
        breadcrumbs: { type: Array }
    };

    constructor() {
        super();
        this.breadcrumbs = [];
    }

    // Remove createRenderRoot to use Shadow DOM

    render() {
        return html`
            <!-- Import Global Styles into Shadow DOM -->
            <link href="/css/main.css" rel="stylesheet" type="text/css" />
            <link href="/css/mainNew.css" rel="stylesheet" type="text/css" />
            <link rel="stylesheet" type="text/css" href="/resources/css/ext-all.css" />
            <link rel="stylesheet" type="text/css" id="theme" href="/resources/css/xtheme-gray.css" />

            <style>
                /* Sticky Header */
                app-header {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* Sticky Breadcrumbs */
                app-breadcrumbs {
                    position: sticky;
                    top: 60px; /* Adjust based on header height */
                    z-index: 999;
                    background: white;
                    border-bottom: 1px solid #ddd;
                    padding: 5px 0;
                }

                /* Ensure body has proper spacing */
                #dvBodyWrap {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                #dvBody {
                    flex: 1;
                }
            </style>

            <div id="dvBodyWrap">
                <app-header></app-header>
                
                <app-breadcrumbs .path="${this.breadcrumbs}"></app-breadcrumbs>

                <div id="dvBody">
                    <div id="content">
                        <slot></slot>
                    </div>
                </div>

                <div class="dvFooterForce"></div>
            </div>
            
            <div id="dvFooterWrap">
                <app-footer></app-footer>
            </div>
        `;
    }
}

customElements.define('app-layout', AppLayout);
