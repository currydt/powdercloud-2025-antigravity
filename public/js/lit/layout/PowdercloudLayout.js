import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './PowdercloudHeader.js';
import './PowdercloudFooter.js';
import '../data-display/PowdercloudDisclaimer.js'; // Still imported but not seemingly used in template?
import '../navigation/PowdercloudBreadcrumbs.js';

export class PowdercloudLayout extends LitElement {
    static properties = {
        breadcrumbs: { type: Array },
        pageTitle: { type: String } // Adding pageTitle based on usage saw in Analysis pages
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
                powdercloud-header {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* Sticky Breadcrumbs */
                powdercloud-breadcrumbs {
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
                    padding: 20px;
                }
            </style>

            <div id="dvBodyWrap">
                <powdercloud-header></powdercloud-header>
                
                ${this.pageTitle ? html`
                    <div style="background: #f5f5f5; padding: 10px 20px; border-bottom: 1px solid #e0e0e0;">
                        <h1 style="margin: 0; font-size: 1.5rem; color: #333;">${this.pageTitle}</h1>
                    </div>
                ` : ''}

                <!-- <powdercloud-breadcrumbs .path="\${this.breadcrumbs}"></powdercloud-breadcrumbs> -->

                <div id="dvBody">
                    <div id="content">
                        <slot></slot>
                    </div>
                </div>

                <div class="dvFooterForce"></div>
            </div>
            
            <div id="dvFooterWrap">
                <powdercloud-footer></powdercloud-footer>
            </div>
        `;
    }
}

customElements.define('powdercloud-layout', PowdercloudLayout);
