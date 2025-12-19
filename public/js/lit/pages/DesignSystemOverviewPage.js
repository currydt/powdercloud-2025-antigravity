import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../layout/PowdercloudContainer.js';
import '../containment/PowdercloudCard.js';

export class DesignSystemOverviewPage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <powdercloud-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Design System Overview
                </h1>
                
                <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: white; border: 1px solid #ddd; border-radius: 4px;">
                    
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Application Architecture
                        </h3>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            The <strong>PowderCloud Antigravity</strong> project represents a strategic modernization of a legacy ExtJS platform. 
                            We utilize a <strong>Hybrid Architecture</strong> that allows us to incrementally replace legacy components with modern standards.
                        </p>

                        <div style="background: #f8f9fa; border-left: 4px solid #5399a5; padding: 15px; margin-bottom: 20px;">
                            <h4 style="margin-top: 0; color: #5399a5;">🚀 Key Technical Pillars</h4>
                            <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
                                <li style="margin-bottom: 10px;">
                                    <strong>Modern Frontend (Lit v3):</strong> 
                                    We use lightweight Web Components for the application shell (Header, Footer, Navigation) and new pages. 
                                    This ensures high performance and future-proof code.
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>Legacy Compatibility (The Shim):</strong> 
                                    A specialized adapter layer allows new Lit components to coexist seamlessly with existing ExtJS 3.4 code, 
                                    ensuring no disruption to critical workflows during migration.
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>Cloud-Native Backend:</strong> 
                                    Data is served via a <strong>Node.js / Express</strong> API layer, backed by <strong>Google Cloud Firestore</strong>, 
                                    providing a scalable and flexible NoSQL data structure.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Firebase Architecture & Deployment
                        </h3>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            The application is deployed as part of the <strong>powdercrowd-project</strong> ecosystem using a multi-site architecture. 
                            This ensures that the Antigravity Shim operates independently while sharing the same underlying data and authentication services.
                        </p>

                        <div style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 6px; overflow-x: auto; font-size: 0.95em; line-height: 1.5;">
                            <div style="white-space: pre;">
FIREBASE PROJECT: powdercrowd-project
│
├── <strong>Shared Resources</strong>
│   ├── Cloud Firestore (Database)
│   ├── Firebase Auth (Users)
│   └── Cloud Storage (Files)
│
├── <strong>Hosting Site: powdercrowd-project</strong> (Main)
│   └── Corporate & Marketing Site
│
└── <strong>Hosting Site: powdercrowd-antigravity</strong> (Shim)
    │
    ├── <strong>Cloud Function: antigravity</strong> (Node.js 22)
    │   └── server.js (Express App)
    │       ├── /json/* (API Endpoints)
    │       └── /management/* (Legacy App)
    │
    └── <strong>Static Assets</strong> (public/)
        ├── /admin/ (New Lit Pages)
        └── /js/lit/ (Components)
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Site Design Tree
                        </h3>
                        <div style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 6px; overflow-x: auto; font-size: 0.95em; line-height: 1.5;">
                            <div style="white-space: pre;">
ROOT
|
|-- <strong>HOME</strong>
|   |-- Dashboard ........................ /dashboard_lit.html
|
|-- <strong>OBSERVATIONS</strong>
|   |-- Avalanche Observations
|   |   |-- Avalanche Narrative
|   |   |-- Standard Avalanche Event
|   |   |-- Multiple Avalanche Event
|   |   |-- Avalanche Summary
|   |
|   |-- Weather Observations
|   |   |-- Weather Narrative
|   |   |-- Standard Study Plot
|   |   |-- Field Weather Summary
|   |
|   |-- Layers of Interest
|   |   |-- Layer Narrative
|   |   |-- Layers
|   |
|   |-- Snowpack
|   |   |-- Snowpack Structure
|   |   |-- Concerns
|   |   |-- Snow Profile
|   |
|   |-- Ratings
|   |   |-- Danger Rating
|   |   |-- Stability Rating
|   |
|   |-- Sighting
|   |   |-- Sighting Narrative
|   |   |-- Sighting Event
|   |
|   |-- Other
|       |-- News
|
|-- <strong>ANALYSIS</strong>
|   |-- Community
|   |   |-- Community Summary
|   |   |-- Public Report
|   |
|   |-- Analysis
|   |   |-- Weather Analysis
|   |   |-- Avalanche Activity Analysis
|   |   |-- Snowpack Structure Analysis
|   |   |-- Snow Profile Analysis
|   |   |-- Concerns Analysis
|   |   |-- Sightings Analysis
|   |   |-- Danger Analysis
|   |   |-- Stability Analysis
|   |   |-- News Analysis
|   |
|   |-- Charts
|
|-- <strong>PROJECTS</strong>
|   |-- Projects ......................... /admin/project_list.html
|   |-- Activities
|   |   |-- Hazard Forecast
|   |   |-- Hazard Evaluation
|   |   |-- Run Status / Usage
|   |   |-- Zone Status / Usage
|   |   |-- Generic
|   |
|   |-- Reports
|       |-- InfoEx Report
|       |-- Weather Plots
|       |-- Field Weather
|       |-- Avalanche Activity
|       |-- Snowpack Structure
|       |-- Danger / Stability
|       |-- News
|
|-- <strong>PROFILE</strong>
|   |-- Administration
|   |   |-- Operation Settings
|   |   |-- Operation Users
|   |   |-- Operation Terrains Atlas
|   |   |-- Operation Data Sharing
|   |   |-- My Profile
|   |
|   |-- Site Administration
|   |   |-- Operation List
|   |   |-- App Editor
|   |   |-- Lookup Editor
|   |   |-- Role Editor
|   |   |-- Observation Type Editor
|   |
|   |-- Design System
|       |-- Overview ..................... /admin/design_system/overview.html
|       |-- Architecture ................. /admin/design_system/architecture.html
|       |-- Core Components .............. /admin/design_system/core.html
|       |-- Layout ....................... /admin/design_system/layout.html
|       |-- Containers ................... /admin/design_system/containers.html
|       |-- Forms ........................ /admin/design_system/forms.html
|       |-- Atoms ........................ /admin/design_system/atoms.html
|       |-- Overlays ..................... /admin/design_system/overlays.html
|       |-- Feedback ..................... /admin/design_system/feedback.html
|       |-- Patterns ..................... /admin/design_system/patterns.html
|       |-- Data Viz ..................... /admin/design_system/dataviz.html
|       |-- Validators ................... /admin/design_system/validators.html
|
|-- <strong>LOGIN</strong>
    |-- Hard Reset ....................... javascript:location.reload()
                            </div>
                        </div>
                    </div>
                </div>
            </powdercloud-container>
        `;
    }
}

customElements.define('design-system-overview-page', DesignSystemOverviewPage);
