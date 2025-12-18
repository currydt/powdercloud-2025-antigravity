import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/ComponentDoc.js';
import './components/PowdercloudModal.js';
import './components/PowdercloudToast.js';
import './components/PowdercloudButton.js';
import './components/PowdercloudCombobox.js';
import './components/PowdercloudDateRange.js';
import './components/PowdercloudFileUpload.js';
import './components/PowdercloudRichText.js';

export class DesignSystemOverlaysPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const modalCode = `<powdercloud-modal title="Example Modal" open>
    <p>Modal content goes here.</p>
    <div slot="footer">
        <powdercloud-button label="Close" @click="\${() => this.modalOpen = false}"></powdercloud-button>
        <powdercloud-button label="Save" variant="primary"></powdercloud-button>
    </div>
</powdercloud-modal>`;

        const toastCode = `<powdercloud-toast message="Operation Saved" variant="success" open></powdercloud-toast>`;

        const comboboxCode = `<powdercloud-combobox label="Select User" .options="\${[
    { label: 'Alice', value: 'alice' },
    { label: 'Bob', value: 'bob' }
]}"></powdercloud-combobox>`;

        const dateRangeCode = `<powdercloud-date-range label="Filter by Date"></powdercloud-date-range>`;

        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Overlays & Complex Inputs
                </h1>
                
                <div style="padding: 20px;">
                    
                    <component-doc 
                        title="<powdercloud-modal>" 
                        description="Dialog box for critical actions or information."
                        .code="${modalCode}">
                        <powdercloud-button label="Open Modal" @click="${() => this.shadowRoot.getElementById('demo-modal').open = true}"></powdercloud-button>
                        <powdercloud-modal id="demo-modal" title="Example Modal">
                            <p>This is a modal dialog. It overlays the page content.</p>
                            <div slot="footer">
                                <powdercloud-button label="Close" @click="${() => this.shadowRoot.getElementById('demo-modal').open = false}"></powdercloud-button>
                                <powdercloud-button label="Save" variant="primary" @click="${() => this.shadowRoot.getElementById('demo-modal').open = false}"></powdercloud-button>
                            </div>
                        </powdercloud-modal>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-toast>" 
                        description="Temporary notification message."
                        .code="${toastCode}">
                         <powdercloud-button label="Show Toast" @click="${() => {
                const toast = this.shadowRoot.getElementById('demo-toast');
                toast.open = true;
                setTimeout(() => toast.open = false, 3000);
            }}"></powdercloud-button>
                        <powdercloud-toast id="demo-toast" message="Operation Saved Successfully" variant="success"></powdercloud-toast>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-combobox>" 
                        description="Select with search/filtering capabilities."
                        .code="${comboboxCode}">
                        <div style="height: 250px;"> <!-- Spacer for dropdown -->
                            <powdercloud-combobox label="Select User" .options="${[
                { label: 'Alice', value: 'alice' },
                { label: 'Bob', value: 'bob' },
                { label: 'Charlie', value: 'charlie' },
                { label: 'Dave', value: 'dave' }
            ]}"></powdercloud-combobox>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-date-range>" 
                        description="Date range picker."
                        .code="${dateRangeCode}">
                        <powdercloud-date-range label="Filter by Date"></powdercloud-date-range>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-file-upload>" 
                        description="File upload component."
                         .code="${`<powdercloud-file-upload label='Upload Evidence'></powdercloud-file-upload>`}">
                        <powdercloud-file-upload label="Upload Evidence"></powdercloud-file-upload>
                    </component-doc>

                     <component-doc 
                        title="<powdercloud-rich-text>" 
                        description="Rich text editor."
                         .code="${`<powdercloud-rich-text label='Description'></powdercloud-rich-text>`}">
                        <powdercloud-rich-text label="Description"></powdercloud-rich-text>
                    </component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-overlays-page', DesignSystemOverlaysPage);
