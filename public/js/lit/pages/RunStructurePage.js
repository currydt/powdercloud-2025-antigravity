import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../components/PowdercloudLayout.js';

export class RunStructurePage extends LitElement {
    static styles = css`
        :host {
            display: block;
            font-family: 'Inter', sans-serif;
            color: #172b4d;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid #dfe1e6;
            padding-bottom: 0.5rem;
        }
        .card {
            background: white;
            border: 1px solid #dfe1e6;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        pre {
            background: #f4f5f7;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        th {
            text-align: left;
            padding: 0.75rem 1rem;
            background: #f4f5f7;
            border-bottom: 2px solid #dfe1e6;
            font-weight: 600;
            color: #42526e;
        }
        td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #dfe1e6;
            color: #172b4d;
        }
        tr:last-child td {
            border-bottom: none;
        }
        .port-badge {
            display: inline-block;
            background: #e3fcef;
            color: #006644;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-weight: 600;
        }
        .service-badge {
            font-weight: 600;
            color: #0052cc;
        }
    `;

    render() {
        return html`
            <powdercloud-layout>
                <div class="container">
                    <h1>Run Structure & Developer Setup</h1>
                    <p>Overview of the local development environment, ports, and project structure.</p>

                    <h2>Service Ports</h2>
                    <div class="card">
                        <p>When running <code>firebase emulators:start</code>, the following services are available:</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Port</th>
                                    <th>Service</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="port-badge">5001</span></td>
                                    <td><span class="service-badge">Functions</span></td>
                                    <td>Cloud Functions backend (API logic)</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">8080</span></td>
                                    <td><span class="service-badge">Firestore</span></td>
                                    <td>Local Firestore Database Emulator</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">9099</span></td>
                                    <td><span class="service-badge">Auth</span></td>
                                    <td>Firebase Authentication Emulator</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">5013</span></td>
                                    <td><span class="service-badge">Hosting: admin</span></td>
                                    <td>New Admin Dashboard (Vue/Vite)</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">5014</span></td>
                                    <td><span class="service-badge">Hosting: antigravity</span></td>
                                    <td>Shim App Public Assets</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">5015</span></td>
                                    <td><span class="service-badge">Hosting: app</span></td>
                                    <td>Main Management App Shell</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">5016</span></td>
                                    <td><span class="service-badge">Hosting: corporate</span></td>
                                    <td>Static Marketing Site</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">5017</span></td>
                                    <td><span class="service-badge">Hosting: cdn</span></td>
                                    <td>Shared Assets/Images</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">5018</span></td>
                                    <td><span class="service-badge">Hosting: api</span></td>
                                    <td>API Documentation SPA</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2>Standalone Services</h2>
                    <div class="card">
                        <p>These services run independently of the Firebase Emulator suite (via Node.js):</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Port</th>
                                    <th>Service</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="port-badge">3002</span></td>
                                    <td><span class="service-badge">Antigravity Shim</span></td>
                                    <td>Node.js Server (<code>server.js</code>) - Proxies legacy requests</td>
                                </tr>
                                <tr>
                                    <td><span class="port-badge">3000</span></td>
                                    <td><span class="service-badge">Corporate</span></td>
                                    <td>Local server for corporate site (if running separately)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2>Project Ecosystem</h2>
                    <div class="card">
                        <pre>
powdercrowd-project (Monorepo Root)
│
├── powdercloud-2011-antigravity (Shim Application)
│   ├── server.js (Node.js Proxy/Server)
│   └── public/ (Legacy ExtJS & New Lit Admin)
│
├── powdercloud-2011-corporate (Static Marketing Site)
│   └── public/ (HTML/CSS)
│
├── powdercrowd-admin (New Admin Dashboard)
│   └── src/ (Vue/Vite App)
│
├── powdercrowd-api (Backend Services)
│   ├── src/ (Cloud Functions)
│   └── public/ (API Documentation SPA)
│
├── powdercrowd-management (Main Application)
│   └── public/ (App Shell)
│
└── powdercrowd-migrate (Migration Tools)
    └── src/ (TypeScript Migration Scripts)
                        </pre>
                    </div>
                </div>
            </powdercloud-layout>
        `;
    }
}

customElements.define('run-structure-page', RunStructurePage);
