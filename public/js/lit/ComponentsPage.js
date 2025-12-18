import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/CollapsiblePanel.js';

import './components/PowdercloudAlert.js';
import './components/PowdercloudDisclaimer.js';
import './components/ComponentDoc.js';
import './components/Breadcrumbs.js';
import './components/MegaMenu.js';
import './components/AppTabs.js';
import './components/DashboardGrid.js';
import './components/PowdercloudButton.js';
import './components/PowdercloudInput.js';
import './components/AppTextarea.js';
import './components/PowdercloudSelect.js';
import './components/PowdercloudCheckbox.js';
import './components/PowdercloudRadio.js';
import './components/PowdercloudRadio.js';
import './components/PowdercloudFieldset.js';
import './components/AppSwitch.js';
import './components/PowdercloudChip.js';
import './components/PowdercloudProgress.js';
import './components/PowdercloudDivider.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudStack.js';
import './components/PowdercloudSpacer.js';
import './components/PowdercloudModal.js';
import './components/AppToast.js';
import './components/PowdercloudCombobox.js';
import './components/PowdercloudDateRange.js';
import './components/PowdercloudAvatar.js';
import './components/AppTooltip.js';
import './components/PowdercloudFileUpload.js';
import './components/PowdercloudRichText.js';
import './components/FilterPanel.js';
import './components/AvalancheRose.js';
import './components/DashboardChart.js';
import './components/FailureTypesChart.js';
import './components/SeasonalChart.js';
import './components/SkyConditionsChart.js';
import './components/SnowpackHeightChart.js';
import './components/TemperatureRangeChart.js';
import './components/TriggerTypesChart.js';
import './components/WindSpeedChart.js';
import { Validators } from './components/Validators.js';

export class ComponentsPage extends LitElement {
    static properties = {
        _gridIsMock: { state: true },
        _gridSortable: { state: true },
        _gridHoverable: { state: true },
        _gridSelectionMode: { state: true },
        _gridPaginated: { state: true },
        _gridDataSource: { state: true },
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
        this._gridIsMock = true;
        this._gridSortable = true;
        this._gridHoverable = true;
        this._gridSelectionMode = 'multi';
        this._gridPaginated = true;
        this._gridDataSource = 'operations';

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

    _getValidatorDescription(key) {
        const descriptions = {
            required: 'Field must have a value.',
            email: 'Valid email format.',
            phone: 'North American phone format.',
            integer: 'Must be an integer.',
            positiveInteger: 'Must be a positive integer (> 0).',
            positiveIntegerOrZero: 'Must be a positive integer or zero (>= 0).',
            airTemp: 'Number ending in .0 or .5.',
            aspectNum: 'Integer between 0 and 360.',
            avalDepthMetric: 'Positive integer, multiple of 25.',
            avalPathRunMetric: 'Positive integer, multiple of 100 (>300) or 25.',
            avalSurfaceMetric: 'Positive integer, multiple of 10.',
            barometric: 'Positive number, max 2 decimal places.',
            density: 'Positive integer or zero.',
            elevationMetric: 'Integer between 0 and 9000.',
            elevationValleyFogMetric: 'Integer 0-9000, multiple of 50.',
            grainSize: 'Positive number. If > 0.5, end in .0 or .5. If <= 0.5, must be 0.1, 0.3, 0.5.',
            hits: 'Integer between 0 and 30.',
            incline: 'Integer between 0 and 90.',
            layer: 'Positive integer or zero.',
            percent: 'Integer between 0 and 100.',
            precipIntensityMetric: 'Positive number, max 1 decimal.',
            snowFallDepth: 'Positive number. Integer, 0.1, or 0.5.',
            snowProThickness: 'Integer between 0 and 6000.',
            snowTemp: 'Number, max 1 decimal. Decimal must be 1, 2, 3, or 9.',
            stabilityRatio: 'Positive number 0-1000, max 3 decimals.',
            windDirNum: 'Integer 0-360, multiple of 10.',
            windSpeed: 'Positive number 0-1000, max 1 decimal.'
        };
        return descriptions[key] || 'Custom validation rule.';
    }

    _renderValidatorDocs() {
        const validatorList = Object.keys(Validators).sort().map(key => {
            return {
                name: key,
                fn: Validators[key],
                description: this._getValidatorDescription(key)
            };
        });

        return html`
            <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                ${validatorList.map(v => html`
                    <component-doc 
                        title="${v.name}" 
                        description="${v.description}"
                        .code="${`<powdercloud-input label="Test ${v.name}" .validators="\${[Validators.${v.name}]}"></powdercloud-input>`}">
                        <powdercloud-input 
                            label="Test ${v.name}" 
                            .validators="${[v.fn]}"
                            helper="Type to test validation"
                        ></powdercloud-input>
                    </component-doc>
                `)}
            </div>
        `;
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

        const footerCode = `<powdercloud-footer></powdercloud-footer>`;

        const headerCode = `<powdercloud-header></powdercloud-header>`;

        const layoutCode = `<powdercloud-layout>
    <app-breadcrumbs slot="breadcrumbs" ...></app-breadcrumbs>
    <main>
        Page Content...
    </main>
</powdercloud-layout>`;

        const menuCode = `<mega-menu 
    title="Menu Title" 
    subtitle="Subtitle" 
    .menuData="\${[...]}">
</mega-menu>`;

        const tabsCode = `<app-tabs>
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
</app-tabs>`;

        const datasets = {
            operations: {
                title: 'Recent Operations',
                columns: [
                    { header: 'ID', field: 'id', sortable: true },
                    { header: 'Operation Name', field: 'name', sortable: true },
                    { header: 'Region', field: 'region', sortable: true },
                    { header: 'Status', field: 'status' }
                ],
                data: [
                    { id: 'OP-001', name: 'Whistler Blackcomb', region: 'Coast', status: 'Active' },
                    { id: 'OP-002', name: 'Kicking Horse', region: 'Rockies', status: 'Active' },
                    { id: 'OP-003', name: 'Revelstoke', region: 'Columbia', status: 'Maintenance' },
                    { id: 'OP-004', name: 'Fernie', region: 'Rockies', status: 'Active' },
                    { id: 'OP-005', name: 'Big White', region: 'Okanagan', status: 'Closed' },
                    { id: 'OP-006', name: 'Sun Peaks', region: 'Interior', status: 'Active' },
                    { id: 'OP-007', name: 'Silver Star', region: 'Okanagan', status: 'Active' },
                    { id: 'OP-008', name: 'Red Mountain', region: 'Kootenay', status: 'Active' },
                    { id: 'OP-009', name: 'Whitewater', region: 'Kootenay', status: 'Active' },
                    { id: 'OP-010', name: 'Mount Washington', region: 'Island', status: 'Closed' }
                ]
            },
            roles: {
                title: 'System Roles',
                columns: [
                    { header: 'Role Name', field: 'name', sortable: true },
                    { header: 'Description', field: 'description', width: '60%' },
                    { header: 'Users', field: 'userCount', sortable: true }
                ],
                data: [
                    { name: 'Administrator', description: 'Full system access with all privileges.', userCount: 3 },
                    { name: 'Forecaster', description: 'Can create and publish forecasts and evaluations.', userCount: 12 },
                    { name: 'Observer', description: 'Can submit field observations and view reports.', userCount: 45 },
                    { name: 'Guest', description: 'Read-only access to public information.', userCount: 120 }
                ]
            },
            users: {
                title: 'Active Users',
                columns: [
                    { header: 'Username', field: 'username', sortable: true },
                    { header: 'Email', field: 'email', sortable: true },
                    { header: 'Role', field: 'role', sortable: true }
                ],
                data: [
                    { username: 'jdoe', email: 'jdoe@example.com', role: 'Observer' },
                    { username: 'asmith', email: 'asmith@example.com', role: 'Forecaster' },
                    { username: 'bwayne', email: 'bwayne@example.com', role: 'Administrator' },
                    { username: 'ckent', email: 'ckent@example.com', role: 'Guest' },
                    { username: 'pparker', email: 'pparker@example.com', role: 'Observer' }
                ]
            }
        };

        const currentDataset = datasets[this._gridDataSource];

        let gridProps = '';
        if (this._gridIsMock) gridProps += '    isMock\n';
        if (this._gridSortable) gridProps += '    sortable\n';
        if (this._gridHoverable) gridProps += '    hoverable\n';
        if (this._gridSelectionMode !== 'none') gridProps += `    selectionMode="${this._gridSelectionMode}"\n`;
        if (this._gridPaginated) gridProps += '    paginated\n';

        const dataSnippet = this._gridIsMock ? JSON.stringify(currentDataset.data, null, 4) : '[]';
        const columnsSnippet = JSON.stringify(currentDataset.columns, null, 4);

        const filterCode = `<filter-panel 
    .modes="\${[
        { label: 'My Community', value: 'community' },
        { label: 'My Favourites', value: 'favourites' },
        { label: 'My Operation', value: 'operation' }
    ]}"
    selectedMode="operation"
    showDateRange
    @update="\${(e) => console.log(e.detail)}"
></filter-panel>`;

        const gridCode = `<dashboard-grid
    title="${currentDataset.title}"
${gridProps}    .columns="\${${columnsSnippet}}"
    .data="\${${dataSnippet}}"
    .actions="\${[
        { label: 'Add Item', event: 'add' },
        { label: 'Edit Item', event: 'edit', requiresSelection: true },
        { label: 'Delete Item', event: 'delete', requiresSelection: true }
    ]}"
    @action="\${(e) => console.log(e.detail)}"
></dashboard-grid>`;

        const buttonCode = `<powdercloud-button label="Primary"></powdercloud-button>
<powdercloud-button label="Secondary" variant="secondary"></powdercloud-button>
<powdercloud-button label="Outline" variant="outline"></powdercloud-button>
<powdercloud-button label="Text" variant="text"></powdercloud-button>
<powdercloud-button label="Danger" variant="danger"></powdercloud-button>
<powdercloud-button label="Disabled" disabled></powdercloud-button>
<powdercloud-button label="Small" size="small"></powdercloud-button>
<powdercloud-button label="Large" size="large"></powdercloud-button>
<powdercloud-button label="With Icon" icon="fa fa-save"></powdercloud-button>`;

        const inputCode = `<powdercloud-input label="Standard Input"></powdercloud-input>
<powdercloud-input label="Required Input" required></powdercloud-input>
<powdercloud-input label="With Helper Text" helper="Help text"></powdercloud-input>
<powdercloud-input label="Error State" error="Invalid value"></powdercloud-input>
<powdercloud-input label="Disabled" disabled></powdercloud-input>`;

        const textareaCode = `<app-textarea label="Comments" rows="4"></app-textarea>`;

        const selectCode = `<powdercloud-select label="Choose Option" .options="\${[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
]}"></powdercloud-select>`;

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

        const modalCode = `<powdercloud-modal title="Example Modal" open>
    <p>Modal content goes here.</p>
    <div slot="footer">
        <powdercloud-button label="Close" @click="\${() => this.modalOpen = false}"></powdercloud-button>
        <powdercloud-button label="Save" variant="primary"></powdercloud-button>
    </div>
</powdercloud-modal>`;

        const toastCode = `<app-toast message="Operation Saved" variant="success" open></app-toast>`;

        const comboboxCode = `<powdercloud-combobox label="Select User" .options="\${[
    { label: 'Alice', value: 'alice' },
    { label: 'Bob', value: 'bob' }
]}"></powdercloud-combobox>`;

        const dateRangeCode = `<powdercloud-date-range label="Filter by Date"></powdercloud-date-range>`;

        const layoutElementsCode = `<powdercloud-container>
    <powdercloud-grid cols="3" gap="lg">
        <div style="background: #eee; padding: 20px;">Column 1</div>
        <div style="background: #eee; padding: 20px;">Column 2</div>
        <div style="background: #eee; padding: 20px;">Column 3</div>
    </powdercloud-grid>

    <powdercloud-spacer y="4"></powdercloud-spacer>

    <powdercloud-stack direction="row" gap="md" align="center">
        <powdercloud-button label="Save"></powdercloud-button>
        <powdercloud-button label="Cancel" variant="secondary"></powdercloud-button>
    </powdercloud-stack>
</powdercloud-container>`;

        const sampleFormCode = `
<div style="max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #ccc; font-family: 'Segoe UI', sans-serif;">
    <div style="padding: 10px 15px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-weight: bold; color: #333;">Comprehensive Form Element Tree</div>
    <form style="padding: 20px; display: flex; flex-direction: column; gap: 25px;">

        <!-- 1. The Containers -->
        <powdercloud-fieldset legend="fieldset (Grouping)">
            <div style="padding: 10px; color: #666; font-style: italic;">
                Contains related elements. The title above is the &lt;legend&gt;.
            </div>
        </powdercloud-fieldset>

        <!-- 2. The Inputs -->
        <powdercloud-fieldset legend="input (The Void Element)">
            
            <!-- Text Editing -->
            <div style="margin-bottom: 15px; font-weight: 600; color: #555;">Text Editing</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <powdercloud-input label="type='text' (Default)"></powdercloud-input>
                <powdercloud-input label="type='password'" type="password" value="secret"></powdercloud-input>
                <powdercloud-input label="type='email'" type="email" value="user@example.com"></powdercloud-input>
                <powdercloud-input label="type='number'" type="number" value="42"></powdercloud-input>
                <powdercloud-input label="type='search'" type="search" placeholder="Search..."></powdercloud-input>
                <powdercloud-input label="type='tel'" type="tel" value="555-0199"></powdercloud-input>
                <powdercloud-input label="type='url'" type="url" value="https://example.com"></powdercloud-input>
            </div>

            <!-- Date & Time -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Date & Time</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <powdercloud-input label="type='date'" type="date"></powdercloud-input>
                <powdercloud-input label="type='datetime-local'" type="datetime-local"></powdercloud-input>
                <powdercloud-input label="type='month'" type="month"></powdercloud-input>
                <powdercloud-input label="type='time'" type="time"></powdercloud-input>
                <powdercloud-input label="type='week'" type="week"></powdercloud-input>
            </div>

            <!-- Boolean/Selection -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Boolean / Selection</div>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <powdercloud-checkbox label="type='checkbox'"></powdercloud-checkbox>
                <powdercloud-radio name="tree_g" label="type='radio' 1"></powdercloud-radio>
                <powdercloud-radio name="tree_g" label="type='radio' 2" checked></powdercloud-radio>
            </div>

            <!-- File / Data / Other -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">File / Data / Other</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: end;">
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='file'</label>
                    <input type="file" style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='color'</label>
                    <input type="color" style="width: 100%; height: 30px;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='range'</label>
                    <input type="range" style="width: 100%;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='image'</label>
                    <input type="image" src="https://via.placeholder.com/100x30?text=Image+Submit" alt="Image Submit">
                </div>
            </div>

            <!-- Action Inputs -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Action Inputs</div>
            <div style="display: flex; gap: 10px;">
                <input type="button" value="type='button'">
                <input type="submit" value="type='submit'">
                <input type="reset" value="type='reset'">
            </div>
        </powdercloud-fieldset>

        <!-- 3. Other Text Controls -->
        <powdercloud-fieldset legend="textarea">
            <app-textarea label="Multi-line text input" rows="3"></app-textarea>
        </powdercloud-fieldset>

        <!-- 4. Selection Menus -->
        <powdercloud-fieldset legend="select & datalist">
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <powdercloud-select label="select (with optgroup)" .options="\${[
                    { label: 'Group 1', options: [{label: 'Option 1.1', value: '1.1'}, {label: 'Option 1.2', value: '1.2'}] },
                    { label: 'Group 2', options: [{label: 'Option 2.1', value: '2.1'}] }
                ]}"></powdercloud-select>

                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">datalist (Suggestions)</label>
                    <input list="tree_flavors" placeholder="Type a flavor..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <datalist id="tree_flavors">
                        <option value="Chocolate">
                        <option value="Vanilla">
                        <option value="Strawberry">
                    </datalist>
                </div>
            </div>
        </powdercloud-fieldset>

        <!-- 5. Buttons -->
        <powdercloud-fieldset legend="button (Element)">
            <div style="display: flex; gap: 10px;">
                <powdercloud-button label="type='button'"></powdercloud-button>
                <powdercloud-button label="type='submit'" icon="fa fa-paper-plane"></powdercloud-button>
                <powdercloud-button label="type='reset'" variant="outline"></powdercloud-button>
            </div>
        </powdercloud-fieldset>

        <!-- 6. Output & Feedback -->
        <powdercloud-fieldset legend="Output & Feedback">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; align-items: center;">
                <div>
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">output</label>
                    <output style="font-family: monospace; font-size: 1.2em; background: #eee; padding: 5px;">1024</output>
                </div>
                <div>
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">progress</label>
                    <progress value="70" max="100" style="width: 100%;"></progress>
                </div>
                <div>
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">meter</label>
                    <meter value="0.6" style="width: 100%;"></meter>
                </div>
            </div>
        </powdercloud-fieldset>

    </form>
</div>`;

        const radioCode = `<powdercloud-radio name="g1" label="Option A" value="a"></powdercloud-radio>
<powdercloud-radio name="g1" label="Option B" value="b"></powdercloud-radio>`;

        const fieldsetCode = `<powdercloud-fieldset legend="User Details">
    <powdercloud-input label="Name"></powdercloud-input>
    <powdercloud-input label="Email"></powdercloud-input>
</powdercloud-fieldset>`;

        return html`
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                Components
            </h1>
            <p style="margin-bottom: 20px;">Development library of available UI components.</p>

            <collapsible-panel title="Overview" tagline="Site Architecture & Design Tree" .open="${false}">
                <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
                    
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Application Architecture
                        </h3>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            The <strong>PowderCloud Antigravity</strong> project represents a strategic modernization of a legacy ExtJS platform. 
                            We utilize a <strong>Hybrid Architecture</strong> that allows us to incrementally replace legacy components with modern standards.
                        </p>

                        <div style="background: #f8f9fa; border-left: 4px solid #5399a5; padding: 15px; margin-bottom: 20px;">
                            <h4 style="margin-top: 0; color: #5399a5;">🚀 Key Technical Pillars</h4>
                            <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
                                <li style="margin-bottom: 10px;">
                                    <strong>Modern Frontend (Lit v3):</strong> 
                                    We use lightweight Web Components for the application shell (Header, Footer, Navigation) and new pages. 
                                    This ensures high performance and future-proof code.
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>Legacy Compatibility (The Shim):</strong> 
                                    A specialized adapter layer allows new Lit components to coexist seamlessly with existing ExtJS 3.4 code, 
                                    ensuring no disruption to critical workflows during migration.
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>Cloud-Native Backend:</strong> 
                                    Data is served via a <strong>Node.js / Express</strong> API layer, backed by <strong>Google Cloud Firestore</strong>, 
                                    providing a scalable and flexible NoSQL data structure.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Firebase Architecture & Deployment
                        </h3>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            The application is deployed as part of the <strong>powdercrowd-project</strong> ecosystem using a multi-site architecture. 
                            This ensures that the Antigravity Shim operates independently while sharing the same underlying data and authentication services.
                        </p>

                        <div style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 6px; overflow-x: auto; font-size: 0.95em; line-height: 1.5;">
                            <div style="white-space: pre;">
FIREBASE PROJECT: powdercrowd-project
│
├── <strong>Shared Resources</strong>
│   ├── Cloud Firestore (Database)
│   ├── Firebase Auth (Users)
│   └── Cloud Storage (Files)
│
├── <strong>Hosting Site: powdercrowd-project</strong> (Main)
│   └── Corporate & Marketing Site
│
└── <strong>Hosting Site: powdercrowd-antigravity</strong> (Shim)
    │
    ├── <strong>Cloud Function: antigravity</strong> (Node.js 22)
    │   └── server.js (Express App)
    │       ├── /json/* (API Endpoints)
    │       └── /management/* (Legacy App)
    │
    └── <strong>Static Assets</strong> (public/)
        ├── /admin/ (New Lit Pages)
        └── /js/lit/ (Components)
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Site Design Tree
                        </h3>
                        <div style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 6px; overflow-x: auto; font-size: 0.95em; line-height: 1.5;">
                            <div style="white-space: pre;">
ROOT
|
|-- <strong>HOME</strong>
|   |-- Dashboard ........................ /dashboard_lit.html
|
|-- <strong>OBSERVATIONS</strong>
|   |-- Avalanche Observations
|   |   |-- Avalanche Narrative
|   |   |-- Standard Avalanche Event
|   |   |-- Multiple Avalanche Event
|   |   |-- Avalanche Summary
|   |
|   |-- Weather Observations
|   |   |-- Weather Narrative
|   |   |-- Standard Study Plot
|   |   |-- Field Weather Summary
|   |
|   |-- Layers of Interest
|   |   |-- Layer Narrative
|   |   |-- Layers
|   |
|   |-- Snowpack
|   |   |-- Snowpack Structure
|   |   |-- Concerns
|   |   |-- Snow Profile
|   |
|   |-- Ratings
|   |   |-- Danger Rating
|   |   |-- Stability Rating
|   |
|   |-- Sighting
|   |   |-- Sighting Narrative
|   |   |-- Sighting Event
|   |
|   |-- Other
|       |-- News
|
|-- <strong>ANALYSIS</strong>
|   |-- Community
|   |   |-- Community Summary
|   |   |-- Public Report
|   |
|   |-- Analysis
|   |   |-- Weather Analysis
|   |   |-- Avalanche Activity Analysis
|   |   |-- Snowpack Structure Analysis
|   |   |-- Snow Profile Analysis
|   |   |-- Concerns Analysis
|   |   |-- Sightings Analysis
|   |   |-- Danger Analysis
|   |   |-- Stability Analysis
|   |   |-- News Analysis
|   |
|   |-- Charts
|
|-- <strong>PROJECTS</strong>
|   |-- Projects ......................... /admin/project_list.html
|   |-- Activities
|   |   |-- Hazard Forecast
|   |   |-- Hazard Evaluation
|   |   |-- Run Status / Usage
|   |   |-- Zone Status / Usage
|   |   |-- Generic
|   |
|   |-- Reports
|       |-- InfoEx Report
|       |-- Weather Plots
|       |-- Field Weather
|       |-- Avalanche Activity
|       |-- Snowpack Structure
|       |-- Danger / Stability
|       |-- News
|
|-- <strong>PROFILE</strong>
|   |-- Administration
|   |   |-- Operation Settings
|   |   |-- Operation Users
|   |   |-- Operation Terrains Atlas
|   |   |-- Operation Data Sharing
|   |   |-- My Profile
|   |
|   |-- Site Administration
|   |   |-- Operation List
|   |   |-- App Editor
|   |   |-- Lookup Editor
|   |   |-- Role Editor
|   |   |-- Observation Type Editor
|   |
|   |-- Development
|       |-- UI Components ................ /admin/development_components.html
|
|-- <strong>LOGIN</strong>
    |-- Hard Reset ....................... javascript:location.reload()
                            </div>
                        </div>
                    </div>
                </div>
            </collapsible-panel>
            
            <br />

            <collapsible-panel title="Framework Architecture" tagline="Component Hierarchy & Structure" .open="${false}">
                <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
                    
                    <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                        A robust, modern web framework architecture is typically organized like a set of nesting dolls, moving from the global "Shell" down to the smallest "Atomic" elements.
                    </p>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            1. The Root (Entry Point)
                        </h3>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>index.html</strong>: The single HTML file served by the server. It contains the <code>&lt;head&gt;</code> and a single <code>&lt;body&gt;</code> with a "Mount Point".</li>
                            <li><strong>Bootstrapper (main.js)</strong>: The script that initializes the framework, sets up the router, and renders the initial application.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            2. The Application Shell (The "Layout")
                        </h3>
                        <p style="margin-bottom: 10px;">The persistent frame that stays visible while the user navigates.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>&lt;app-layout&gt;</strong>: The master container defining the grid/flex structure.</li>
                            <li><strong>Header / Navbar</strong>: Global navigation and user profile.</li>
                            <li><strong>Sidebar / Drawer</strong>: Primary navigation menu.</li>
                            <li><strong>Main Content Area</strong>: The dynamic "slot" where pages are injected.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            3. The Router
                        </h3>
                        <p style="margin-bottom: 10px;">The "Traffic Cop" that watches the URL and decides which Page Component to load.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Route Definition</strong>: Maps a URL path (e.g., <code>/observations</code>) to a component.</li>
                            <li><strong>Guards</strong>: Checks authentication and authorization.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            4. Page Components (The "Views")
                        </h3>
                        <p style="margin-bottom: 10px;">Top-level "Smart" components for a specific screen.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Responsibilities</strong>: Fetching data, managing page state, orchestrating layout.</li>
                            <li><strong>Examples</strong>: <code>&lt;dashboard-page&gt;</code>, <code>&lt;user-profile-page&gt;</code>.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            5. Composition Layers (The "Organisms")
                        </h3>
                        <p style="margin-bottom: 10px;">Complex sections combining multiple smaller components.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Data Grids</strong>: <code>&lt;dashboard-grid&gt;</code> (headers, rows, pagination).</li>
                            <li><strong>Forms</strong>: <code>&lt;user-edit-form&gt;</code> (inputs, validation, submit).</li>
                            <li><strong>Cards</strong>: <code>&lt;news-card&gt;</code> (image, title, actions).</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            6. UI Components (The "Atoms")
                        </h3>
                        <p style="margin-bottom: 10px;">Reusable, "Dumb" building blocks.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Inputs</strong>: <code>&lt;app-input&gt;</code>, <code>&lt;app-select&gt;</code>.</li>
                            <li><strong>Actions</strong>: <code>&lt;app-button&gt;</code>.</li>
                            <li><strong>Structure</strong>: <code>&lt;app-card&gt;</code>, <code>&lt;app-divider&gt;</code>.</li>
                        </ul>
                    </div>

                    <div style="background: #f8f9fa; border-left: 4px solid #5399a5; padding: 15px;">
                        <h4 style="margin-top: 0; color: #5399a5;">Visual Hierarchy Summary</h4>
                        <ol style="padding-left: 20px; line-height: 1.6; font-family: monospace;">
                            <li><strong>index.html</strong> (Browser Window)</li>
                            <li>&nbsp;&nbsp;<strong>&lt;app-root&gt;</strong> (App Instance)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-layout&gt;</strong> (Shell)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-header&gt;</strong></li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-sidebar&gt;</strong></li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;main&gt;</strong> (Dynamic Slot)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;dashboard-page&gt;</strong> (Current View)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;dashboard-grid&gt;</strong> (Organism)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-input&gt;</strong> (Atom)</li>
                        </ol>
                    </div>

                </div>
            </collapsible-panel>

            <br />

            <collapsible-panel title="Page Architecture" tagline="Component Hierarchy & Design Constraints" .open="${false}">
                <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
                    
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Design Overview
                        </h3>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            Each page in the application follows a strict hierarchical component structure. The <strong>Page Shell</strong> is the entry point, 
                            which wraps the entire content in an <code>&lt;app-layout&gt;</code> component. This layout manager handles the global 
                            header, footer, and breadcrumb navigation, ensuring a consistent user experience across the platform.
                        </p>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444;">
                            We utilize <strong>Light DOM</strong> for our Lit components to allow them to inherit global styles from the legacy 
                            <code>main.css</code> and ExtJS stylesheets. This is crucial for maintaining visual consistency with the legacy parts of the application.
                        </p>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Caveats & Limitations
                        </h3>
                        <powdercloud-alert level="warning" title="Critical Design Constraints">
                            <ul style="padding-left: 20px; margin: 0;">
                                <li style="margin-bottom: 5px;">
                                    <strong>Global Style Pollution:</strong> 
                                    Because we use Light DOM, global CSS rules (especially from ExtJS) can inadvertently affect Lit components. 
                                    Always inspect computed styles if a component renders unexpectedly.
                                </li>
                                <li style="margin-bottom: 5px;">
                                    <strong>Z-Index Management:</strong> 
                                    ExtJS windows and menus often use high z-indices (e.g., 9000+). Lit overlays (like the Mega Menu) must be 
                                    carefully managed to appear above legacy content.
                                </li>
                                <li>
                                    <strong>Explicit Widths:</strong> 
                                    Legacy CSS often assumes fixed-width containers. Modern flexible layouts (Flexbox/Grid) may need 
                                    <code>width: 100%</code> explicitly set on containers to prevent "squishing" (as seen in Dashboard Grids).
                                </li>
                            </ul>
                        </powdercloud-alert>
                    </div>

                    <div>
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Component Hierarchy
                        </h3>
                        <div style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 6px; overflow-x: auto; font-size: 0.95em; line-height: 1.5;">
                            <div style="white-space: pre;">
PAGE SHELL (e.g., dashboard_lit.html)
|
|-- <strong>&lt;app-layout&gt;</strong> ........................ Layout Wrapper
|   |
|   |-- <strong>&lt;app-header&gt;</strong> ..................... Global Navigation
|   |   |-- &lt;mega-menu&gt; .................... Dropdown Menus
|   |
|   |-- <strong>&lt;main&gt;</strong> ........................... Content Area
|   |   |
|   |   |-- <strong>&lt;page-component&gt;</strong> ............... (e.g., &lt;dashboard-page&gt;)
|   |       |
|   |       |-- &lt;collapsible-panel&gt; ........ Section Container
|   |       |   |-- &lt;dashboard-grid&gt; ....... Data Grid
|   |       |
|   |       |-- <strong>&lt;app-alert&gt;</strong> ................ Warnings & Notices
|   |       |
|   |       |-- &lt;other-components&gt; ......... Forms, Charts, etc.
|   |
|   |-- <strong>&lt;app-footer&gt;</strong> ..................... Global Footer
                            </div>
                        </div>
                    </div>
                </div>
            </collapsible-panel>

            <br />

            <collapsible-panel title="Core Components" tagline="Usage Examples & Code Snippets" .open="${false}">
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
                        title="<powdercloud-footer>" 
                        description="Global application footer with copyright and links."
                        .code="${footerCode}">
                        <powdercloud-footer></powdercloud-footer>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-header>" 
                        description="Global top navigation bar. (See top of page for live instance)"
                        .code="${headerCode}">
                        <div style="padding: 20px; background: #eee; text-align: center; color: #666; font-style: italic;">
                            Global Header Component (Fixed Position)
                        </div>
                    </component-doc>

                    <component-doc 
                        title="<powdercloud-layout>" 
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
            </collapsible-panel>

            <br />

            <collapsible-panel title="Layout Elements" tagline="Grid, Stack, Container & Spacing" .open="${false}">
                <div style="padding: 20px;">
                    <component-doc 
                        title="Layout System" 
                        description="Core components for structuring page content without custom CSS."
                        .code="${layoutElementsCode}">
                        
                        <div style="border: 1px dashed #ccc; padding: 10px;">
                            <powdercloud-container>
                                <div style="background: #e3f2fd; padding: 10px; margin-bottom: 10px; text-align: center; color: #0d47a1;">
                                    <strong>&lt;app-container&gt;</strong> (Centers content)
                                </div>

                                <powdercloud-grid cols="3" gap="md" cols-md="2" cols-default="1">
                                    <div style="background: #f3e5f5; padding: 20px; text-align: center; color: #4a148c;">Grid Item 1</div>
                                    <div style="background: #f3e5f5; padding: 20px; text-align: center; color: #4a148c;">Grid Item 2</div>
                                    <div style="background: #f3e5f5; padding: 20px; text-align: center; color: #4a148c;">Grid Item 3</div>
                                </powdercloud-grid>

                                <powdercloud-spacer y="2"></powdercloud-spacer>

                                <powdercloud-stack direction="row" gap="md" align="center" style="background: #e8f5e9; padding: 10px;">
                                    <span style="color: #1b5e20;"><strong>&lt;app-stack&gt;</strong> (Flexbox)</span>
                                    <powdercloud-button label="Action 1" size="small"></powdercloud-button>
                                    <powdercloud-button label="Action 2" size="small" variant="secondary"></powdercloud-button>
                                </powdercloud-stack>
                            </powdercloud-container>
                        </div>

                    </component-doc>
                </div>
            </collapsible-panel>

            <br />

            <collapsible-panel title="Containers" tagline="Cards, Panels & Fieldsets" .open="${false}">
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
                        title="<app-tabs>" 
                        description="Material Design style tabs for switching between content views."
                        .code="${tabsCode}">
                        <app-tabs>
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
                        </app-tabs>
                    </component-doc>



            <br />

            <collapsible-panel title="Feedback & Display" tagline="Avatars, Tooltips & More" .open="${false}">
                <div style="padding: 20px;">
                    
                    <component-doc 
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
                    </component-doc>

                    <component-doc 
                        title="<app-tooltip>" 
                        description="Contextual information on hover."
                        .code="${`<app-tooltip content='This is a tooltip'>
    <powdercloud-button label='Hover Me'></powdercloud-button>
</app-tooltip>`}">
                        <div style="display: flex; gap: 40px; padding: 20px;">
                            <app-tooltip content="Top Tooltip" position="top">
                                <powdercloud-button label="Top"></powdercloud-button>
                            </app-tooltip>
                            <app-tooltip content="Right Tooltip" position="right">
                                <powdercloud-button label="Right"></powdercloud-button>
                            </app-tooltip>
                            <app-tooltip content="Bottom Tooltip" position="bottom">
                                <powdercloud-button label="Bottom"></powdercloud-button>
                            </app-tooltip>
                            <app-tooltip content="Left Tooltip" position="left">
                                <powdercloud-button label="Left"></powdercloud-button>
                            </app-tooltip>
                        </div>
                    </component-doc>

                </div>
            </collapsible-panel>

            <br />

            <collapsible-panel title="Data Patterns" tagline="Grids & Lists" .open="${false}">
                <div style="padding: 20px;">

                    <component-doc 
                        title="<filter-panel>" 
                        description="Collapsible filter bar with mode selection and date range."
                        .code="${filterCode}">
                        <filter-panel 
                            .modes="${[
                { label: 'My Community', value: 'community' },
                { label: 'My Favourites', value: 'favourites' },
                { label: 'My Operation', value: 'operation' }
            ]}"
                            selectedMode="operation"
                            showDateRange
                            @update="${(e) => alert('Update: ' + JSON.stringify(e.detail))}"
                        ></filter-panel>
                    </component-doc>

                    <component-doc 
                        title="<dashboard-grid>" 
                        description="Sortable, paginated data table with optional row selection."
                        .code="${gridCode}">
                        
                        <div slot="controls" style="display: flex; flex-direction: column; gap: 15px;">
                            <h4 style="margin: 0; color: #5399a5; font-size: 0.85em; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                                Configuration
                            </h4>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <label style="display: flex; align-items: flex-start; gap: 10px;">
                                    <select @change="${e => this._gridDataSource = e.target.value}" style="margin-top: 2px; padding: 2px; border-radius: 4px; border: 1px solid #ccc;">
                                        <option value="operations" ?selected="${this._gridDataSource === 'operations'}">Operations</option>
                                        <option value="roles" ?selected="${this._gridDataSource === 'roles'}">Roles</option>
                                        <option value="users" ?selected="${this._gridDataSource === 'users'}">Users</option>
                                    </select>
                                    <div>
                                        <div style="font-weight: 600; color: #333; font-size: 0.95em;">Data Source</div>
                                        <div style="font-size: 0.85em; color: #777;">Switch between different datasets.</div>
                                    </div>
                                </label>

                                <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" ?checked="${this._gridIsMock}" @change="${e => this._gridIsMock = e.target.checked}" style="margin-top: 4px;"> 
                                    <div>
                                        <div style="font-weight: 600; color: #333; font-size: 0.95em;">Mock Data</div>
                                        <div style="font-size: 0.85em; color: #777;">Toggles sample data and the 'MOCK DATA' badge.</div>
                                    </div>
                                </label>

                                <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" ?checked="${this._gridSortable}" @change="${e => this._gridSortable = e.target.checked}" style="margin-top: 4px;"> 
                                    <div>
                                        <div style="font-weight: 600; color: #333; font-size: 0.95em;">Sortable Columns</div>
                                        <div style="font-size: 0.85em; color: #777;">Enables click-to-sort on column headers.</div>
                                    </div>
                                </label>

                                <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" ?checked="${this._gridHoverable}" @change="${e => this._gridHoverable = e.target.checked}" style="margin-top: 4px;"> 
                                    <div>
                                        <div style="font-weight: 600; color: #333; font-size: 0.95em;">Row Hover Effect</div>
                                        <div style="font-size: 0.85em; color: #777;">Highlights rows when mouse hovers over them.</div>
                                    </div>
                                </label>

                                <label style="display: flex; align-items: flex-start; gap: 10px;">
                                    <select @change="${e => this._gridSelectionMode = e.target.value}" style="margin-top: 2px; padding: 2px; border-radius: 4px; border: 1px solid #ccc;">
                                        <option value="none" ?selected="${this._gridSelectionMode === 'none'}">None</option>
                                        <option value="single" ?selected="${this._gridSelectionMode === 'single'}">Single</option>
                                        <option value="multi" ?selected="${this._gridSelectionMode === 'multi'}">Multi</option>
                                    </select>
                                    <div>
                                        <div style="font-weight: 600; color: #333; font-size: 0.95em;">Selection Mode</div>
                                        <div style="font-size: 0.85em; color: #777;">Choose between None, Single, or Multi-row selection.</div>
                                    </div>
                                </label>

                                <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" ?checked="${this._gridPaginated}" @change="${e => this._gridPaginated = e.target.checked}" style="margin-top: 4px;"> 
                                    <div>
                                        <div style="font-weight: 600; color: #333; font-size: 0.95em;">Pagination</div>
                                        <div style="font-size: 0.85em; color: #777;">Enables paging controls at the bottom.</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <dashboard-grid
                            title="${currentDataset.title}"
                            ?isMock="${this._gridIsMock}"
                            ?sortable="${this._gridSortable}"
                            ?hoverable="${this._gridHoverable}"
                            selectionMode="${this._gridSelectionMode}"
                            ?paginated="${this._gridPaginated}"
                            .columns="${currentDataset.columns}"
                            .data="${this._gridIsMock ? currentDataset.data : []}"
                            .actions="${[
                { label: 'Add Item', event: 'add' },
                { label: 'Edit Item', event: 'edit', requiresSelection: true },
                { label: 'Delete Item', event: 'delete', requiresSelection: true }
            ]}"
                            @action="${(e) => alert(`Action Triggered: ${e.detail.action}\nRow Count: ${e.detail.rows ? e.detail.rows.length : 0}`)}"
                        ></dashboard-grid>
                    </component-doc>

                </div>
            </collapsible-panel>

            <br />

            <collapsible-panel title="Data Visualization" tagline="Charts & Diagrams" .open="${true}">
                <div style="padding: 20px;">

                    <component-doc 
                        title="<temperature-range-chart>" 
                        description="Temperature Range Chart"
                        .code="${`<temperature-range-chart></temperature-range-chart>`}">
                        <temperature-range-chart></temperature-range-chart>
                    </component-doc>

                    <!--
                    <component-doc 
                        title="<seasonal-chart>" 
                        description="Seasonal Chart"
                        .code="${`<seasonal-chart></seasonal-chart>`}">
                        <seasonal-chart></seasonal-chart>
                    </component-doc>

                    <component-doc 
                        title="<failure-types-chart>" 
                        description="Failure Types Chart"
                        .code="${`<failure-types-chart></failure-types-chart>`}">
                        <failure-types-chart></failure-types-chart>
                    </component-doc>

                    <component-doc 
                        title="<sky-conditions-chart>" 
                        description="Sky Conditions Chart"
                        .code="${`<sky-conditions-chart></sky-conditions-chart>`}">
                        <sky-conditions-chart></sky-conditions-chart>
                    </component-doc>

                    <component-doc 
                        title="<snowpack-height-chart>" 
                        description="Snowpack Height Chart"
                        .code="${`<snowpack-height-chart></snowpack-height-chart>`}">
                        <snowpack-height-chart></snowpack-height-chart>
                    </component-doc>

                    <component-doc 
                        title="<trigger-types-chart>" 
                        description="Trigger Types Chart"
                        .code="${`<trigger-types-chart></trigger-types-chart>`}">
                        <trigger-types-chart></trigger-types-chart>
                    </component-doc>

                    <component-doc 
                        title="<wind-speed-chart>" 
                        description="Wind Speed Chart"
                        .code="${`<wind-speed-chart></wind-speed-chart>`}">
                        <wind-speed-chart></wind-speed-chart>
                    </component-doc>
                    
                    <component-doc 
                        title="<dashboard-chart>" 
                        description="Highcharts wrapper for data visualization."
                        .code="${`<dashboard-chart
    title="Example Chart"
    type="column"
    .series="\${[{ name: 'Data', data: [1, 3, 2, 4] }]}"
    .categories="\${['A', 'B', 'C', 'D']}"
></dashboard-chart>`}">
                        <dashboard-chart
                            title="Example Chart"
                            type="column"
                            .series="${[{ name: 'Data', data: [1, 3, 2, 4] }]}"
                            .categories="${['A', 'B', 'C', 'D']}"
                        ></dashboard-chart>
                    </component-doc>

                    <component-doc 
                        title="<avalanche-rose>" 
                        description="SVG Rose diagram for avalanche observations."
                        .code="${`<avalanche-rose></avalanche-rose>`}">
                        <div style="height: 400px; width: 100%; max-width: 600px;">
                            <avalanche-rose></avalanche-rose>
                        </div>
                    </component-doc>
                    -->

                </div>
            </collapsible-panel>

            <br />

            <collapsible-panel title="Form Component" tagline="Comprehensive Element Tree" .open="${false}">
                <div style="padding: 20px; background-color: #f4f6f8;">
                    
                    <component-doc 
                        title="Form Element Tree" 
                        description="A vertical showcase of all standard HTML form elements and their variants."
                        .code="${sampleFormCode}">
                        
                        <div style="max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #ccc; font-family: 'Segoe UI', sans-serif;">
                            <div style="padding: 10px 15px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-weight: bold; color: #333;">Comprehensive Form Element Tree</div>
                            <form style="padding: 20px; display: flex; flex-direction: column; gap: 25px;">

                                <!-- 1. The Containers -->
                                <powdercloud-fieldset legend="fieldset (Grouping)">
                                    <div style="padding: 10px; color: #666; font-style: italic;">
                                        Contains related elements. The title above is the &lt;legend&gt;.
                                    </div>
                                </powdercloud-fieldset>

                                <!-- 2. The Inputs -->
                                <powdercloud-fieldset legend="input (The Void Element)">
                                    
                                    <!-- Text Editing -->
                                    <div style="margin-bottom: 15px; font-weight: 600; color: #555;">Text Editing</div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <powdercloud-input label="type='text' (Default)"></powdercloud-input>
                                        <powdercloud-input label="type='password'" type="password" value="secret"></powdercloud-input>
                                        <powdercloud-input label="type='email'" type="email" value="user@example.com"></powdercloud-input>
                                        <powdercloud-input label="type='number'" type="number" value="42"></powdercloud-input>
                                        <powdercloud-input label="type='search'" type="search" placeholder="Search..."></powdercloud-input>
                                        <powdercloud-input label="type='tel'" type="tel" value="555-0199"></powdercloud-input>
                                        <powdercloud-input label="type='url'" type="url" value="https://example.com"></powdercloud-input>
                                    </div>

                                    <!-- Date & Time -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Date & Time</div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <powdercloud-input label="type='date'" type="date"></powdercloud-input>
                                        <powdercloud-input label="type='datetime-local'" type="datetime-local"></powdercloud-input>
                                        <powdercloud-input label="type='month'" type="month"></powdercloud-input>
                                        <powdercloud-input label="type='time'" type="time"></powdercloud-input>
                                        <powdercloud-input label="type='week'" type="week"></powdercloud-input>
                                    </div>

                                    <!-- Boolean/Selection -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Boolean / Selection</div>
                                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                        <powdercloud-checkbox label="type='checkbox'"></powdercloud-checkbox>
                                        <powdercloud-radio name="tree_g" label="type='radio' 1"></powdercloud-radio>
                                        <powdercloud-radio name="tree_g" label="type='radio' 2" checked></powdercloud-radio>
                                    </div>

                                    <!-- File / Data / Other -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">File / Data / Other</div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: end;">
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='file'</label>
                                            <input type="file" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa;">
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='color'</label>
                                            <input type="color" style="width: 100%; height: 40px; padding: 0; border: none; cursor: pointer;">
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='range'</label>
                                            <input type="range" style="width: 100%; cursor: pointer; accent-color: #5399a5;">
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='image'</label>
                                            <input type="image" src="https://via.placeholder.com/100x30?text=Image+Submit" alt="Image Submit" style="border: 1px solid #ccc; border-radius: 4px;">
                                        </div>
                                    </div>

                                    <!-- Action Inputs -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Action Inputs</div>
                                    <div style="display: flex; gap: 10px;">
                                        <input type="button" value="type='button'" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: #6c757d; color: white;">
                                        <input type="submit" value="type='submit'" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: #5399a5; color: white;">
                                        <input type="reset" value="type='reset'" style="padding: 8px 16px; border: 1px solid #5399a5; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: transparent; color: #5399a5;">
                                    </div>
                                </powdercloud-fieldset>

                                <!-- 3. Other Text Controls -->
                                <powdercloud-fieldset legend="textarea">
                                    <app-textarea label="Multi-line text input" rows="3"></app-textarea>
                                </powdercloud-fieldset>

                                <!-- 4. Selection Menus -->
                                <powdercloud-fieldset legend="select & datalist">
                                    <div style="display: flex; flex-direction: column; gap: 15px;">
                                        <powdercloud-select label="select (with optgroup)" .options="${[
                { label: 'Group 1', options: [{ label: 'Option 1.1', value: '1.1' }, { label: 'Option 1.2', value: '1.2' }] },
                { label: 'Group 2', options: [{ label: 'Option 2.1', value: '2.1' }] }
            ]}"></powdercloud-select>

                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">datalist (Suggestions)</label>
                                            <input list="tree_flavors" placeholder="Type a flavor..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                            <datalist id="tree_flavors">
                                                <option value="Chocolate">
                                                <option value="Vanilla">
                                                <option value="Strawberry">
                                            </datalist>
                                        </div>
                                    </div>
                                </powdercloud-fieldset>

                                <!-- 5. Buttons -->
                                <powdercloud-fieldset legend="button (Element)">
                                    <div style="display: flex; gap: 10px;">
                                        <powdercloud-button label="type='button'"></powdercloud-button>
                                        <powdercloud-button label="type='submit'" icon="fa fa-paper-plane"></powdercloud-button>
                                        <powdercloud-button label="type='reset'" variant="outline"></powdercloud-button>
                                    </div>
                                </powdercloud-fieldset>

                                <!-- 6. Output & Feedback -->
                                <powdercloud-fieldset legend="Output & Feedback">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; align-items: center;">
                                        <div>
                                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">output</label>
                                            <output style="font-family: monospace; font-size: 1.2em; background: #eee; padding: 5px;">1024</output>
                                        </div>
                                        <div>
                                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">progress</label>
                                            <progress value="70" max="100" style="width: 100%;"></progress>
                                        </div>
                                        <div>
                                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">meter</label>
                                            <meter value="0.6" style="width: 100%;"></meter>
                                        </div>
                                    </div>
                                </powdercloud-fieldset>

                            </form>
                        </div>

                    </component-doc>

                </div>
            </collapsible-panel>

            <br />

            <collapsible-panel title="Atomic Elements" tagline="Inputs, Buttons & Controls" .open="${false}">
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
                        title="<powdercloud-select>" 
                        description="Dropdown menu with optgroup support."
                        .code="${selectCode}">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <powdercloud-select label="Simple Select" .options="${[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' }
            ]}"></powdercloud-select>
                            
                            <powdercloud-select label="Grouped Select" .options="${[
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
            ]}"></powdercloud-select>
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
                        title="<powdercloud-fieldset>" 
                        description="Grouping container for form elements."
                        .code="${fieldsetCode}">
                        <powdercloud-fieldset legend="Personal Information">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <powdercloud-input label="First Name"></powdercloud-input>
                                <powdercloud-input label="Last Name"></powdercloud-input>
                            </div>
                            <app-textarea label="Bio" rows="2"></app-textarea>
                        </powdercloud-fieldset>
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
            </collapsible-panel>

            <br />

            <collapsible-panel title="Overlays & Complex Inputs" tagline="Modals, Toasts & Pickers" .open="${false}">
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
            </collapsible-panel>

            <collapsible-panel title="Validators" tagline="Business Logic & Rules" .open="${false}">
                <div style="padding: 20px;">
                    ${this._renderValidatorDocs()}
                </div>
            </collapsible-panel>

            <br />




        `;
    }
}

customElements.define('components-page', ComponentsPage);
