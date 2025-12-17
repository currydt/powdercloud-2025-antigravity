import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AppHeader extends LitElement {
    createRenderRoot() {
        return this; // Use Light DOM to inherit global styles
    }

    render() {
        return html`
      <div id="dvHeader">
            <div id="dvHeadNav">
                <div id="dvHeadLogo">
                    <a href="/"><img alt="Powdercloud" src="/img/logo.png" /></a><br />
                    <p>Your Backcountry Network</p>
                </div>
                <div id="dvHeadNavUpper">
                    <strong>Antigravity User</strong> | <a href="javascript:void(0)" @click="${this._doLogout}">Logout</a>
                    <div style="font-size: 0.8em; margin-top: 4px;">
                        Antigravity Operation
                        <a href="javascript:void(0)" @click="${this._doSwitchOp}">Switch</a>
                    </div>
                </div>
                <div id="dvHeadNavLower">
                    <ul id="ulNav">
                        <li class="liNav1 liNavFirst" id="dvMenu1">
                            <a href="/management/">
                                <strong>Home</strong>
                                <span>&nbsp;</span>
                            </a>
                        </li>
                        <li class="liNav1" id="dvMenu2">
                            <a href="/management/observation">
                                <strong>Observations</strong>
                                <span>Enter Data</span>
                            </a>
                            <!-- Submenu would go here, simplified for now -->
                        </li>
                        <li class="liNav1" id="dvMenu3">
                            <a href="/management/reports">
                                <strong>Analysis</strong>
                                <span>Review Data</span>
                            </a>
                        </li>
                        <li class="liNav1" id="dvMenu4">
                            <a href="/management/incidents">
                                <strong>Projects</strong>
                                <span>Manage Activities</span>
                            </a>
                        </li>
                        <li class="liNav1" id="dvMenu5">
                            <a href="/management/admin">
                                <strong>Profile</strong>
                                <span>Administration</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    }

    _doLogout() {
        if (confirm('Are you sure?')) window.location = "/logout/";
    }

    _doSwitchOp() {
        alert('Switch Operation Mock');
    }
}

customElements.define('app-header', AppHeader);
