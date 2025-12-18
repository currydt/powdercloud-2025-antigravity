import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './components/PartyListGrid.js';

export class AdminUsersPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                Operation Users
            </h1>
            <p style="margin-bottom: 20px;">Manage users and their access.</p>
            
            <party-list-grid></party-list-grid>
        `;
    }
}

customElements.define('admin-users-page', AdminUsersPage);
