import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudComponentDoc.js';
import './components/PowdercloudAvatar.js';
import './components/PowdercloudTooltip.js';
import './components/PowdercloudButton.js';

export class DesignSystemFeedbackPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Feedback & Display
                </h1>
                
                <div style="padding: 20px;">
                    
                    <powdercloud-component-doc 
                        title="<powdercloud-avatar>" 
                        description="User profile image or initials."
                        .code="${`<powdercloud-avatar src='https://via.placeholder.com/150' size='md'></powdercloud-avatar>
<powdercloud-avatar initials='JD' size='md' shape='square'></powdercloud-avatar>`}">
                        <div style="display: flex; gap: 20px; align-items: center;">
                            <powdercloud-avatar src="https://via.placeholder.com/150" size="sm"></powdercloud-avatar>
                            <powdercloud-avatar src="https://via.placeholder.com/150" size="md"></powdercloud-avatar>
                            <powdercloud-avatar src="https://via.placeholder.com/150" size="lg"></powdercloud-avatar>
                            <powdercloud-avatar initials="JD" size="md" shape="square"></powdercloud-avatar>
                        </div>
                    </powdercloud-component-doc>

                    <powdercloud-component-doc 
                        title="<powdercloud-tooltip>" 
                        description="Contextual information on hover."
                        .code="${`<powdercloud-tooltip content='This is a tooltip'>
    <powdercloud-button label='Hover Me'></powdercloud-button>
</powdercloud-tooltip>`}">
                        <div style="display: flex; gap: 40px; padding: 20px;">
                            <powdercloud-tooltip content="Top Tooltip" position="top">
                                <powdercloud-button label="Top"></powdercloud-button>
                            </powdercloud-tooltip>
                            <powdercloud-tooltip content="Right Tooltip" position="right">
                                <powdercloud-button label="Right"></powdercloud-button>
                            </powdercloud-tooltip>
                            <powdercloud-tooltip content="Bottom Tooltip" position="bottom">
                                <powdercloud-button label="Bottom"></powdercloud-button>
                            </powdercloud-tooltip>
                            <powdercloud-tooltip content="Left Tooltip" position="left">
                                <powdercloud-button label="Left"></powdercloud-button>
                            </powdercloud-tooltip>
                        </div>
                    </powdercloud-component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-feedback-page', DesignSystemFeedbackPage);
