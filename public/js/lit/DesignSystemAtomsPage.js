import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/ComponentDoc.js';
import './components/PowdercloudButton.js';
import './components/PowdercloudInput.js';
import './components/AppTextarea.js';
import './components/AppSelect.js';
import './components/PowdercloudCheckbox.js';
import './components/PowdercloudRadio.js';
import './components/AppSwitch.js';
import './components/PowdercloudChip.js';
import './components/PowdercloudProgress.js';
import './components/PowdercloudDivider.js';

export class DesignSystemAtomsPage extends LitElement {
    static properties = {
        _btnLabel: { state: true },
        _btnVariant: { state: true },
        _btnSize: { state: true },
        _btnDisabled: { state: true },
        _btnIcon: { state: true },
        _inputLabel: { state: true },
        _inputType: { state: true },
        _inputRequired: { state: true },
        _inputDisabled: { state: true },
        _inputError: { state: true },
        _inputHelper: { state: true }
    };

    constructor() {
        super();
        this._btnLabel = 'Click Me';
        this._btnVariant = 'primary';
        this._btnSize = 'medium';
        this._btnDisabled = false;
        this._btnIcon = '';

        this._inputLabel = 'Dynamic Input';
        this._inputType = 'text';
        this._inputRequired = false;
        this._inputDisabled = false;
        this._inputError = '';
        this._inputHelper = 'Type to see changes';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const textareaCode = `<app-textarea label="Comments" rows="4"></app-textarea>`;

        const selectCode = `<app-select label="Choose Option" .options="\${[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
]}"></app-select>`;

        const checkCode = `<powdercloud-checkbox label="Subscribe"></powdercloud-checkbox>
<powdercloud-checkbox label="Disabled" disabled></powdercloud-checkbox>`;

        const switchCode = `<app-switch label="Notifications"></app-switch>
<app-switch label="Checked" checked></app-switch>
<app-switch label="Disabled" disabled></app-switch>`;

        const chipCode = `<powdercloud-chip label="Basic Chip"></powdercloud-chip>
<powdercloud-chip label="Primary" variant="primary"></powdercloud-chip>
<powdercloud-chip label="With Icon" icon="fa fa-star"></powdercloud-chip>
<powdercloud-chip label="Removable" removable @remove="\${(e) => alert('Removed ' + e.detail.label)}"></powdercloud-chip>`;

        const progressCode = `<powdercloud-progress label="Loading Data..." type="linear"></powdercloud-progress>
<powdercloud-progress label="Uploading (75%)" type="linear" value="75"></powdercloud-progress>
<powdercloud-progress type="circular"></powdercloud-progress>`;

        const dividerCode = `<p>Item 1</p>
<powdercloud-divider></powdercloud-divider>
<p>Item 2</p>`;

        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Atomic Elements
                </h1>
                
                <div style="padding: 20px;">
                    
                    <!-- BUTTON PLAYGROUND -->
                    <component-doc 
                        title="<powdercloud-button>" 
                        description="Interactive button generator."
                        .code="${`<powdercloud-button
    label="${this._btnLabel}"
    variant="${this._btnVariant}"
    size="${this._btnSize}"${this._btnDisabled ? '\n    disabled' : ''}${this._btnIcon ? `\n    icon="${this._btnIcon}"` : ''}
></powdercloud-button>`}">
                        
                        <div style="display: flex; gap: 40px; align-items: flex-start; margin-bottom: 20px;">
                            <!-- Live Preview -->
                            <div style="flex: 1; display: flex; justify-content: center; align-items: center; min-height: 80px; background: #f8f9fa; border-radius: 8px; border: 1px dashed #ccc;">
                                <powdercloud-button 
                                    label="${this._btnLabel}" 
                                    variant="${this._btnVariant}" 
                                    size="${this._btnSize}" 
                                    ?disabled="${this._btnDisabled}"
                                    icon="${this._btnIcon}"
                                ></powdercloud-button>
                            </div>

                            <!-- Controls -->
                            <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.9em;">
                                <label>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Label</div>
                                    <input type="text" .value="${this._btnLabel}" @input="${e => this._btnLabel = e.target.value}" style="width: 100%; padding: 4px;">
                                </label>

                                <label>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Variant</div>
                                    <select @change="${e => this._btnVariant = e.target.value}" style="width: 100%; padding: 4px;">
                                        <option value="primary" ?selected="${this._btnVariant === 'primary'}">Primary</option>
                                        <option value="secondary" ?selected="${this._btnVariant === 'secondary'}">Secondary</option>
                                        <option value="outline" ?selected="${this._btnVariant === 'outline'}">Outline</option>
                                        <option value="text" ?selected="${this._btnVariant === 'text'}">Text</option>
                                        <option value="danger" ?selected="${this._btnVariant === 'danger'}">Danger</option>
                                    </select>
                                </label>

                                <label>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Size</div>
                                    <select @change="${e => this._btnSize = e.target.value}" style="width: 100%; padding: 4px;">
                                        <option value="small" ?selected="${this._btnSize === 'small'}">Small</option>
                                        <option value="medium" ?selected="${this._btnSize === 'medium'}">Medium</option>
                                        <option value="large" ?selected="${this._btnSize === 'large'}">Large</option>
                                    </select>
                                </label>

                                <label>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Icon Class</div>
                                    <input type="text" .value="${this._btnIcon}" @input="${e => this._btnIcon = e.target.value}" placeholder="e.g. fa fa-save" style="width: 100%; padding: 4px;">
                                </label>

                                <label style="display: flex; align-items: center; gap: 8px; grid-column: span 2; margin-top: 5px;">
                                    <input type="checkbox" ?checked="${this._btnDisabled}" @change="${e => this._btnDisabled = e.target.checked}">
                                    <strong>Disabled State</strong>
                                </label>
                            </div>
                        </div>
                    </component-doc>

                    <!-- INPUT PLAYGROUND -->
                    <component-doc 
                        title="<powdercloud-input>" 
                        description="Interactive input generator."
                        .code="${`<powdercloud-input
    label="${this._inputLabel}"
    type="${this._inputType}"${this._inputRequired ? '\n    required' : ''}${this._inputDisabled ? '\n    disabled' : ''}${this._inputHelper ? `\n    helper="${this._inputHelper}"` : ''}${this._inputError ? `\n    error="${this._inputError}"` : ''}
></powdercloud-input>`}">
                        
                        <div style="display: flex; gap: 40px; align-items: flex-start; margin-bottom: 20px;">
                            <!-- Live Preview -->
                            <div style="flex: 1; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px dashed #ccc;">
                                <powdercloud-input 
                                    label="${this._inputLabel}" 
                                    type="${this._inputType}"
                                    helper="${this._inputHelper}"
                                    error="${this._inputError}"
                                    ?required="${this._inputRequired}"
                                    ?disabled="${this._inputDisabled}"
                                ></powdercloud-input>
                            </div>

                            <!-- Controls -->
                            <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.9em;">
                                <label>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Label</div>
                                    <input type="text" .value="${this._inputLabel}" @input="${e => this._inputLabel = e.target.value}" style="width: 100%; padding: 4px;">
                                </label>

                                <label>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Type</div>
                                    <select @change="${e => this._inputType = e.target.value}" style="width: 100%; padding: 4px;">
                                        <option value="text" ?selected="${this._inputType === 'text'}">Text</option>
                                        <option value="password" ?selected="${this._inputType === 'password'}">Password</option>
                                        <option value="email" ?selected="${this._inputType === 'email'}">Email</option>
                                        <option value="number" ?selected="${this._inputType === 'number'}">Number</option>
                                        <option value="date" ?selected="${this._inputType === 'date'}">Date</option>
                                    </select>
                                </label>

                                <label style="grid-column: span 2;">
                                    <div style="font-weight: 600; margin-bottom: 4px;">Helper Text</div>
                                    <input type="text" .value="${this._inputHelper}" @input="${e => this._inputHelper = e.target.value}" style="width: 100%; padding: 4px;">
                                </label>

                                <label style="grid-column: span 2;">
                                    <div style="font-weight: 600; margin-bottom: 4px;">Error Message</div>
                                    <input type="text" .value="${this._inputError}" @input="${e => this._inputError = e.target.value}" placeholder="Leave empty for valid state" style="width: 100%; padding: 4px; border-color: ${this._inputError ? '#dc3545' : '#ccc'};">
                                </label>

                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" ?checked="${this._inputRequired}" @change="${e => this._inputRequired = e.target.checked}">
                                    <strong>Required</strong>
                                </label>

                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" ?checked="${this._inputDisabled}" @change="${e => this._inputDisabled = e.target.checked}">
                                    <strong>Disabled</strong>
                                </label>
                            </div>
                        </div>
                    </component-doc>

                    <!-- Other Static Examples (Textarea, Select, etc.) -->
                    <component-doc 
                        title="<app-textarea>" 
                        description="Multi-line text input."
                        .code="${textareaCode}">
                        <app-textarea label="Comments" placeholder="Enter your comments here..." rows="3"></app-textarea>
                    </component-doc>

                    <component-doc 
                        title="<app-select>" 
                        description="Dropdown menu with optgroup support."
                        .code="${selectCode}">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <app-select label="Simple Select" .options="${[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' }
            ]}"></app-select>
                            
                            <app-select label="Grouped Select" .options="${[
                {
                    group: true, label: 'Fruits', options: [
                        { label: 'Apple', value: 'apple' },
                        { label: 'Banana', value: 'banana' }
                    ]
                },
                {
                    group: true, label: 'Vegetables', options: [
                        { label: 'Carrot', value: 'carrot' },
                        { label: 'Potato', value: 'potato' }
                    ]
                }
            ]}"></app-select>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-checkbox> & <powdercloud-radio>" 
                        description="Selection controls."
                        .code="${checkCode}">
                        <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 10px;">
                            <powdercloud-checkbox label="Checkbox 1"></powdercloud-checkbox>
                            <powdercloud-checkbox label="Checkbox 2" checked></powdercloud-checkbox>
                            <powdercloud-checkbox label="Disabled" disabled></powdercloud-checkbox>
                        </div>
                        <div style="display: flex; gap: 20px; align-items: center;">
                            <powdercloud-radio name="demo_radio" label="Radio A" value="a" checked></powdercloud-radio>
                            <powdercloud-radio name="demo_radio" label="Radio B" value="b"></powdercloud-radio>
                            <powdercloud-radio name="demo_radio" label="Disabled" disabled></powdercloud-radio>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<app-switch>" 
                        description="Toggle switch for binary states."
                        .code="${switchCode}">
                        <div style="display: flex; gap: 20px; align-items: center;">
                            <app-switch label="Notifications"></app-switch>
                            <app-switch label="Checked" checked></app-switch>
                            <app-switch label="Disabled" disabled></app-switch>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-chip>" 
                        description="Compact elements for tags and filters."
                        .code="${chipCode}">
                        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                            <powdercloud-chip label="Basic Chip"></powdercloud-chip>
                            <powdercloud-chip label="Primary" variant="primary"></powdercloud-chip>
                            <powdercloud-chip label="Outline" variant="outline"></powdercloud-chip>
                            <powdercloud-chip label="With Icon" icon="fa fa-star"></powdercloud-chip>
                            <powdercloud-chip label="Removable" removable @remove="${(e) => alert('Removed ' + e.detail.label)}"></powdercloud-chip>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-progress>" 
                        description="Loading indicators."
                        .code="${progressCode}">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                            <div>
                                <h4>Linear</h4>
                                <powdercloud-progress label="Indeterminate" type="linear"></powdercloud-progress>
                                <powdercloud-progress label="Determinate (75%)" type="linear" value="75"></powdercloud-progress>
                            </div>
                            <div>
                                <h4>Circular</h4>
                                <div style="display: flex; gap: 20px; align-items: center;">
                                    <powdercloud-progress type="circular"></powdercloud-progress>
                                </div>
                            </div>
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-divider>" 
                        description="Separators for content."
                        .code="${dividerCode}">
                        <div>
                            <p style="margin: 0;">Section A</p>
                            <powdercloud-divider></powdercloud-divider>
                            <p style="margin: 0;">Section B</p>
                            <powdercloud-divider spacing="large"></powdercloud-divider>
                            <div style="display: flex; align-items: center; height: 20px;">
                                <span>Left</span>
                                <powdercloud-divider vertical></powdercloud-divider>
                                <span>Right</span>
                            </div>
                        </div>
                    </component-doc>

                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-atoms-page', DesignSystemAtomsPage);
