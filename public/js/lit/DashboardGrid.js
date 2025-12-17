import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class DashboardGrid extends LitElement {
    static properties = {
        title: { type: String },
        columns: { type: Array },
        data: { type: Array },
        paginated: { type: Boolean },
        selectionMode: { type: String }, // 'none', 'single', 'multi'
        isMock: { type: Boolean },
        hoverable: { type: Boolean },
        sortable: { type: Boolean },
        actions: { type: Array },
        _sortField: { state: true },
        _sortDirection: { state: true },
        _currentPage: { state: true },
        _rowsPerPage: { state: true },
        _selectedRows: { state: true },
        _actionMenuOpen: { state: true },
        _filterText: { state: true }
    };

    constructor() {
        super();
        this.paginated = false;
        this.selectionMode = 'none';
        this.isMock = false;
        this.hoverable = false;
        this.sortable = false;
        this.actions = [];
        this._currentPage = 1;
        this._rowsPerPage = 50;
        this._selectedRows = new Set();
        this._actionMenuOpen = false;
        this._filterText = '';
    }

    createRenderRoot() {
        return this; // Use Light DOM for global styles
    }

    _handleFilter(e) {
        this._filterText = e.target.value.toLowerCase();
        this._currentPage = 1;
        this._selectedRows = new Set();
    }

    // ... (rest of methods)

    get _sortedData() {
        if (!this.data) return [];

        let data = [...this.data];

        // Filter
        if (this._filterText) {
            data = data.filter(row => {
                return Object.values(row).some(val =>
                    String(val).toLowerCase().includes(this._filterText)
                );
            });
        }

        if (!this._sortField) return data;

        return data.sort((a, b) => {
            const aVal = a[this._sortField];
            const bVal = b[this._sortField];

            if (aVal < bVal) return this._sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this._sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    get _paginatedData() {
        const start = (this._currentPage - 1) * this._rowsPerPage;
        const end = start + this._rowsPerPage;
        return this._sortedData.slice(start, end);
    }

    _renderPagination() {
        const totalRows = this.data ? this.data.length : 0;
        const totalPages = Math.ceil(totalRows / this._rowsPerPage);
        const startRow = (this._currentPage - 1) * this._rowsPerPage + 1;
        const endRow = Math.min(this._currentPage * this._rowsPerPage, totalRows);

        return html`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; border-top: 1px solid #f0f0f0; background: #fafafa; color: #666; font-size: 0.9em;">
                <div>
                    Showing ${startRow} to ${endRow} of ${totalRows} entries
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <select @change="${this._handleRowsPerPageChange}" style="padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="10" ?selected="${this._rowsPerPage === 10}">10</option>
                        <option value="25" ?selected="${this._rowsPerPage === 25}">25</option>
                        <option value="50" ?selected="${this._rowsPerPage === 50}">50</option>
                        <option value="100" ?selected="${this._rowsPerPage === 100}">100</option>
                    </select>
                    <div style="display: flex; gap: 5px;">
                        <button 
                            @click="${() => this._currentPage = Math.max(1, this._currentPage - 1)}"
                            ?disabled="${this._currentPage === 1}"
                            style="padding: 4px 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; ${this._currentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
                            Previous
                        </button>
                        <span style="padding: 4px 8px;">Page ${this._currentPage} of ${totalPages}</span>
                        <button 
                            @click="${() => this._currentPage = Math.min(totalPages, this._currentPage + 1)}"
                            ?disabled="${this._currentPage === totalPages}"
                            style="padding: 4px 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; ${this._currentPage === totalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const displayData = this.paginated ? this._paginatedData : this._sortedData;
        const allSelected = displayData && displayData.length > 0 && this._selectedRows.size === displayData.length;
        const isMultiSelect = this.selectionMode === 'multi';
        const isSelectionEnabled = this.selectionMode !== 'none';

        return html`
      <style>
        .tblHover tbody tr:hover {
            background-color: #f8f9fa !important;
            transition: background-color 0.15s ease-in-out;
        }
        /* Ensure selected row keeps its color or blends */
        .tblHover tbody tr[style*="background-color"]:hover {
            background-color: #d1e9fc !important; /* Slightly darker than selection color */
        }
      </style>
      <div class="dashboard-grid-card" style="
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            overflow: hidden;
            margin-bottom: 20px;
            width: 100%;
      ">
        
        <!-- Toolbar -->
        <div style="
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 16px 20px; 
            border-bottom: 1px solid #f0f0f0;
            background: #fff;
        ">
            <div style="display: flex; align-items: center; gap: 12px;">
                ${this.title ? html`<h3 style="margin: 0; color: #2c3e50; font-size: 1.1em; font-weight: 600;">${this.title}</h3>` : ''}
                ${this.isMock ? html`
                    <span style="
                        background: #fff8e1; 
                        color: #f57f17; 
                        padding: 4px 8px; 
                        border-radius: 4px; 
                        font-size: 0.7em; 
                        font-weight: bold; 
                        border: 1px solid #ffecb3;
                        letter-spacing: 0.5px;
                    ">
                        MOCK DATA
                    </span>
                ` : ''}
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
                <input 
                    type="text" 
                    placeholder="Filter..." 
                    @input="${this._handleFilter}"
                    style="padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em;"
                >

                ${this.actions && this.actions.length > 0 ? html`
                    <div style="position: relative;">
                        <button @click="${this._toggleActionMenu}" 
                                style="
                                    background: none; 
                                    border: none; 
                                    cursor: pointer; 
                                    font-size: 1.4em; 
                                    padding: 4px 8px; 
                                    color: #757575; 
                                    border-radius: 50%; 
                                    transition: background 0.2s;
                                    line-height: 1;
                                "
                                onmouseover="this.style.background='#f5f5f5'"
                                onmouseout="this.style.background='none'"
                        >
                            ⋮
                        </button>
                        ${this._actionMenuOpen ? html`
                            <div style="
                                position: absolute; 
                                right: 0; 
                                top: 100%; 
                                background: white; 
                                border: 1px solid #e0e0e0; 
                                border-radius: 4px; 
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                                z-index: 100; 
                                min-width: 180px;
                                overflow: hidden;
                            ">
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    ${this.actions.map(action => {
            const isDisabled = action.requiresSelection && this._selectedRows.size === 0;
            return html`
                                            <li>
                                                <button @click="${() => !isDisabled && this._handleAction(action)}"
                                                        ?disabled="${isDisabled}"
                                                        style="
                                                            display: block; 
                                                            width: 100%; 
                                                            text-align: left; 
                                                            padding: 12px 20px; 
                                                            background: none; 
                                                            border: none; 
                                                            cursor: ${isDisabled ? 'not-allowed' : 'pointer'}; 
                                                            color: ${isDisabled ? '#bdbdbd' : '#424242'};
                                                            font-size: 0.95em;
                                                            border-bottom: 1px solid #f5f5f5;
                                                        "
                                                        onmouseover="if(!this.disabled) this.style.background='#f9f9f9'"
                                                        onmouseout="if(!this.disabled) this.style.background='none'"
                                                >
                                                    ${action.label}
                                                </button>
                                            </li>
                                        `;
        })}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
        
        <!-- Table Container -->
        <div style="max-height: 600px; overflow-y: auto; width: 100%;">
            <table class="tbl ${this.hoverable ? 'tblHover' : ''}" style="width: 100%; border-collapse: collapse;">
                <thead style="position: sticky; top: 0; background: #f9fafb; z-index: 10; box-shadow: 0 1px 0 #e0e0e0;">
                    <tr>
                        ${isMultiSelect ? html`
                            <th style="width: 48px; text-align: center; padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                                <input type="checkbox" 
                                       .checked="${allSelected}" 
                                       @change="${this._handleSelectAll}"
                                       style="cursor: pointer;">
                            </th>
                        ` : ''}
                        ${this.columns.map(col => html`
                            <th class="thSpaced" 
                                style="
                                    ${col.width ? `width: ${col.width};` : ''} 
                                    cursor: ${this.sortable && col.sortable !== false ? 'pointer' : 'default'};
                                    padding: 12px 16px;
                                    text-align: left;
                                    font-weight: 600;
                                    color: #616161;
                                    font-size: 0.9em;
                                    border-bottom: 1px solid #e0e0e0;
                                    user-select: none;
                                "
                                @click="${() => this.sortable && col.sortable !== false && this._handleSort(col.field)}">
                                <div style="display: flex; align-items: center;">
                                    ${col.header}
                                    ${this.sortable && col.sortable !== false ? html`
                                        <span style="font-size: 0.8em; margin-left: 6px; color: ${this._sortField === col.field ? '#5399a5' : '#ccc'};">
                                            ${this._sortField === col.field ? (this._sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                                        </span>
                                    ` : ''}
                                </div>
                            </th>
                        `)}
                    </tr>
                </thead>
                <tbody>
                    ${displayData && displayData.length > 0
                ? displayData.map((row, i) => {
                    const isSelected = this._selectedRows.has(i);
                    const rowClass = i % 2 === 0 ? 'trOdd' : 'trEven';
                    const selectStyle = isSelected ? 'background-color: #e3f2fd !important;' : '';
                    const cursorStyle = isSelectionEnabled ? 'cursor: pointer;' : '';

                    return html`
                            <tr class="${rowClass}" 
                                style="${selectStyle}${cursorStyle} border-bottom: 1px solid #f0f0f0;"
                                @click="${() => this._handleRowClick(row, i)}">
                                ${isMultiSelect ? html`
                                    <td style="text-align: center; padding: 12px 0;">
                                        <input type="checkbox" .checked="${isSelected}" style="pointer-events: none;">
                                    </td>
                                ` : ''}
                                ${this.columns.map(col => html`
                                    <td style="padding: 12px 16px; color: #424242; font-size: 0.95em;">${row[col.field] || ''}</td>
                                `)}
                            </tr>
                        `;
                })
                : html`<tr><td colspan="${this.columns.length + (isMultiSelect ? 1 : 0)}" style="padding: 20px; text-align: center; color: #757575;">No data found</td></tr>`
            }
                </tbody>
            </table>
        </div>
        
        ${this.paginated && this.data && this.data.length > 0 ? this._renderPagination() : ''}
      </div>
    `;
    }
}

customElements.define('dashboard-grid', DashboardGrid);
