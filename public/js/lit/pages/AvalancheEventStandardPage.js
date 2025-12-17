import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../AppContainer.js';
import '../AppCard.js';
import '../AppCombobox.js';

export class AvalancheEventStandardPage extends LitElement {
    static properties = {
        _observers: { state: true },
        _locations: { state: true },
        _aspects: { state: true },
        _triggers: { state: true },
        _bedSurfaces: { state: true },
        _failureTypes: { state: true },
        _destructiveSizes: { state: true },
        _relativeSizes: { state: true },
        _skyConditions: { state: true },
        _precipTypes: { state: true },
        _formData: { state: true }
    };

    constructor() {
        super();
        this._observers = [
            { label: 'John Doe', value: 'user1' },
            { label: 'Jane Smith', value: 'user2' }
        ];
        this._locations = [
            { label: 'Bowl 1', value: 'loc1' },
            { label: 'Chute 3', value: 'loc2' },
            { label: 'Glacier', value: 'loc3' }
        ];
        this._aspects = [
            { label: 'N', value: 'N' },
            { label: 'NE', value: 'NE' },
            { label: 'E', value: 'E' },
            { label: 'SE', value: 'SE' },
            { label: 'S', value: 'S' },
            { label: 'SW', value: 'SW' },
            { label: 'W', value: 'W' },
            { label: 'NW', value: 'NW' }
        ];
        this._triggers = [
            { label: 'Natural', value: 'natural' },
            { label: 'Skier', value: 'skier' },
            { label: 'Explosive', value: 'explosive' }
        ];
        this._bedSurfaces = [
            { label: 'New Snow', value: 'new_snow' },
            { label: 'Old Snow', value: 'old_snow' },
            { label: 'Ground', value: 'ground' }
        ];
        this._failureTypes = [
            { label: 'Slab', value: 'slab' },
            { label: 'Loose', value: 'loose' }
        ];
        this._destructiveSizes = [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' }
        ];
        this._relativeSizes = [
            { label: 'R1', value: 'R1' },
            { label: 'R2', value: 'R2' },
            { label: 'R3', value: 'R3' },
            { label: 'R4', value: 'R4' },
            { label: 'R5', value: 'R5' }
        ];

        this._formData = {
            operation: 'Whistler',
            recorder: 'Current User',
            date: new Date().toISOString().slice(0, 16)
        };
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Avalanche Event (Standard)
                </h1>

                <app-card title="Operational Header" collapsible>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Operation</label>
                            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #ccc;">${this._formData.operation}</div>
                        </div>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Data Recorder</label>
                            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #ccc;">${this._formData.recorder}</div>
                        </div>
                        <app-combobox label="Observer" .items="${this._observers}"></app-combobox>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 25px;">
                            <input type="checkbox" id="notable" />
                            <label for="notable">Notable</label>
                        </div>
                        <div style="grid-column: 1 / -1;">
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Description</label>
                            <input type="text" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                    </div>
                </app-card>

                <br />

                <app-card title="Scope" collapsible>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Date and Time</label>
                            <input type="datetime-local" value="${this._formData.date}" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                        <app-combobox label="Location" .items="${this._locations}"></app-combobox>
                    </div>
                </app-card>

                <br />

                <app-card title="Details" collapsible>
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Occurrence</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Date/Time</label>
                            <input type="datetime-local" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Range</label>
                            <input type="text" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                    </div>

                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Path Characteristics</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <app-combobox label="Aspect" .items="${this._aspects}"></app-combobox>
                        <div style="display: flex; gap: 10px; align-items: flex-end;">
                            <div style="flex: 1;">
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Incline</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div style="padding-bottom: 10px;">
                                <input type="checkbox" id="incline_measured" /> <label for="incline_measured">Measured?</label>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: flex-end;">
                            <div style="flex: 1;">
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Elevation Min</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div style="padding-bottom: 10px;">
                                <input type="checkbox" id="elev_measured" /> <label for="elev_measured">Measured?</label>
                            </div>
                        </div>
                    </div>

                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Trigger and Event Characteristics</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <app-combobox label="Destructive Size (Max)" .items="${this._destructiveSizes}"></app-combobox>
                        <app-combobox label="Relative Size (Max)" .items="${this._relativeSizes}"></app-combobox>
                        <app-combobox label="Trigger" .items="${this._triggers}"></app-combobox>
                        <app-combobox label="Bed Surface" .items="${this._bedSurfaces}"></app-combobox>
                        <app-combobox label="Failure Type" .items="${this._failureTypes}"></app-combobox>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Failure Plane Age</label>
                            <input type="date" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                    </div>
                </app-card>

                <div style="margin-top: 20px; text-align: right;">
                    <button style="background: #5399a5; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 1em;">Save Observation</button>
                </div>
            </app-container>
        `;
    }
}

customElements.define('avalanche-event-standard-page', AvalancheEventStandardPage);
