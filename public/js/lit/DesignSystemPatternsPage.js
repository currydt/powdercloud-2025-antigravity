import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/ComponentDoc.js';
import './components/FilterPanel.js';
import './components/DashboardGrid.js';

export class DesignSystemPatternsPage extends LitElement {
    static properties = {
        _gridIsMock: { state: true },
        _gridSortable: { state: true },
        _gridHoverable: { state: true },
        _gridSelectionMode: { state: true },
        _gridPaginated: { state: true },
        _gridDataSource: { state: true }
    };

    constructor() {
        super();
        this._gridIsMock = true;
        this._gridSortable = true;
        this._gridHoverable = true;
        this._gridSelectionMode = 'multi';
        this._gridPaginated = true;
        this._gridDataSource = 'operations';
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
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

        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Data Patterns
                </h1>
                
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
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-patterns-page', DesignSystemPatternsPage);
