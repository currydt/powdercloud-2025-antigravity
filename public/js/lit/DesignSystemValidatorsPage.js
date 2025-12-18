import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudContainer.js';
import './components/ComponentDoc.js';
import './components/PowdercloudInput.js';
import { Validators } from './components/Validators.js';

export class DesignSystemValidatorsPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    _getValidatorDescription(key) {
        const descriptions = {
            required: 'Field must have a value.',
            email: 'Valid email format.',
            phone: 'North American phone format.',
            integer: 'Must be an integer.',
            positiveInteger: 'Must be a positive integer (> 0).',
            positiveIntegerOrZero: 'Must be a positive integer or zero (>= 0).',
            airTemp: 'Number ending in .0 or .5.',
            aspectNum: 'Integer between 0 and 360.',
            avalDepthMetric: 'Positive integer, multiple of 25.',
            avalPathRunMetric: 'Positive integer, multiple of 100 (>300) or 25.',
            avalSurfaceMetric: 'Positive integer, multiple of 10.',
            barometric: 'Positive number, max 2 decimal places.',
            density: 'Positive integer or zero.',
            elevationMetric: 'Integer between 0 and 9000.',
            elevationValleyFogMetric: 'Integer 0-9000, multiple of 50.',
            grainSize: 'Positive number. If > 0.5, end in .0 or .5. If <= 0.5, must be 0.1, 0.3, 0.5.',
            hits: 'Integer between 0 and 30.',
            incline: 'Integer between 0 and 90.',
            layer: 'Positive integer or zero.',
            percent: 'Integer between 0 and 100.',
            precipIntensityMetric: 'Positive number, max 1 decimal.',
            snowFallDepth: 'Positive number. Integer, 0.1, or 0.5.',
            snowProThickness: 'Integer between 0 and 6000.',
            snowTemp: 'Number, max 1 decimal. Decimal must be 1, 2, 3, or 9.',
            stabilityRatio: 'Positive number 0-1000, max 3 decimals.',
            windDirNum: 'Integer 0-360, multiple of 10.',
            windSpeed: 'Positive number 0-1000, max 1 decimal.'
        };
        return descriptions[key] || 'Custom validation rule.';
    }

    _renderValidatorDocs() {
        const validatorList = Object.keys(Validators).sort().map(key => {
            return {
                name: key,
                fn: Validators[key],
                description: this._getValidatorDescription(key)
            };
        });

        return html`
            <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                ${validatorList.map(v => html`
                    <component-doc 
                        title="${v.name}" 
                        description="${v.description}"
                        .code="${`<powdercloud-input label="Test ${v.name}" .validators="\${[Validators.${v.name}]}"></powdercloud-input>`}">
                        <powdercloud-input 
                            label="Test ${v.name}" 
                            .validators="${[v.fn]}"
                            helper="Type to test validation"
                        ></powdercloud-input>
                    </component-doc>
                `)}
            </div>
        `;
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Validators
                </h1>
                
                <div style="padding: 20px;">
                    <p style="margin-bottom: 20px;">
                        Standardized validation functions used across the application forms.
                    </p>
                    ${this._renderValidatorDocs()}
                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-validators-page', DesignSystemValidatorsPage);
