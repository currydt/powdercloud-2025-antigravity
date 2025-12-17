import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppRichText extends LitElement {
    static properties = {
        label: { type: String },
        value: { type: String },
        placeholder: { type: String },
        rows: { type: Number }
    };

    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.placeholder = '';
        this.rows = 5;
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _execCmd(command, value = null) {
        document.execCommand(command, false, value);
        this._updateValue();
    }

    _updateValue() {
        const editor = this.querySelector('.app-rich-text-editor');
        if (editor) {
            this.value = editor.innerHTML;
            this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value } }));
        }
    }

    firstUpdated() {
        const editor = this.querySelector('.app-rich-text-editor');
        if (editor && this.value) {
            editor.innerHTML = this.value;
        }
    }

    render() {
        return html`
            <style>
                .app-rich-text-container {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    overflow: hidden;
                    background: #fff;
                    font-family: inherit;
                }

                .app-rich-text-toolbar {
                    background: #f5f5f5;
                    border-bottom: 1px solid #ddd;
                    padding: 8px;
                    display: flex;
                    gap: 5px;
                }

                .app-rich-text-btn {
                    background: none;
                    border: 1px solid transparent;
                    border-radius: 3px;
                    cursor: pointer;
                    padding: 4px 8px;
                    font-size: 14px;
                    color: #333;
                }

                .app-rich-text-btn:hover {
                    background: #e0e0e0;
                    border-color: #ccc;
                }

                .app-rich-text-editor {
                    padding: 12px;
                    min-height: ${this.rows * 1.5}em;
                    outline: none;
                    overflow-y: auto;
                }
                
                .app-rich-text-label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 0.875rem;
                    color: #666;
                }
            </style>

            ${this.label ? html`<label class="app-rich-text-label">${this.label}</label>` : ''}
            
            <div class="app-rich-text-container">
                <div class="app-rich-text-toolbar">
                    <button class="app-rich-text-btn" @click="${() => this._execCmd('bold')}" title="Bold"><b>B</b></button>
                    <button class="app-rich-text-btn" @click="${() => this._execCmd('italic')}" title="Italic"><i>I</i></button>
                    <button class="app-rich-text-btn" @click="${() => this._execCmd('underline')}" title="Underline"><u>U</u></button>
                    <span style="border-left: 1px solid #ccc; margin: 0 5px;"></span>
                    <button class="app-rich-text-btn" @click="${() => this._execCmd('insertUnorderedList')}" title="Bullet List">• List</button>
                    <button class="app-rich-text-btn" @click="${() => this._execCmd('insertOrderedList')}" title="Numbered List">1. List</button>
                </div>
                <div 
                    class="app-rich-text-editor" 
                    contenteditable="true" 
                    @input="${this._updateValue}"
                    placeholder="${this.placeholder}"
                ></div>
            </div>
        `;
    }
}

customElements.define('app-rich-text', AppRichText);
