import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../utils/PowdercloudDashboardGrid.js';
import '../containment/PowdercloudModal.js';
import '../forms/PowdercloudNewsForm.js';

export class PowdercloudNewsGrid extends LitElement {
    createRenderRoot() { return this; }

    static properties = {
        _data: { state: true },
        _selectedItem: { state: true },
        _isModalOpen: { state: true }
    };

    constructor() {
        super();
        this._data = [];
        this._selectedItem = null;
        this._isModalOpen = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchData();
    }

    async _fetchData() {
        try {
            // Fetch data for Sorcerer Lodge (566179) in March 2012
            const response = await fetch('https://powdercrowd-api.web.app/api/observations_shim/news?limit=100');
            const result = await response.json();

            if (result.success && result.rows) {
                // Client-side filter
                const filtered = result.rows.filter(row => {
                    // 1. Check Operation (Sorcerer Lodge)
                    let opMatch = false;
                    if (row.operation) {
                        if (typeof row.operation === 'string') opMatch = row.operation.includes('566179');
                        else if (row.operation.id) opMatch = row.operation.id === 566179;
                    }

                    // 2. Check Date (March 2012)
                    let dateMatch = false;
                    if (row.date_time_start) {
                        const d = new Date(row.date_time_start);
                        dateMatch = d.getFullYear() === 2012 && d.getMonth() === 2; // Month is 0-indexed
                    }

                    // 3. Check Type (News)
                    // We check if 'subject' is present and ensure it's not another type
                    let typeMatch = false;
                    if (row.subject && !row.snowpack_narrative && !row.sky_condition_code) {
                        typeMatch = true;
                    }

                    return opMatch && dateMatch && typeMatch;
                });

                // Map to display format
                this._data = filtered.map(row => ({
                    id: row.id,
                    date_time_start: this._formatDate(row.date_time_start),
                    subject: row.subject || '-',
                    author: row.observer_desc || row.created_by_desc || '-',
                    type: row.type_desc || row.type || '-'
                }));
            }
        } catch (e) {
            console.error('Error fetching news data:', e);
        }
    }

    _formatDate(isoString) {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    _handleCreate() {
        this._selectedItem = {
            date_time_start: new Date().toISOString(),
            operation: { id: 566179, name: 'Sorcerer Lodge' }
        };
        this._isModalOpen = true;
    }

    async _handleSaveObservation(e) {
        const data = e.detail;
        const isNew = !data.id;
        const url = isNew
            ? 'https://powdercrowd-api.web.app/api/observations_shim'
            : `https://powdercrowd-api.web.app/api/observations_shim/${data.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                this._closeModal();
                this._fetchData();
            } else {
                alert('Error saving: ' + (result.msg || 'Unknown error'));
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Error saving observation');
        }
    }

    async _handleDeleteObservation(e) {
        const { id } = e.detail;
        if (!id) return;

        try {
            const response = await fetch(`https://powdercrowd-api.web.app/api/observations_shim/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                this._closeModal();
                this._fetchData();
            } else {
                alert('Error deleting: ' + (result.msg || 'Unknown error'));
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting observation');
        }
    }

    async _handleRowClick(e) {
        const rowId = e.detail.id;
        if (!rowId) return;

        try {
            const response = await fetch(`https://powdercrowd-api.web.app/api/observations_shim/${rowId}`);
            const result = await response.json();

            if (result.success && result.data) {
                this._selectedItem = result.data;
                this._isModalOpen = true;
            }
        } catch (err) {
            console.error('Error fetching details:', err);
            alert('Failed to load observation details.');
        }
    }

    _closeModal() {
        this._isModalOpen = false;
        this._selectedItem = null;
    }

    render() {
        const columns = [
            { header: 'Date', field: 'date_time_start', width: '15%' },
            { header: 'Subject', field: 'subject', width: '40%' },
            { header: 'Author', field: 'author', width: '20%' },
            { header: 'Type', field: 'type', width: '15%' }
        ];

        return html`
            <div style="margin-bottom: 10px; display: flex; justify-content: flex-end;">
                <button @click="${this._handleCreate}" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    + New Observation
                </button>
            </div>

            <powdercloud-dashboard-grid 
                title="News & Info (Sorcerer Lodge - Mar 2012)"
                .columns="${columns}" 
                .data="${this._data}"
                ?paginated="${true}"
                ._rowsPerPage="${10}"
                @row-click="${this._handleRowClick}"
            ></powdercloud-dashboard-grid>

            <powdercloud-modal 
                .open="${this._isModalOpen}" 
                title="News/Info Observation" 
                size="medium"
                @close="${this._closeModal}"
            >
                ${this._selectedItem ? html`
                    <powdercloud-news-form 
                        .data="${this._selectedItem}"
                        .readOnly="${!!this._selectedItem.id}"
                        @close="${this._closeModal}"
                        @save="${this._handleSaveObservation}"
                        @delete="${this._handleDeleteObservation}"
                    ></powdercloud-news-form>
                ` : html`<p>Loading...</p>`}
            </powdercloud-modal>
        `;
    }
}

customElements.define('powdercloud-news-grid', PowdercloudNewsGrid);
