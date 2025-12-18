import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/AppContainer.js';
import './components/ComponentDoc.js';
import './components/AppModal.js';
import './components/AppToast.js';
import './components/PowdercloudButton.js';
import './components/AppCombobox.js';
import './components/AppDateRange.js';
import './components/AppFileUpload.js';
import './components/AppRichText.js';

export class DesignSystemOverlaysPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const modalCode = `<app-modal title="Example Modal" open>
    <p>Modal content goes here.</p>
    <div slot="footer">
        <powdercloud-button label="Close" @click="\${() => this.modalOpen = false}"></powdercloud-button>
        <powdercloud-button label="Save" variant="primary"></powdercloud-button>
    </div>
</app-modal>`;

        const toastCode = `<app-toast message="Operation Saved" variant="success" open></app-toast>`;

        const comboboxCode = `<app-combobox label="Select User" .options="\${[
    { label: 'Alice', value: 'alice' },
    { label: 'Bob', value: 'bob' }
]}"></app-combobox>`;

        const dateRangeCode = `<app-date-range label="Filter by Date"></app-date-range>`;

        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Overlays & Complex Inputs
                </h1>
                
                <div style="padding: 20px;">
                    
                    <component-doc 
                        title="<app-modal>" 
                        description="Dialog box for critical actions or information."
                        .code="${modalCode}">
                        <powdercloud-button label="Open Modal" @click="${() => this.shadowRoot.getElementById('demo-modal').open = true}"></powdercloud-button>
                        <app-modal id="demo-modal" title="Example Modal">
                            <p>This is a modal dialog. It overlays the page content.</p>
                            <div slot="footer">
                                <powdercloud-button label="Close" @click="${() => this.shadowRoot.getElementById('demo-modal').open = false}"></powdercloud-button>
                                <powdercloud-button label="Save" variant="primary" @click="${() => this.shadowRoot.getElementById('demo-modal').open = false}"></powdercloud-button>
                            </div>
                        </app-modal>
                    </component-doc>

                    <component-doc 
                        title="<app-toast>" 
                        description="Temporary notification message."
                        .code="${toastCode}">
                         <powdercloud-button label="Show Toast" @click="${() => {
                const toast = this.shadowRoot.getElementById('demo-toast');
                toast.open = true;
                setTimeout(() => toast.open = false, 3000);
            }}"></powdercloud-button>
                        <app-toast id="demo-toast" message="Operation Saved Successfully" variant="success"></app-toast>
                    </component-doc>

                    <component-doc 
                        title="<app-combobox>" 
                        description="Select with search/filtering capabilities."
                        .code="${comboboxCode}">
                        <div style="height: 250px;"> <!-- Spacer for dropdown -->
                            <app-combobox label="Select User" .options="${[
                { label: 'Alice', value: 'alice' },
                { label: 'Bob', value: 'bob' },
                { label: 'Charlie', value: 'charlie' },
                { label: 'Dave', value: 'dave' }
            ]}"></app-combobox>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<app-date-range>" 
                        description="Date range picker."
                        .code="${dateRangeCode}">
                        <app-date-range label="Filter by Date"></app-date-range>
                    </component-doc>

                    <component-doc 
                        title="<app-file-upload>" 
                        description="File upload component."
                         .code="${`<app-file-upload label='Upload Evidence'></app-file-upload>`}">
                        <app-file-upload label="Upload Evidence"></app-file-upload>
                    </component-doc>

                     <component-doc 
                        title="<app-rich-text>" 
                        description="Rich text editor."
                         .code="${`<app-rich-text label='Description'></app-rich-text>`}">
                        <app-rich-text label="Description"></app-rich-text>
                    </component-doc>

                </div>
            </app-container>
        `;
    }
}

customElements.define('design-system-overlays-page', DesignSystemOverlaysPage);
