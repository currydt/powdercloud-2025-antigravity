import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudLayout.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudButton.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudFieldset.js';
import './components/PowdercloudInput.js';
import './components/PowdercloudSelect.js';
import './components/PowdercloudTextarea.js';
import './components/PowdercloudCheckbox.js';
import './components/PowdercloudDateSelector.js';

// Reference: public/observation/avalanche_narrative.html and public/js/pages/observation/avalanche_narrative.js

export class ObservationAvalancheNarrativePage extends LitElement {
    static properties = {
        view: { type: String }, // 'list' or 'form'
        selectedItem: { type: Object }
    };

    constructor() {
        super();
        this.view = 'list';
        this.selectedItem = null;
    }

    createRenderRoot() {
        return this; // Light DOM for page layout
    }

    _handleNew() {
        this.selectedItem = {}; // Empty object for new
        this.view = 'form';
    }

    _handleEdit(e) {
        this.selectedItem = e.detail; // Grid should emit row data
        this.view = 'form';
    }

    _handleCancel() {
        this.view = 'list';
        this.selectedItem = null;
    }

    _handleSave() {
        // Placeholder for API logic
        alert('Save logic will be implemented here via -api class.');
        this.view = 'list';
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Avalanche Narrative">
                <powdercloud-container>
                    
                    ${this.view === 'list' ? this._renderList() : this._renderForm()}

                </powdercloud-container>
            </powdercloud-layout>
        `;
    }

    _renderList() {
        // Columns matching the legacy ExtJS grid
        const columns = [
            { header: 'Date and Time', field: 'date_time_start', width: '20%' },
            { header: 'Observer', field: 'observer_desc', width: '20%' },
            { header: 'Location', field: 'terrain_desc', width: '20%' },
            { header: 'Notable', field: 'notable', width: '10%' },
            { header: 'Description', field: 'subject', width: '30%' }
        ];

        // Mock data for UI visualization
        const mockData = [
            { date_time_start: '2023-12-18 08:00', observer_desc: 'John Doe', terrain_desc: 'North Bowl', notable: 'Yes', subject: 'Natural release observed' },
            { date_time_start: '2023-12-17 14:30', observer_desc: 'Jane Smith', terrain_desc: 'West Ridge', notable: 'No', subject: 'Ski cut result' }
        ];

        return html`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Avalanche Narratives</h2>
                <powdercloud-button @click="${this._handleNew}">+ Add Narrative</powdercloud-button>
            </div>
            
            <powdercloud-card>
                <powdercloud-grid 
                    .columns="${columns}" 
                    .data="${mockData}"
                    @row-click="${this._handleEdit}"
                ></powdercloud-grid>
            </powdercloud-card>
        `;
    }

    _renderForm() {
        return html`
            <div style="margin-bottom: 20px;">
                <powdercloud-button variant="secondary" @click="${this._handleCancel}">Back to List</powdercloud-button>
            </div>

            <powdercloud-card title="Avalanche Narrative Entry">
                
                <!-- 1. Operational Header -->
                <powdercloud-fieldset legend="Operational Header">
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 15px;">
                        Record details related to your operation.
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Operation" value="Antigravity Mock Op" disabled></powdercloud-input>
                        <powdercloud-input label="Data Recorder" value="Current User" disabled></powdercloud-input>
                        
                        <powdercloud-select label="Observer" .options="${['Me', 'You', 'Someone Else']}"></powdercloud-select>
                        <div style="align-self: flex-end; padding-bottom: 10px;">
                            <powdercloud-checkbox label="Notable Observation"></powdercloud-checkbox>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <powdercloud-input label="Description / Subject" placeholder="Brief summary..."></powdercloud-input>
                    </div>
                </powdercloud-fieldset>

                <!-- 2. Scope -->
                <powdercloud-fieldset legend="Scope">
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 15px;">
                        Specify date, time, and key location.
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-date-selector label="Date and Time"></powdercloud-date-selector>
                        <powdercloud-select label="Location (Region/Zone)" .options="${['North Zone', 'South Zone', 'Bowl 1']}"></powdercloud-select>
                    </div>
                </powdercloud-fieldset>

                <!-- 3. Details -->
                <powdercloud-fieldset legend="Details">
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 15px;">
                        Narrative description of the activity.
                    </p>
                    <powdercloud-textarea label="Notes / Narrative" rows="6"></powdercloud-textarea>
                </powdercloud-fieldset>

                <!-- Footer Actions -->
                <div style="margin-top: 30px; display: flex; justify-content: flex-end; gap: 10px;">
                    <powdercloud-button variant="secondary" @click="${this._handleCancel}">Cancel</powdercloud-button>
                    <powdercloud-button variant="primary" @click="${this._handleSave}">Save Narrative</powdercloud-button>
                </div>

            </powdercloud-card>
        `;
    }
}

customElements.define('observation-avalanche-narrative-page', ObservationAvalancheNarrativePage);
