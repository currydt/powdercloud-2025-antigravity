import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudLayout.js';
import '../layout/PowdercloudContainer.js';
import '../layout/PowdercloudGrid.js';
import '../containment/PowdercloudCard.js';

export class BasicAnalysisPage extends LitElement {
    static properties = {
        _stats: { state: true }
    };

    createRenderRoot() {
        return this; // Light DOM
    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchStats();
    }

    async _fetchStats() {
        // Fetch summary statistics from Firestore
        try {
            const [obsResponse, terrainResponse] = await Promise.all([
                fetch('/json/entity_query_all/?entity=Observation'),
                fetch('/json/entity_query_all/?entity=Terrain')
            ]);

            const obsData = await obsResponse.json();
            const terrainData = await terrainResponse.json();

            this._stats = {
                totalObservations: obsData.rows ? obsData.rows.length : 0,
                totalTerrain: terrainData.rows ? terrainData.rows.length : 0,
                // Add more stats as needed
            };
        } catch (e) {
            console.error('Error fetching stats:', e);
            this._stats = {
                totalObservations: 0,
                totalTerrain: 0
            };
        }
    }

    render() {
        return html`
            <powdercloud-layout pageTitle="Basic Analysis">
                <powdercloud-container>
                    <p style="margin-bottom: 20px;">Overview of key metrics and statistics for your operation.</p>

                    <powdercloud-grid cols="4" gap="lg" style="margin-bottom: 30px;">
                        <powdercloud-card>
                            <h3 style="margin: 0 0 10px 0; color: #333;">Total Observations</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 0; color: #5399a5;">
                                ${this._stats ? this._stats.totalObservations : '...'}
                            </p>
                        </powdercloud-card>

                        <powdercloud-card>
                            <h3 style="margin: 0 0 10px 0; color: #333;">Total Terrain</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 0; color: #5399a5;">
                                ${this._stats ? this._stats.totalTerrain : '...'}
                            </p>
                        </powdercloud-card>

                        <powdercloud-card>
                            <h3 style="margin: 0 0 10px 0; color: #333;">Active Operations</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 0; color: #5399a5;">
                                N/A
                            </p>
                        </powdercloud-card>

                        <powdercloud-card>
                            <h3 style="margin: 0 0 10px 0; color: #333;">Active Users</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 0; color: #5399a5;">
                                N/A
                            </p>
                        </powdercloud-card>
                    </powdercloud-grid>

                    <h2 style="color: #5399a5; margin-top: 30px;">Recent Activity</h2>
                    <p>Recent observations and data entry activity will be displayed here.</p>
                </powdercloud-container>
            </powdercloud-layout>
        `;
    }
}

customElements.define('basic-analysis-page', BasicAnalysisPage);
