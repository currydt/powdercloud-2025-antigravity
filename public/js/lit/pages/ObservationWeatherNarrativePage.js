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

// Reference: public/observation/weather_narrative.html and public/js/pages/observation/weather_narrative.js

export class ObservationWeatherNarrativePage extends LitElement {
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
            <powdercloud-layout pageTitle="Weather Narrative">
                <powdercloud-container>
                    ${this.view === 'list' ? this._renderList() : this._renderForm()}
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }

    _renderList() {
        const columns = [
            { header: 'Date and Time', field: 'date_time_start', width: '20%' },
            { header: 'Observer', field: 'observer_desc', width: '20%' },
            { header: 'Location', field: 'terrain_desc', width: '20%' },
            { header: 'Notable', field: 'notable', width: '10%' },
            { header: 'Description', field: 'subject', width: '30%' }
        ];

        const mockData = [
            { date_time_start: '2023-12-18 07:00', observer_desc: 'Met Station', terrain_desc: 'Base Camp', notable: 'No', subject: 'Clear sky, low winds' },
            { date_time_start: '2023-12-17 18:00', observer_desc: 'John Doe', terrain_desc: 'Summit', notable: 'Yes', subject: 'High winds, drifting snow' }
        ];

        return html`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Weather Narratives</h2>
                <powdercloud-button @click="${this._handleNew}">+ Add Weather Narrative</powdercloud-button>
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

            <powdercloud-card title="Weather Narrative Entry">
                
                <powdercloud-fieldset legend="Operational Header">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-input label="Operation" value="Antigravity Mock Op" disabled></powdercloud-input>
                        <powdercloud-input label="Data Recorder" value="Current User" disabled></powdercloud-input>
                        <powdercloud-select label="Observer" .options="${['Me', 'Met Station', 'Other']}"></powdercloud-select>
                        <div style="align-self: flex-end; padding-bottom: 10px;">
                            <powdercloud-checkbox label="Notable Observation"></powdercloud-checkbox>
                        </div>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Scope">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-date-selector label="Date and Time"></powdercloud-date-selector>
                        <powdercloud-select label="Location (Region/Zone)" .options="${['Base Area', 'Alpine', 'Treeline']}"></powdercloud-select>
                    </div>
                </powdercloud-fieldset>

                <powdercloud-fieldset legend="Details">
                    <p style="color: #666; font-size: 0.9em; margin-bottom: 15px;">
                        Describe weather variables.
                    </p>
                    <powdercloud-textarea label="Notes / Narrative" rows="6"></powdercloud-textarea>
                </powdercloud-fieldset>

                <div style="margin-top: 30px; display: flex; justify-content: flex-end; gap: 10px;">
                    <powdercloud-button variant="secondary" @click="${this._handleCancel}">Cancel</powdercloud-button>
                    <powdercloud-button variant="primary" @click="${this._handleSave}">Save Narrative</powdercloud-button>
                </div>

            </powdercloud-card>
        `;
    }
}

customElements.define('observation-weather-narrative-page', ObservationWeatherNarrativePage);
