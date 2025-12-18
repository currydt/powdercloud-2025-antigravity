import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/AppContainer.js';
import './components/ComponentDoc.js';
import './components/AppGrid.js';
import './components/AppStack.js';
import './components/AppSpacer.js';
import './components/PowdercloudButton.js';

export class DesignSystemLayoutPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const layoutElementsCode = `<app-container>
    <app-grid cols="3" gap="lg">
        <div style="background: #eee; padding: 20px;">Column 1</div>
        <div style="background: #eee; padding: 20px;">Column 2</div>
        <div style="background: #eee; padding: 20px;">Column 3</div>
    </app-grid>

    <app-spacer y="4"></app-spacer>

    <app-stack direction="row" gap="md" align="center">
        <powdercloud-button label="Save"></powdercloud-button>
        <powdercloud-button label="Cancel" variant="secondary"></powdercloud-button>
    </app-stack>
</app-container>`;

        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Layout Elements
                </h1>
                
                <div style="padding: 20px;">
                    <component-doc 
                        title="Layout System" 
                        description="Core components for structuring page content without custom CSS."
                        .code="${layoutElementsCode}">
                        
                        <div style="border: 1px dashed #ccc; padding: 10px;">
                            <app-container>
                                <div style="background: #e3f2fd; padding: 10px; margin-bottom: 10px; text-align: center; color: #0d47a1;">
                                    <strong>&lt;app-container&gt;</strong> (Centers content)
                                </div>

                                <app-grid cols="3" gap="md" cols-md="2" cols-default="1">
                                    <div style="background: #f3e5f5; padding: 20px; text-align: center; color: #4a148c;">Grid Item 1</div>
                                    <div style="background: #f3e5f5; padding: 20px; text-align: center; color: #4a148c;">Grid Item 2</div>
                                    <div style="background: #f3e5f5; padding: 20px; text-align: center; color: #4a148c;">Grid Item 3</div>
                                </app-grid>

                                <app-spacer y="2"></app-spacer>

                                <app-stack direction="row" gap="md" align="center" style="background: #e8f5e9; padding: 10px;">
                                    <span style="color: #1b5e20;"><strong>&lt;app-stack&gt;</strong> (Flexbox)</span>
                                    <powdercloud-button label="Action 1" size="small"></powdercloud-button>
                                    <powdercloud-button label="Action 2" size="small" variant="secondary"></powdercloud-button>
                                </app-stack>
                            </app-container>
                        </div>

                    </component-doc>
                </div>
            </app-container>
        `;
    }
}

customElements.define('design-system-layout-page', DesignSystemLayoutPage);
