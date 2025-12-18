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

// Reference: public/observation/avalanche_event_standard.html and public/js/pages/observation/avalanche_event_standard.js

export class ObservationAvalancheStandardPage extends LitElement {
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
        return this; // Light DOM
    }

    _handleNew() {
        this.selectedItem = {};
        this.view = 'form';
    }

    _handleEdit(e) {
        this.selectedItem = e.detail;
        this.view = 'form';
    }

    _handleCancel() {
        this.view = 'list';
        this.selectedItem = null;
    }

    _handleSave() {
        alert('Save logic will be implemented here via -api class.');
        this.view = 'list';
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Standard Avalanche Event">
                <powdercloud-container>
                    ${this.view === 'list' ? this._renderList() : this._renderForm()}
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }

    _renderList() {
        const columns = [
            { header: 'Date and Time', field: 'date_time_start', width: '15%' },
            { header: 'Observer', field: 'observer_desc', width: '15%' },
            { header: 'Location', field: 'terrain_desc', width: '20%' },
            { header: 'Size', field: 'size', width: '10%' },
            { header: 'Trigger', field: 'trigger', width: '10%' },
            { header: 'Description', field: 'subject', width: '30%' }
        ];

        const mockData = [
            { date_time_start: '2023-12-18 08:30', observer_desc: 'Patrol', terrain_desc: 'West Bowl', size: '2', trigger: 'Na', subject: 'Natural release after storm' },
            { date_time_start: '2023-12-17 14:00', observer_desc: 'Guide', terrain_desc: 'North Face', size: '1', trigger: 'Sc', subject: 'Skier accidental' }
        ];

        return html`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Avalanche Events</h2>
                <powdercloud-button @click="${this._handleNew}">+ Add Event</powdercloud-button>
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

            <powdercloud-card title="Avalanche Event Entry">
                
                <powdercloud-fieldset legend="Operational Header">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Operation" value="Antigravity Operation" disabled></powdercloud-input>
                        <powdercloud-input label="Data Recorder" value="Current User" disabled></powdercloud-input>
                        <powdercloud-select label="Observer" .options="${['Me', 'Patrol', 'Public']}"></powdercloud-select>
                        <div style="align-self: flex-end; padding-bottom: 10px;">
                            <powdercloud-checkbox label="Notable Observation"></powdercloud-checkbox>
                        </div>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Scope">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-date-selector label="Date and Time"></powdercloud-date-selector>
                        <powdercloud-select label="Location" .options="${['Bowl 1', 'Ridge 2', 'Glacier']}"></powdercloud-select>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Path Characteristics">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <powdercloud-select label="Aspect" .options="${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']}"></powdercloud-select>
                        <powdercloud-input label="Incline (deg)" type="number"></powdercloud-input>
                        <powdercloud-input label="Elevation (m)" type="number"></powdercloud-input>
                    </div>
                </powdercloud-fieldset>

                 <powdercloud-fieldset legend="Trigger & Event Characteristics">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-select label="Destructive Size" .options="${['1', '2', '3', '4', '5']}"></powdercloud-select>
                        <powdercloud-select label="Relative Size" .options="${['R1', 'R2', 'R3', 'R4', 'R5']}"></powdercloud-select>
                        <powdercloud-select label="Trigger" .options="${['Natural', 'Skier', 'Explosive', 'Remote']}"></powdercloud-select>
                         <powdercloud-select label="Bed Surface" .options="${['New Snow', 'Old Snow', 'Ground']}"></powdercloud-select>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Slab & Runout">
                     <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Slab Thickness (cm)" type="number"></powdercloud-input>
                        <powdercloud-input label="Slab Width (m)" type="number"></powdercloud-input>
                        <powdercloud-input label="Vertical Fall (m)" type="number"></powdercloud-input>
                     </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Comments">
                    <powdercloud-textarea label="Description / Narrative" rows="4"></powdercloud-textarea>
                </powdercloud-fieldset>

                <div style="margin-top: 30px; display: flex; justify-content: flex-end; gap: 10px;">
                    <powdercloud-button variant="secondary" @click="${this._handleCancel}">Cancel</powdercloud-button>
                    <powdercloud-button variant="primary" @click="${this._handleSave}">Save Event</powdercloud-button>
                </div>

            </powdercloud-card>
        `;
    }
}

customElements.define('observation-avalanche-standard-page', ObservationAvalancheStandardPage);
