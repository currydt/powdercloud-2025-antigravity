import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/AppContainer.js';
import './components/ComponentDoc.js';
import './components/AppAvatar.js';
import './components/AppTooltip.js';
import './components/AppButton.js';

export class DesignSystemFeedbackPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Feedback & Display
                </h1>
                
                <div style="padding: 20px;">
                    
                    <component-doc 
                        title="<app-avatar>" 
                        description="User profile image or initials."
                        .code="${`<app-avatar src='https://via.placeholder.com/150' size='md'></app-avatar>
<app-avatar initials='JD' size='md' shape='square'></app-avatar>`}">
                        <div style="display: flex; gap: 20px; align-items: center;">
                            <app-avatar src="https://via.placeholder.com/150" size="sm"></app-avatar>
                            <app-avatar src="https://via.placeholder.com/150" size="md"></app-avatar>
                            <app-avatar src="https://via.placeholder.com/150" size="lg"></app-avatar>
                            <app-avatar initials="JD" size="md" shape="square"></app-avatar>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<app-tooltip>" 
                        description="Contextual information on hover."
                        .code="${`<app-tooltip content='This is a tooltip'>
    <app-button label='Hover Me'></app-button>
</app-tooltip>`}">
                        <div style="display: flex; gap: 40px; padding: 20px;">
                            <app-tooltip content="Top Tooltip" position="top">
                                <app-button label="Top"></app-button>
                            </app-tooltip>
                            <app-tooltip content="Right Tooltip" position="right">
                                <app-button label="Right"></app-button>
                            </app-tooltip>
                            <app-tooltip content="Bottom Tooltip" position="bottom">
                                <app-button label="Bottom"></app-button>
                            </app-tooltip>
                            <app-tooltip content="Left Tooltip" position="left">
                                <app-button label="Left"></app-button>
                            </app-tooltip>
                        </div>
                    </component-doc>

                </div>
            </app-container>
        `;
    }
}

customElements.define('design-system-feedback-page', DesignSystemFeedbackPage);
