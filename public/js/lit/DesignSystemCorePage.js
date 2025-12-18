import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/ComponentDoc.js';
import './components/PowdercloudAlert.js';
import './components/PowdercloudDisclaimer.js';
import './components/CollapsiblePanel.js';
import './components/Breadcrumbs.js';
import './components/AppFooter.js';
import './components/AppHeader.js';
import './components/AppLayout.js';
import './components/MegaMenu.js';

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

        const panelCode = `<collapsible-panel title="Panel Title" tagline="Optional Tagline">
    <div style="padding: 15px;">
        Panel Content Goes Here...
    </div>
</collapsible-panel>`;

        const breadcrumbsCode = `<app-breadcrumbs .items="\${[
    { label: "Home", href: "/" },
    { label: "Section", href: "/section" },
    { label: "Current Page", active: true }
]}"></app-breadcrumbs>`;

        const footerCode = `<app-footer></app-footer>`;

        const headerCode = `<app-header></app-header>`;

        const layoutCode = `<app-layout>
    <app-breadcrumbs slot="breadcrumbs" ...></app-breadcrumbs>
    <main>
        Page Content...
    </main>
</app-layout>`;

        const menuCode = `<mega-menu 
    title="Menu Title" 
    subtitle="Subtitle" 
    .menuData="\${[...]}">
</mega-menu>`;

        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Core Components
                </h1>
                
                <div style="padding: 20px;">
                    
                    <component-doc 
                        title="<powdercloud-alert>" 
                        description="Standardized alert box for warnings, errors, info, and success messages."
                        .code="${alertCode}">
                        <powdercloud-alert level="warning" title="Warning Title">This is a warning message.</powdercloud-alert>
                        <powdercloud-alert level="info" title="Info Title">This is an informational message.</powdercloud-alert>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-disclaimer>" 
                        description="Standard legal/safety disclaimer footer."
                        .code="${disclaimerCode}">
                        <powdercloud-disclaimer></powdercloud-disclaimer>
                    </component-doc>

                    <component-doc 
                        title="<collapsible-panel>" 
                        description="Expandable container for organizing content sections."
                        .code="${panelCode}">
                        <collapsible-panel title="Panel Title" tagline="Optional Tagline">
                            <div style="padding: 15px;">
                                Panel Content Goes Here...
                            </div>
                        </collapsible-panel>
                    </component-doc>

                    <component-doc 
                        title="<app-breadcrumbs>" 
                        description="Navigation trail showing current page location."
                        .code="${breadcrumbsCode}">
                        <app-breadcrumbs .items="${[
                { label: 'Home', href: '#' },
                { label: 'Admin', href: '#' },
                { label: 'Components', active: true }
            ]}"></app-breadcrumbs>
                    </component-doc>

                    <component-doc 
                        title="<app-footer>" 
                        description="Global application footer with copyright and links."
                        .code="${footerCode}">
                        <app-footer></app-footer>
                    </component-doc>

                    <component-doc 
                        title="<app-header>" 
                        description="Global top navigation bar. (See top of page for live instance)"
                        .code="${headerCode}">
                        <div style="padding: 20px; background: #eee; text-align: center; color: #666; font-style: italic;">
                            Global Header Component (Fixed Position)
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<app-layout>" 
                        description="Main page wrapper that handles header, footer, and content area."
                        .code="${layoutCode}">
                        <div style="padding: 20px; background: #eee; text-align: center; color: #666; font-style: italic;">
                            Page Layout Wrapper (See Page Architecture)
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<mega-menu>" 
                        description="Dropdown menu component used within AppHeader."
                        .code="${menuCode}">
                        <div style="position: relative; height: 50px;">
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <mega-menu 
                                    title="Demo Menu" 
                                    subtitle="Hover Me" 
                                    .menuData="${[[{ title: 'Group 1', links: [{ label: 'Link 1', url: '#' }] }]]}"
                                ></mega-menu>
                            </ul>
                        </div>
                    </component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-core-page', DesignSystemCorePage);
