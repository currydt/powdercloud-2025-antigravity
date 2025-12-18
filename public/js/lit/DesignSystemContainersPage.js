import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/ComponentDoc.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudFieldset.js';
import './components/CollapsiblePanel.js';
import './components/PowdercloudTabs.js';
import './components/PowdercloudInput.js';
import './components/PowdercloudTextarea.js';

export class DesignSystemContainersPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const cardCode = `<powdercloud-card title="Card Title" subtitle="Subtitle">
    <div slot="header-action">
        <i class="fa fa-ellipsis-v"></i>
    </div>
    <p>This is the main content of the card. It can contain text, images, or other components.</p>
    <div slot="footer">
        <a href="#">Save</a>
        <a href="#">Edit</a>
        <a href="#">Delete</a>
    </div>
</powdercloud-card>`;

        const fieldsetCode = `<powdercloud-fieldset legend="User Details">
    <powdercloud-input label="Name"></powdercloud-input>
    <powdercloud-input label="Email"></powdercloud-input>
</powdercloud-fieldset>`;

        const panelCode = `<collapsible-panel title="Panel Title" tagline="Optional Tagline">
    <div style="padding: 15px;">
        Panel Content Goes Here...
    </div>
</collapsible-panel>`;

        const tabsCode = `<powdercloud-tabs>
    <app-tab label="First Tab" active>
        <h3>First Tab Content</h3>
        <p>This is the content of the first tab.</p>
    </app-tab>
    <app-tab label="Second Tab">
        <h3>Second Tab Content</h3>
        <p>This is the content of the second tab.</p>
    </app-tab>
    <app-tab label="Third Tab">
        <h3>Third Tab Content</h3>
        <p>This is the content of the third tab.</p>
    </app-tab>
</powdercloud-tabs>`;

        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Containers
                </h1>
                
                <div style="padding: 20px;">
                    
                    <component-doc 
                        title="<powdercloud-card>" 
                        description="The primary container for grouping related content."
                        .code="${cardCode}">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <powdercloud-card title="Standard Card" subtitle="With Header Actions">
                                <div slot="header-action"><i class="fa fa-ellipsis-v"></i></div>
                                <p>Cards are the fundamental building blocks for content. They provide a clean surface with elevation.</p>
                                <div slot="footer">
                                    <a href="#">Action 1</a>
                                    <a href="#">Action 2</a>
                                </div>
                            </powdercloud-card>
                            <powdercloud-card title="Media Card" image="https://via.placeholder.com/400x200">
                                <p>Cards can feature hero images to highlight content.</p>
                            </powdercloud-card>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-fieldset>" 
                        description="A semantic container for grouping form inputs."
                        .code="${fieldsetCode}">
                        <powdercloud-fieldset legend="User Information">
                            <powdercloud-input label="Full Name"></powdercloud-input>
                            <powdercloud-input label="Email Address"></powdercloud-input>
                        </powdercloud-fieldset>
                    </component-doc>

                    <component-doc 
                        title="<collapsible-panel>" 
                        description="An expandable container for managing screen real estate."
                        .code="${panelCode}">
                        <collapsible-panel title="Admin Panel" tagline="Click to toggle" .open="${true}">
                            <div style="padding: 15px;">
                                Panels are great for hiding advanced settings or large sections of content.
                            </div>
                        </collapsible-panel>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-tabs>" 
                        description="Material Design style tabs for switching between content views."
                        .code="${tabsCode}">
                        <powdercloud-tabs>
                            <app-tab label="First Tab" active>
                                <div style="padding: 20px; background: #f9f9f9; border: 1px solid #eee; border-top: none;">
                                    <h3 style="margin-top: 0; color: #5399a5;">First Tab Content</h3>
                                    <p>This is the content of the first tab. It is visible by default because of the <code>active</code> attribute.</p>
                                </div>
                            </app-tab>
                            <app-tab label="Second Tab">
                                <div style="padding: 20px; background: #f9f9f9; border: 1px solid #eee; border-top: none;">
                                    <h3 style="margin-top: 0; color: #5399a5;">Second Tab Content</h3>
                                    <p>This content is revealed when you click the second tab header.</p>
                                </div>
                            </app-tab>
                            <app-tab label="Third Tab">
                                <div style="padding: 20px; background: #f9f9f9; border: 1px solid #eee; border-top: none;">
                                    <h3 style="margin-top: 0; color: #5399a5;">Third Tab Content</h3>
                                    <p>Tabs support any HTML content inside them.</p>
                                </div>
                            </app-tab>
                        </powdercloud-tabs>
                    </component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-containers-page', DesignSystemContainersPage);
