import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PowdercloudLayout.js';
import './components/PowdercloudContainer.js';
import './components/PowdercloudCard.js';
import './components/PowdercloudButton.js';
import './components/PowdercloudGrid.js';
import './components/PowdercloudInput.js';

export class ProjectListPage extends LitElement {
    static properties = {
        projects: { type: Array }
    };

    constructor() {
        super();
        this.projects = this._generateMockProjects();
    }

    createRenderRoot() {
        return this; // Light DOM
    }

    _generateMockProjects() {
        return [
            { name: 'Whistler Blackcomb', region: 'Coast Mountains', status: 'Active', manager: 'John Doe' },
            { name: 'Kicking Horse', region: 'Purcells', status: 'Active', manager: 'Jane Smith' },
            { name: 'Revelstoke', region: 'Selkirks', status: 'Maintenance', manager: 'Bob Brown' }
        ];
    }

    render() {
        const columns = [
            { header: 'Project / Operation', field: 'name', width: '30%', sortable: true },
            { header: 'Region', field: 'region', width: '25%', sortable: true },
            { header: 'Status', field: 'status', width: '20%', sortable: true },
            { header: 'Manager', field: 'manager', width: '25%', sortable: true }
        ];

        return html`
            <powdercloud-layout pageTitle="Projects">
                <powdercloud-container>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <powdercloud-input placeholder="Search projects..." style="width: 300px;"></powdercloud-input>
                        <powdercloud-button>+ New Project</powdercloud-button>
                    </div>

                    <powdercloud-card>
                        <powdercloud-grid 
                            .columns="${columns}" 
                            .data="${this.projects}"
                        ></powdercloud-grid>
                    </powdercloud-card>

                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('project-list-page', ProjectListPage);
