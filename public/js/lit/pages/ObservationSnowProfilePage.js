import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudLayout.js';
import '../components/PowdercloudContainer.js';
import '../components/PowdercloudCard.js';
import '../components/PowdercloudButton.js';
import '../components/PowdercloudGrid.js';
import '../components/PowdercloudFieldset.js';
import '../components/PowdercloudInput.js';
import '../components/PowdercloudSelect.js';
import '../components/PowdercloudTextarea.js';
import '../components/PowdercloudCheckbox.js';
import '../components/PowdercloudDateSelector.js';
import '../components/PowdercloudSnowProfileChart.js';
export class ObservationSnowProfilePage extends LitElement {
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
            <powdercloud-layout pageTitle="Snow Profile">
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
            { header: 'Profile Type', field: 'type', width: '15%' },
            { header: 'Sky', field: 'sky', width: '15%' },
            { header: 'Wind', field: 'wind', width: '15%' }
        ];

        const mockData = [
            { date: '2023-12-18 10:00', location: 'Whistler Peak', observer: 'Patrol', type: 'Full', sky: 'OVC', wind: 'Light SW' },
            { date: '2023-12-17 09:30', location: 'Harmony Ridge', observer: 'Guide', type: 'Test Profile', sky: 'BKN', wind: 'Mod N' }
        ];

        return html`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Snow Profiles</h2>
                <powdercloud-button @click="${this._handleNew}">+ New Profile</powdercloud-button>
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

            <powdercloud-card title="Snow Profile Entry">
                
                <powdercloud-fieldset legend="Operational Header">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Operation" value="Antigravity Operation" disabled></powdercloud-input>
                        <powdercloud-input label="Data Recorder" value="Current User" disabled></powdercloud-input>
                        <powdercloud-select label="Observer 1" .options="${['Me', 'Patrol', 'Public']}"></powdercloud-select>
                        <powdercloud-select label="Observer 2" .options="${['None', 'Partner']}"></powdercloud-select>
                        <powdercloud-date-selector label="Date and Time"></powdercloud-date-selector>
                        <powdercloud-checkbox label="Notable Profile"></powdercloud-checkbox>
                        <div style="grid-column: span 2;">
                            <powdercloud-input label="Subject" placeholder="Brief subject description..."></powdercloud-input>
                        </div>
                        <div style="grid-column: span 2;">
                            <powdercloud-textarea label="Notes" rows="2"></powdercloud-textarea>
                        </div>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Profile Details">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <powdercloud-select label="Profile Type" .options="${['Full', 'Test Profile', 'Quick']}"></powdercloud-select>
                        <powdercloud-select label="Aspect" .options="${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']}"></powdercloud-select>
                        <powdercloud-input label="Incline (deg)" type="number"></powdercloud-input>
                        <powdercloud-input label="Elevation (m)" type="number"></powdercloud-input>
                        
                        <powdercloud-select label="Sky Conditions" .options="${['CLR', 'FEW', 'SCT', 'BKN', 'OVC', 'X']}"></powdercloud-select>
                        <powdercloud-select label="Precip Type" .options="${['None', 'Snow', 'Rain', 'Graupel']}"></powdercloud-select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <powdercloud-select label="Wind Speed" .options="${['C', 'L', 'M', 'S', 'X']}"></powdercloud-select>
                        <powdercloud-select label="Wind Direction" .options="${['N', 'S', 'E', 'W']}"></powdercloud-select>
                        <div><!-- spacer --></div>
                        
                        <powdercloud-input label="Air Temp (C)" type="number"></powdercloud-input>
                        <powdercloud-input label="Snow Surface Temp (C)" type="number"></powdercloud-input>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <powdercloud-input label="Foot Pen (cm)" type="number"></powdercloud-input>
                        <powdercloud-input label="Ski Pen (cm)" type="number"></powdercloud-input>
                    </div>
                </powdercloud-fieldset>

                 <powdercloud-fieldset legend="Snow Surface">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <powdercloud-select label="Surface Form" .options="${['DF', 'SH', 'FC', 'RG', 'PP']}"></powdercloud-select>
                        <powdercloud-input label="Grain Size (mm)" type="number"></powdercloud-input>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Snow Profile Graph">
                   <div style="display: flex; justify-content: center; background: #fff; padding: 20px; border: 1px solid #eee; overflow-x: auto;">
                        <powdercloud-snow-profile-chart 
                            width="600" 
                            height="600"
                            layout="basic"
                            .showMockData="${true}"
                        ></powdercloud-snow-profile-chart>
                   </div>
                </powdercloud-fieldset>

                <div style="margin-top: 30px; display: flex; justify-content: flex-end; gap: 10px;">
                    <powdercloud-button variant="secondary" @click="${this._handleCancel}">Cancel</powdercloud-button>
                    <powdercloud-button variant="primary" @click="${this._handleSave}">Save Profile</powdercloud-button>
                </div>

            </powdercloud-card>
        `;
    }
}

customElements.define('observation-snow-profile-page', ObservationSnowProfilePage);
