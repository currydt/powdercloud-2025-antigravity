import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/AppContainer.js';
import './components/ComponentDoc.js';
import './components/AppFieldset.js';
import './components/AppInput.js';
import './components/AppTextarea.js';
import './components/AppSelect.js';
import './components/AppCheckbox.js';
import './components/AppRadio.js';
import './components/PowdercloudButton.js';

export class DesignSystemFormsPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        const sampleFormCode = `
<div style="max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #ccc; font-family: 'Segoe UI', sans-serif;">
    <div style="padding: 10px 15px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-weight: bold; color: #333;">Comprehensive Form Element Tree</div>
    <form style="padding: 20px; display: flex; flex-direction: column; gap: 25px;">

        <!-- 1. The Containers -->
        <app-fieldset legend="fieldset (Grouping)">
            <div style="padding: 10px; color: #666; font-style: italic;">
                Contains related elements. The title above is the &lt;legend&gt;.
            </div>
        </app-fieldset>

        <!-- 2. The Inputs -->
        <app-fieldset legend="input (The Void Element)">
            
            <!-- Text Editing -->
            <div style="margin-bottom: 15px; font-weight: 600; color: #555;">Text Editing</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <app-input label="type='text' (Default)"></app-input>
                <app-input label="type='password'" type="password" value="secret"></app-input>
                <app-input label="type='email'" type="email" value="user@example.com"></app-input>
                <app-input label="type='number'" type="number" value="42"></app-input>
                <app-input label="type='search'" type="search" placeholder="Search..."></app-input>
                <app-input label="type='tel'" type="tel" value="555-0199"></app-input>
                <app-input label="type='url'" type="url" value="https://example.com"></app-input>
            </div>

            <!-- Date & Time -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Date & Time</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <app-input label="type='date'" type="date"></app-input>
                <app-input label="type='datetime-local'" type="datetime-local"></app-input>
                <app-input label="type='month'" type="month"></app-input>
                <app-input label="type='time'" type="time"></app-input>
                <app-input label="type='week'" type="week"></app-input>
            </div>

            <!-- Boolean/Selection -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Boolean / Selection</div>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <app-checkbox label="type='checkbox'"></app-checkbox>
                <app-radio name="tree_g" label="type='radio' 1"></app-radio>
                <app-radio name="tree_g" label="type='radio' 2" checked></app-radio>
            </div>

            <!-- File / Data / Other -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">File / Data / Other</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: end;">
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='file'</label>
                    <input type="file" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='color'</label>
                    <input type="color" style="width: 100%; height: 40px; padding: 0; border: none; cursor: pointer;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='range'</label>
                    <input type="range" style="width: 100%; cursor: pointer; accent-color: #5399a5;">
                </div>
                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='image'</label>
                    <input type="image" src="https://via.placeholder.com/100x30?text=Image+Submit" alt="Image Submit" style="border: 1px solid #ccc; border-radius: 4px;">
                </div>
            </div>

            <!-- Action Inputs -->
            <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Action Inputs</div>
            <div style="display: flex; gap: 10px;">
                <input type="button" value="type='button'" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: #6c757d; color: white;">
                <input type="submit" value="type='submit'" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: #5399a5; color: white;">
                <input type="reset" value="type='reset'" style="padding: 8px 16px; border: 1px solid #5399a5; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: transparent; color: #5399a5;">
            </div>
        </app-fieldset>

        <!-- 3. Other Text Controls -->
        <app-fieldset legend="textarea">
            <app-textarea label="Multi-line text input" rows="3"></app-textarea>
        </app-fieldset>

        <!-- 4. Selection Menus -->
        <app-fieldset legend="select & datalist">
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <app-select label="select (with optgroup)" .options="\${[
                    { label: 'Group 1', options: [{label: 'Option 1.1', value: '1.1'}, {label: 'Option 1.2', value: '1.2'}] },
                    { label: 'Group 2', options: [{label: 'Option 2.1', value: '2.1'}] }
                ]}"></app-select>

                <div>
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">datalist (Suggestions)</label>
                    <input list="tree_flavors" placeholder="Type a flavor..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <datalist id="tree_flavors">
                        <option value="Chocolate">
                        <option value="Vanilla">
                        <option value="Strawberry">
                    </datalist>
                </div>
            </div>
        </app-fieldset>

        <!-- 5. Buttons -->
        <app-fieldset legend="button (Element)">
            <div style="display: flex; gap: 10px;">
                <powdercloud-button label="type='button'"></powdercloud-button>
                <powdercloud-button label="type='submit'" icon="fa fa-paper-plane"></powdercloud-button>
                <powdercloud-button label="type='reset'" variant="outline"></powdercloud-button>
            </div>
        </app-fieldset>

        <!-- 6. Output & Feedback -->
        <app-fieldset legend="Output & Feedback">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; align-items: center;">
                <div>
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">output</label>
                    <output style="font-family: monospace; font-size: 1.2em; background: #eee; padding: 5px;">1024</output>
                </div>
                <div>
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">progress</label>
                    <progress value="70" max="100" style="width: 100%;"></progress>
                </div>
                <div>
                    <label style="display: block; font-weight: bold; margin-bottom: 5px;">meter</label>
                    <meter value="0.6" style="width: 100%;"></meter>
                </div>
            </div>
        </app-fieldset>

    </form>
</div>`;

        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Form Elements
                </h1>
                
                <div style="padding: 20px; background-color: #f4f6f8;">
                    
                    <component-doc 
                        title="Form Element Tree" 
                        description="A vertical showcase of all standard HTML form elements and their variants."
                        .code="${sampleFormCode}">
                        
                        <div style="max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #ccc; font-family: 'Segoe UI', sans-serif;">
                            <div style="padding: 10px 15px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-weight: bold; color: #333;">Comprehensive Form Element Tree</div>
                            <form style="padding: 20px; display: flex; flex-direction: column; gap: 25px;">

                                <!-- 1. The Containers -->
                                <app-fieldset legend="fieldset (Grouping)">
                                    <div style="padding: 10px; color: #666; font-style: italic;">
                                        Contains related elements. The title above is the &lt;legend&gt;.
                                    </div>
                                </app-fieldset>

                                <!-- 2. The Inputs -->
                                <app-fieldset legend="input (The Void Element)">
                                    
                                    <!-- Text Editing -->
                                    <div style="margin-bottom: 15px; font-weight: 600; color: #555;">Text Editing</div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <app-input label="type='text' (Default)"></app-input>
                                        <app-input label="type='password'" type="password" value="secret"></app-input>
                                        <app-input label="type='email'" type="email" value="user@example.com"></app-input>
                                        <app-input label="type='number'" type="number" value="42"></app-input>
                                        <app-input label="type='search'" type="search" placeholder="Search..."></app-input>
                                        <app-input label="type='tel'" type="tel" value="555-0199"></app-input>
                                        <app-input label="type='url'" type="url" value="https://example.com"></app-input>
                                    </div>

                                    <!-- Date & Time -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Date & Time</div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <app-input label="type='date'" type="date"></app-input>
                                        <app-input label="type='datetime-local'" type="datetime-local"></app-input>
                                        <app-input label="type='month'" type="month"></app-input>
                                        <app-input label="type='time'" type="time"></app-input>
                                        <app-input label="type='week'" type="week"></app-input>
                                    </div>

                                    <!-- Boolean/Selection -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Boolean / Selection</div>
                                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                        <app-checkbox label="type='checkbox'"></app-checkbox>
                                        <app-radio name="tree_g" label="type='radio' 1"></app-radio>
                                        <app-radio name="tree_g" label="type='radio' 2" checked></app-radio>
                                    </div>

                                    <!-- File / Data / Other -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">File / Data / Other</div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: end;">
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='file'</label>
                                            <input type="file" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa;">
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='color'</label>
                                            <input type="color" style="width: 100%; height: 40px; padding: 0; border: none; cursor: pointer;">
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='range'</label>
                                            <input type="range" style="width: 100%; cursor: pointer; accent-color: #5399a5;">
                                        </div>
                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">type='image'</label>
                                            <input type="image" src="https://via.placeholder.com/100x30?text=Image+Submit" alt="Image Submit" style="border: 1px solid #ccc; border-radius: 4px;">
                                        </div>
                                    </div>

                                    <!-- Action Inputs -->
                                    <div style="margin: 20px 0 15px 0; font-weight: 600; color: #555;">Action Inputs</div>
                                    <div style="display: flex; gap: 10px;">
                                        <input type="button" value="type='button'" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: #6c757d; color: white;">
                                        <input type="submit" value="type='submit'" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: #5399a5; color: white;">
                                        <input type="reset" value="type='reset'" style="padding: 8px 16px; border: 1px solid #5399a5; border-radius: 4px; cursor: pointer; font-weight: 500; text-transform: uppercase; background-color: transparent; color: #5399a5;">
                                    </div>
                                </app-fieldset>

                                <!-- 3. Other Text Controls -->
                                <app-fieldset legend="textarea">
                                    <app-textarea label="Multi-line text input" rows="3"></app-textarea>
                                </app-fieldset>

                                <!-- 4. Selection Menus -->
                                <app-fieldset legend="select & datalist">
                                    <div style="display: flex; flex-direction: column; gap: 15px;">
                                        <app-select label="select (with optgroup)" .options="${[
                { label: 'Group 1', options: [{ label: 'Option 1.1', value: '1.1' }, { label: 'Option 1.2', value: '1.2' }] },
                { label: 'Group 2', options: [{ label: 'Option 2.1', value: '2.1' }] }
            ]}"></app-select>

                                        <div>
                                            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">datalist (Suggestions)</label>
                                            <input list="tree_flavors" placeholder="Type a flavor..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                            <datalist id="tree_flavors">
                                                <option value="Chocolate">
                                                <option value="Vanilla">
                                                <option value="Strawberry">
                                            </datalist>
                                        </div>
                                    </div>
                                </app-fieldset>

                                <!-- 5. Buttons -->
                                <app-fieldset legend="button (Element)">
                                    <div style="display: flex; gap: 10px;">
                                        <powdercloud-button label="type='button'"></powdercloud-button>
                                        <powdercloud-button label="type='submit'" icon="fa fa-paper-plane"></powdercloud-button>
                                        <powdercloud-button label="type='reset'" variant="outline"></powdercloud-button>
                                    </div>
                                </app-fieldset>

                                <!-- 6. Output & Feedback -->
                                <app-fieldset legend="Output & Feedback">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; align-items: center;">
                                        <div>
                                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">output</label>
                                            <output style="font-family: monospace; font-size: 1.2em; background: #eee; padding: 5px;">1024</output>
                                        </div>
                                        <div>
                                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">progress</label>
                                            <progress value="70" max="100" style="width: 100%;"></progress>
                                        </div>
                                        <div>
                                            <label style="display: block; font-weight: bold; margin-bottom: 5px;">meter</label>
                                            <meter value="0.6" style="width: 100%;"></meter>
                                        </div>
                                    </div>
                                </app-fieldset>

                            </form>
                        </div>

                    </component-doc>

                </div>
            </app-container>
        `;
    }
}

customElements.define('design-system-forms-page', DesignSystemFormsPage);
