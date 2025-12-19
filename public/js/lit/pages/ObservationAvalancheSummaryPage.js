import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudLayout.js';
import '../layout/PowdercloudContainer.js';
import '../containment/PowdercloudCard.js';
import '../actions/PowdercloudButton.js';
import '../layout/PowdercloudGrid.js';
import '../containment/PowdercloudFieldset.js';
import '../inputs/PowdercloudInput.js';
import '../inputs/PowdercloudSelect.js';
import '../inputs/PowdercloudTextarea.js';
import '../inputs/PowdercloudCheckbox.js';
import '../utils/PowdercloudDateSelector.js';

export class ObservationAvalancheSummaryPage extends LitElement {
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
        alert('Save logic implementation pending API integration.');
        this.view = 'list';
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Avalanche Summary">
                <powdercloud-container>
                    ${this.view === 'list' ? this._renderList() : this._renderForm()}
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }

    _renderList() {
        const columns = [
            { header: 'Date', field: 'date', width: '15%' },
            { header: 'Location', field: 'location', width: '20%' },
            { header: 'Observer', field: 'observer', width: '15%' },
            { header: 'Notable', field: 'notable', width: '10%' },
            { header: 'Subject', field: 'subject', width: '30%' }
        ];

        const mockData = [
            { date: '2023-12-18 08:00', location: 'Alpine Zone', observer: 'Patrol', notable: 'Yes', subject: 'Widespread natural cycle' },
            { date: '2023-12-17 16:00', location: 'Tree Zone', observer: 'Forecaster', notable: 'No', subject: 'Minor sluffing' }
        ];

        return html`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Avalanche Summaries</h2>
                <powdercloud-button @click="${this._handleNew}">+ New Summary</powdercloud-button>
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

            <powdercloud-card title="Avalanche Summary Entry">
                
                <powdercloud-fieldset legend="Operational Header">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Operation" value="Antigravity Operation" disabled></powdercloud-input>
                        <powdercloud-input label="Data Recorder" value="Current User" disabled></powdercloud-input>
                        <powdercloud-select label="Observer" .options="${['Me', 'Patrol', 'Public']}"></powdercloud-select>
                        <powdercloud-checkbox label="Notable Observation"></powdercloud-checkbox>
                        <div style="grid-column: span 2;">
                            <powdercloud-input label="Description / Subject" placeholder="Summary subject..."></powdercloud-input>
                        </div>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Scope">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                         <powdercloud-date-selector label="Date and Time"></powdercloud-date-selector>
                        <powdercloud-select label="Location (Region/Zone)" .options="${['Alpine Zone', 'Treeline Zone', 'Below TL']}"></powdercloud-select>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Details">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Percent Observed" type="number"></powdercloud-input>
                        <powdercloud-select label="Distribution" .options="${['Isolated', 'Specific', 'Widespread']}"></powdercloud-select>
                        <powdercloud-date-selector label="Occurrence Time"></powdercloud-date-selector>

                        <powdercloud-select label="Aspect" .options="${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']}"></powdercloud-select>
                        <powdercloud-input label="Incline" type="number"></powdercloud-input>
                        <powdercloud-input label="Elevation (m)" type="number"></powdercloud-input>
                        
                        <powdercloud-select label="Destructive Size" .options="${['1', '2', '3', '4', '5']}"></powdercloud-select>
                         <powdercloud-select label="Trigger" .options="${['Natural', 'Human', 'Explosive']}"></powdercloud-select>
                         <powdercloud-select label="Failure Type" .options="${['New Snow', 'Old Snow', 'Ground']}"></powdercloud-select>
                    </div>
                </powdercloud-fieldset>
                
                <powdercloud-fieldset legend="Properties">
                   <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Slab Thickness (cm)" type="number"></powdercloud-input>
                        <powdercloud-input label="Slab Width (m)" type="number"></powdercloud-input>
                        <powdercloud-input label="Path Run Length (m)" type="number"></powdercloud-input>
                   </div>
                </powdercloud-fieldset>

                 <powdercloud-fieldset legend="Notes">
                    <powdercloud-textarea label="Internal Comments" rows="3"></powdercloud-textarea>
                </powdercloud-fieldset>

                <div style="margin-top: 30px; display: flex; justify-content: flex-end; gap: 10px;">
                    <powdercloud-button variant="secondary" @click="${this._handleCancel}">Cancel</powdercloud-button>
                    <powdercloud-button variant="primary" @click="${this._handleSave}">Save Summary</powdercloud-button>
                </div>

            </powdercloud-card>
        `;
    }
}

customElements.define('observation-avalanche-summary-page', ObservationAvalancheSummaryPage);
