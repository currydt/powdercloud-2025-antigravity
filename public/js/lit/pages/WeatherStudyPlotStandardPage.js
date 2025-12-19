import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudContainer.js';
import '../components/PowdercloudCard.js';
import '../components/PowdercloudCombobox.js';

export class WeatherStudyPlotStandardPage extends LitElement {
    static properties = {
        _observers: { state: true },
        _locations: { state: true },
        _measurementTypes: { state: true },
        _skyConditions: { state: true },
        _precipTypes: { state: true },
        _tempTrends: { state: true },
        _grainForms: { state: true },
        _windSpeeds: { state: true },
        _windDirections: { state: true },
        _blowingSnowExtents: { state: true },
        _blowingSnowDirections: { state: true },
        _formData: { state: true }
    };

    constructor() {
        super();
        this._observers = [
            { label: 'John Doe', value: 'user1' },
            { label: 'Jane Smith', value: 'user2' }
        ];
        this._locations = [
            { label: 'Study Plot 1', value: 'plot1' },
            { label: 'Study Plot 2', value: 'plot2' }
        ];
        this._measurementTypes = [
            { label: 'Manual', value: 'manual' },
            { label: 'Automated', value: 'automated' }
        ];
        this._skyConditions = [
            { label: 'CLR', value: 'CLR' },
            { label: 'FEW', value: 'FEW' },
            { label: 'SCT', value: 'SCT' },
            { label: 'BKN', value: 'BKN' },
            { label: 'OVC', value: 'OVC' },
            { label: 'X', value: 'X' }
        ];
        this._precipTypes = [
            { label: 'Nil', value: 'Nil' },
            { label: 'Rain', value: 'Rain' },
            { label: 'Snow', value: 'Snow' },
            { label: 'Mixed', value: 'Mixed' }
        ];
        this._tempTrends = [
            { label: 'Rising', value: 'rising' },
            { label: 'Falling', value: 'falling' },
            { label: 'Steady', value: 'steady' }
        ];
        this._grainForms = [
            { label: 'New Snow', value: 'new_snow' },
            { label: 'Decomposing', value: 'decomposing' },
            { label: 'Rounded', value: 'rounded' },
            { label: 'Faceted', value: 'faceted' }
        ];
        this._windSpeeds = [
            { label: 'C', value: 'C' },
            { label: 'L', value: 'L' },
            { label: 'M', value: 'M' },
            { label: 'S', value: 'S' },
            { label: 'G', value: 'G' },
            { label: 'X', value: 'X' }
        ];
        this._windDirections = [
            { label: 'N', value: 'N' },
            { label: 'NE', value: 'NE' },
            { label: 'E', value: 'E' },
            { label: 'SE', value: 'SE' },
            { label: 'S', value: 'S' },
            { label: 'SW', value: 'SW' },
            { label: 'W', value: 'W' },
            { label: 'NW', value: 'NW' }
        ];
        this._blowingSnowExtents = [
            { label: 'None', value: 'none' },
            { label: 'L', value: 'L' },
            { label: 'M', value: 'M' },
            { label: 'H', value: 'H' }
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
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Weather Study Plot (Standard)
                </h1>

                <powdercloud-card title="Operational Header" collapsible>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Operation</label>
                            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #ccc;">${this._formData.operation}</div>
                        </div>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Data Recorder</label>
                            <div style="padding: 8px; background: #f0f0f0; border: 1px solid #ccc;">${this._formData.recorder}</div>
                        </div>
                        <powdercloud-combobox label="Observer" .items="${this._observers}"></powdercloud-combobox>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 25px;">
                            <input type="checkbox" id="notable" />
                            <label for="notable">Notable</label>
                        </div>
                        <div style="grid-column: 1 / -1;">
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Description</label>
                            <input type="text" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                    </div>
                </powdercloud-card>

                <br />

                <powdercloud-card title="Scope" collapsible>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Date and Time</label>
                            <input type="datetime-local" value="${this._formData.date}" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                        <powdercloud-combobox label="Location" .items="${this._locations}"></powdercloud-combobox>
                    </div>
                </powdercloud-card>

                <br />

                <powdercloud-card title="Details" collapsible>
                    <div style="margin-bottom: 20px;">
                        <powdercloud-combobox label="Measurement Type" .items="${this._measurementTypes}"></powdercloud-combobox>
                    </div>

                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Weather Conditions</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <powdercloud-combobox label="Sky Conditions" .items="${this._skyConditions}"></powdercloud-combobox>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 25px;">
                            <input type="checkbox" id="thin_cloud" />
                            <label for="thin_cloud">Thin Cloud</label>
                        </div>
                        
                        <div style="grid-column: 1 / -1; display: flex; gap: 20px; align-items: center; background: #f9f9f9; padding: 10px;">
                            <input type="checkbox" id="valley_fog" /> <label for="valley_fog">Valley Fog</label>
                            <input type="number" placeholder="Min" style="width: 80px;" />
                            <input type="number" placeholder="Max" style="width: 80px;" />
                            <input type="text" placeholder="Comments" style="flex: 1;" />
                        </div>

                        <powdercloud-combobox label="Precipitation Type" .items="${this._precipTypes}"></powdercloud-combobox>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Rate (mm/hr)</label>
                            <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>

                        <div style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Air Temp Min</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Air Temp Max</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Air Temp Present</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                        </div>

                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Thermograph</label>
                            <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                        <powdercloud-combobox label="Trend" .items="${this._tempTrends}"></powdercloud-combobox>
                    </div>

                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Snow Characteristics</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Snow Temp T0</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Snow Temp T10</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Snow Temp T20</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                        </div>

                        <div style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Pen Foot</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Pen Ski</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px;">Pen Ram</label>
                                <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                            </div>
                        </div>

                        <powdercloud-combobox label="Grain Form" .items="${this._grainForms}"></powdercloud-combobox>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Size (mm)</label>
                            <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>

                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">HS (cm)</label>
                            <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                        <div>
                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">HN24 (cm)</label>
                            <input type="number" style="width: 100%; padding: 8px; box-sizing: border-box;" />
                        </div>
                    </div>

                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Wind</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <powdercloud-combobox label="Speed" .items="${this._windSpeeds}"></powdercloud-combobox>
                        <powdercloud-combobox label="Direction" .items="${this._windDirections}"></powdercloud-combobox>
                        <powdercloud-combobox label="Blowing Snow Extent" .items="${this._blowingSnowExtents}"></powdercloud-combobox>
                        <powdercloud-combobox label="Blowing Snow Direction" .items="${this._windDirections}"></powdercloud-combobox>
                    </div>
                </powdercloud-card>

                <div style="margin-top: 20px; text-align: right;">
                    <button style="background: #5399a5; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 1em;">Save Observation</button>
                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('weather-study-plot-standard-page', WeatherStudyPlotStandardPage);
