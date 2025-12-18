import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PowdercloudFileUpload extends LitElement {
    static properties = {
        label: { type: String },
        multiple: { type: Boolean },
        accept: { type: String },
        _files: { state: true },
        _isDragging: { state: true }
    };

    constructor() {
        super();
        this.label = 'Drag files here or click to upload';
        this.multiple = false;
        this.accept = '*';
        this._files = [];
        this._isDragging = false;
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _handleDragOver(e) {
        e.preventDefault();
        this._isDragging = true;
    }

    _handleDragLeave(e) {
        e.preventDefault();
        this._isDragging = false;
    }

    _handleDrop(e) {
        e.preventDefault();
        this._isDragging = false;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this._handleFiles(e.dataTransfer.files);
        }
    }

    _handleInputChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            this._handleFiles(e.target.files);
        }
    }

    _handleFiles(fileList) {
        const newFiles = Array.from(fileList);
        if (this.multiple) {
            this._files = [...this._files, ...newFiles];
        } else {
            this._files = [newFiles[0]];
        }
        this.dispatchEvent(new CustomEvent('change', { detail: { files: this._files } }));
    }

    _removeFile(index) {
        this._files = this._files.filter((_, i) => i !== index);
        this.dispatchEvent(new CustomEvent('change', { detail: { files: this._files } }));
    }

    render() {
        return html`
            <style>
                .app-file-upload-zone {
                    border: 2px dashed #ccc;
                    border-radius: 8px;
                    padding: 30px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    background-color: #fafafa;
                    position: relative;
                }

                .app-file-upload-zone:hover,
                .app-file-upload-zone.dragging {
                    border-color: #5399a5;
                    background-color: #eef7f8;
                }

                .app-file-upload-input {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }

                .app-file-upload-icon {
                    font-size: 32px;
                    color: #999;
                    margin-bottom: 10px;
                    display: block;
                }

                .app-file-upload-label {
                    color: #666;
                    font-size: 14px;
                }

                .app-file-list {
                    margin-top: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .app-file-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #fff;
                    border: 1px solid #eee;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 13px;
                }

                .app-file-remove {
                    background: none;
                    border: none;
                    color: #d32f2f;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0 5px;
                }
            </style>

            <div 
                class="app-file-upload-zone ${this._isDragging ? 'dragging' : ''}"
                @dragover="${this._handleDragOver}"
                @dragleave="${this._handleDragLeave}"
                @drop="${this._handleDrop}"
            >
                <input 
                    type="file" 
                    class="app-file-upload-input"
                    ?multiple="${this.multiple}"
                    accept="${this.accept}"
                    @change="${this._handleInputChange}"
                >
                <i class="fa fa-cloud-upload app-file-upload-icon"></i>
                <span class="app-file-upload-label">${this.label}</span>
            </div>

            ${this._files.length > 0 ? html`
                <div class="app-file-list">
                    ${this._files.map((file, index) => html`
                        <div class="app-file-item">
                            <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
                            <button class="app-file-remove" @click="${() => this._removeFile(index)}">&times;</button>
                        </div>
                    `)}
                </div>
            ` : ''}
        `;
    }
}

customElements.define('powdercloud-file-upload', PowdercloudFileUpload);
