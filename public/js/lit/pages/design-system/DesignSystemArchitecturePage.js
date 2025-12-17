import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import '../../AppContainer.js';
import '../../AppCard.js';
import '../../AppAlert.js';

export class DesignSystemArchitecturePage extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html`
            <app-container>
                <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 20px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                    Framework Architecture
                </h1>
                
                <div style="padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: white; border: 1px solid #ddd; border-radius: 4px;">
                    
                    <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                        A robust, modern web framework architecture is typically organized like a set of nesting dolls, moving from the global "Shell" down to the smallest "Atomic" elements.
                    </p>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            1. The Root (Entry Point)
                        </h3>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>index.html</strong>: The single HTML file served by the server. It contains the <code>&lt;head&gt;</code> and a single <code>&lt;body&gt;</code> with a "Mount Point".</li>
                            <li><strong>Bootstrapper (main.js)</strong>: The script that initializes the framework, sets up the router, and renders the initial application.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            2. The Application Shell (The "Layout")
                        </h3>
                        <p style="margin-bottom: 10px;">The persistent frame that stays visible while the user navigates.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>&lt;app-layout&gt;</strong>: The master container defining the grid/flex structure.</li>
                            <li><strong>Header / Navbar</strong>: Global navigation and user profile.</li>
                            <li><strong>Sidebar / Drawer</strong>: Primary navigation menu.</li>
                            <li><strong>Main Content Area</strong>: The dynamic "slot" where pages are injected.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            3. The Router
                        </h3>
                        <p style="margin-bottom: 10px;">The "Traffic Cop" that watches the URL and decides which Page Component to load.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Route Definition</strong>: Maps a URL path (e.g., <code>/observations</code>) to a component.</li>
                            <li><strong>Guards</strong>: Checks authentication and authorization.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            4. Page Components (The "Views")
                        </h3>
                        <p style="margin-bottom: 10px;">Top-level "Smart" components for a specific screen.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Responsibilities</strong>: Fetching data, managing page state, orchestrating layout.</li>
                            <li><strong>Examples</strong>: <code>&lt;dashboard-page&gt;</code>, <code>&lt;user-profile-page&gt;</code>.</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            5. Composition Layers (The "Organisms")
                        </h3>
                        <p style="margin-bottom: 10px;">Complex sections combining multiple smaller components.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Data Grids</strong>: <code>&lt;dashboard-grid&gt;</code> (headers, rows, pagination).</li>
                            <li><strong>Forms</strong>: <code>&lt;user-edit-form&gt;</code> (inputs, validation, submit).</li>
                            <li><strong>Cards</strong>: <code>&lt;news-card&gt;</code> (image, title, actions).</li>
                        </ul>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">
                            6. UI Components (The "Atoms")
                        </h3>
                        <p style="margin-bottom: 10px;">Reusable, "Dumb" building blocks.</p>
                        <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.6;">
                            <li><strong>Inputs</strong>: <code>&lt;app-input&gt;</code>, <code>&lt;app-select&gt;</code>.</li>
                            <li><strong>Actions</strong>: <code>&lt;app-button&gt;</code>.</li>
                            <li><strong>Structure</strong>: <code>&lt;app-card&gt;</code>, <code>&lt;app-divider&gt;</code>.</li>
                        </ul>
                    </div>

                    <div style="background: #f8f9fa; border-left: 4px solid #5399a5; padding: 15px; margin-bottom: 30px;">
                        <h4 style="margin-top: 0; color: #5399a5;">Visual Hierarchy Summary</h4>
                        <ol style="padding-left: 20px; line-height: 1.6; font-family: monospace;">
                            <li><strong>index.html</strong> (Browser Window)</li>
                            <li>&nbsp;&nbsp;<strong>&lt;app-root&gt;</strong> (App Instance)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-layout&gt;</strong> (Shell)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-header&gt;</strong></li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-sidebar&gt;</strong></li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;main&gt;</strong> (Dynamic Slot)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;dashboard-page&gt;</strong> (Current View)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;dashboard-grid&gt;</strong> (Organism)</li>
                            <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>&lt;app-input&gt;</strong> (Atom)</li>
                        </ol>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Design Overview
                        </h3>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444; margin-bottom: 20px;">
                            Each page in the application follows a strict hierarchical component structure. The <strong>Page Shell</strong> is the entry point, 
                            which wraps the entire content in an <code>&lt;app-layout&gt;</code> component. This layout manager handles the global 
                            header, footer, and breadcrumb navigation, ensuring a consistent user experience across the platform.
                        </p>
                        <p style="font-size: 1.1em; line-height: 1.6; color: #444;">
                            We utilize <strong>Light DOM</strong> for our Lit components to allow them to inherit global styles from the legacy 
                            <code>main.css</code> and ExtJS stylesheets. This is crucial for maintaining visual consistency with the legacy parts of the application.
                        </p>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Caveats & Limitations
                        </h3>
                        <app-alert level="warning" title="Critical Design Constraints">
                            <ul style="padding-left: 20px; margin: 0;">
                                <li style="margin-bottom: 5px;">
                                    <strong>Global Style Pollution:</strong> 
                                    Because we use Light DOM, global CSS rules (especially from ExtJS) can inadvertently affect Lit components. 
                                    Always inspect computed styles if a component renders unexpectedly.
                                </li>
                                <li style="margin-bottom: 5px;">
                                    <strong>Z-Index Management:</strong> 
                                    ExtJS windows and menus often use high z-indices (e.g., 9000+). Lit overlays (like the Mega Menu) must be 
                                    carefully managed to appear above legacy content.
                                </li>
                                <li>
                                    <strong>Explicit Widths:</strong> 
                                    Legacy CSS often assumes fixed-width containers. Modern flexible layouts (Flexbox/Grid) may need 
                                    <code>width: 100%</code> explicitly set on containers to prevent "squishing" (as seen in Dashboard Grids).
                                </li>
                            </ul>
                        </app-alert>
                    </div>

                    <div>
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Component Hierarchy
                        </h3>
                        <div style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 6px; overflow-x: auto; font-size: 0.95em; line-height: 1.5; margin-bottom: 30px;">
                            <div style="white-space: pre;">
PAGE SHELL (e.g., dashboard_lit.html)
|
|-- <strong>&lt;app-layout&gt;</strong> ........................ Layout Wrapper
|   |
|   |-- <strong>&lt;app-header&gt;</strong> ..................... Global Navigation
|   |   |-- &lt;mega-menu&gt; .................... Dropdown Menus
|   |
|   |-- <strong>&lt;main&gt;</strong> ........................... Content Area
|   |   |
|   |   |-- <strong>&lt;page-component&gt;</strong> ............... (e.g., &lt;dashboard-page&gt;)
|   |       |
|   |       |-- &lt;collapsible-panel&gt; ........ Section Container
|   |       |   |-- &lt;dashboard-grid&gt; ....... Data Grid
|   |       |
|   |       |-- <strong>&lt;app-alert&gt;</strong> ................ Warnings & Notices
|   |       |
|   |       |-- &lt;other-components&gt; ......... Forms, Charts, etc.
|   |
|   |-- <strong>&lt;app-footer&gt;</strong> ..................... Global Footer
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style="color: #2c3e50; font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                            Page Structure
                        </h3>
                        <p style="margin-bottom: 15px;">Example structure for the <strong>Dashboard Page</strong>:</p>
                        <div style="font-family: 'Consolas', 'Monaco', 'Courier New', monospace; background: #2d2d2d; color: #f8f8f2; padding: 20px; border-radius: 6px; overflow-x: auto; font-size: 0.95em; line-height: 1.5;">
                            <div style="white-space: pre;">
dashboard_lit.html
|
|-- <strong>&lt;app-layout&gt;</strong>
|   |
|   |-- <strong>&lt;app-header&gt;</strong>
|   |   |-- &lt;mega-menu&gt;
|   |
|   |-- <strong>&lt;dashboard-page&gt;</strong>
|   |   |
|   |   |-- &lt;date-selector&gt;
|   |   |
|   |   |-- <strong>&lt;collapsible-panel&gt;</strong> (Charts)
|   |   |   |
|   |   |   |-- &lt;seasonal-chart&gt;
|   |   |   |-- &lt;avalanche-rose&gt;
|   |   |   |-- &lt;failure-types-chart&gt;
|   |   |   |-- &lt;trigger-types-chart&gt;
|   |   |   |-- &lt;snowpack-height-chart&gt;
|   |   |   |-- &lt;temperature-range-chart&gt;
|   |   |   |-- &lt;wind-speed-chart&gt;
|   |   |
|   |   |-- <strong>&lt;collapsible-panel&gt;</strong> (Weather Observations)
|   |   |   |-- &lt;weather-grid&gt;
|   |   |
|   |   |-- <strong>&lt;collapsible-panel&gt;</strong> (Avalanche Activity)
|   |   |   |-- &lt;avalanche-grid&gt;
|   |   |
|   |   |-- <strong>&lt;collapsible-panel&gt;</strong> (Snowpack Structure)
|   |   |   |-- &lt;snowpack-grid&gt;
|   |   |
|   |   |-- <strong>&lt;collapsible-panel&gt;</strong> (Stability Ratings)
|   |   |   |-- &lt;stability-grid&gt;
|   |   |
|   |   |-- <strong>&lt;collapsible-panel&gt;</strong> (News & Updates)
|   |       |-- &lt;news-grid&gt;
|   |
|   |-- <strong>&lt;app-footer&gt;</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </app-container>
        `;
    }
}

customElements.define('design-system-architecture-page', DesignSystemArchitecturePage);
