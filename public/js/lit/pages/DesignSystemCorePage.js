import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudContainer.js';
import '../utils/PowdercloudComponentDoc.js';
import '../communication/PowdercloudAlert.js';
import '../data-display/PowdercloudDisclaimer.js';
import '../utils/PowdercloudCollapsiblePanel.js';
import '../navigation/PowdercloudBreadcrumbs.js';
import '../layout/PowdercloudFooter.js';
import '../layout/PowdercloudHeader.js';
import '../layout/PowdercloudLayout.js';
import '../navigation/PowdercloudMegaMenu.js';

export class DesignSystemCorePage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const alertCode = `<powdercloud-alert level="warning" title="Warning Title">
    This is a warning message.
</powdercloud-alert>

<powdercloud-alert level="info" title="Info Title">
    This is an informational message.
</powdercloud-alert>`;

        const disclaimerCode = `<powdercloud-disclaimer></powdercloud-disclaimer>`;

        const panelCode = `<powdercloud-collapsible-panel title="Panel Title" tagline="Optional Tagline">
    <div style="padding: 15px;">
        Panel Content Goes Here...
    </div>
</powdercloud-collapsible-panel>`;

        const breadcrumbsCode = `<powdercloud-breadcrumbs .items="\${[
    { label: "Home", href: "/" },
    { label: "Section", href: "/section" },
    { label: "Current Page", active: true }
]}"></powdercloud-breadcrumbs>`;

        const footerCode = `<powdercloud-footer></powdercloud-footer>`;

        const headerCode = `<powdercloud-header></powdercloud-header>`;

        const layoutCode = `<powdercloud-layout>
    <powdercloud-breadcrumbs slot="breadcrumbs" ...></powdercloud-breadcrumbs>
    <main>
        Page Content...
    </main>
</powdercloud-layout>`;

        const menuCode = `<powdercloud-mega-menu 
    title="Menu Title" 
    subtitle="Subtitle" 
    .menuData="\${[...]}">
</powdercloud-mega-menu>`;

        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Core Components
                </h1>
                
                <div style="padding: 20px;">
                    
                    <powdercloud-component-doc 
                        title="<powdercloud-alert>" 
                        description="Standardized alert box for warnings, errors, info, and success messages."
                        .code="${alertCode}">
                        <powdercloud-alert level="warning" title="Warning Title">This is a warning message.</powdercloud-alert>
                        <powdercloud-alert level="info" title="Info Title">This is an informational message.</powdercloud-alert>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-disclaimer>" 
                        description="Standard legal/safety disclaimer footer."
                        .code="${disclaimerCode}">
                        <powdercloud-disclaimer></powdercloud-disclaimer>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-collapsible-panel>" 
                        description="Expandable container for organizing content sections."
                        .code="${panelCode}">
                        <powdercloud-collapsible-panel title="Panel Title" tagline="Optional Tagline">
                            <div style="padding: 15px;">
                                Panel Content Goes Here...
                            </div>
                        </powdercloud-collapsible-panel>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-breadcrumbs>" 
                        description="Navigation trail showing current page location."
                        .code="${breadcrumbsCode}">
                        <powdercloud-breadcrumbs .items="${[
                { label: 'Home', href: '#' },
                { label: 'Admin', href: '#' },
                { label: 'Components', active: true }
            ]}"></powdercloud-breadcrumbs>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-footer>" 
                        description="Global application footer with copyright and links."
                        .code="${footerCode}">
                        <powdercloud-footer></powdercloud-footer>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-header>" 
                        description="Global top navigation bar. (See top of page for live instance)"
                        .code="${headerCode}">
                        <div style="padding: 20px; background: #eee; text-align: center; color: #666; font-style: italic;">
                            Global Header Component (Fixed Position)
                        </div>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-layout>" 
                        description="Main page wrapper that handles header, footer, and content area."
                        .code="${layoutCode}">
                        <div style="padding: 20px; background: #eee; text-align: center; color: #666; font-style: italic;">
                            Page Layout Wrapper (See Page Architecture)
                        </div>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-mega-menu>" 
                        description="Dropdown menu component used within AppHeader."
                        .code="${menuCode}">
                        <div style="position: relative; height: 50px;">
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <powdercloud-mega-menu 
                                    title="Demo Menu" 
                                    subtitle="Hover Me" 
                                    .menuData="${[[{ title: 'Group 1', links: [{ label: 'Link 1', url: '#' }] }]]}"
                                ></powdercloud-mega-menu>
                            </ul>
                        </div>
                    </powdercloud-component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-core-page', DesignSystemCorePage);
