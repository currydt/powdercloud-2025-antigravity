import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import './PowdercloudMegaMenu.js';

export class PowdercloudHeader extends LitElement {
    createRenderRoot() {
        return this; // Use Light DOM to inherit global styles
    }

    constructor() {
        super();
        this.menus = [
            {
                title: 'Home',
                subtitle: '\u00A0', // &nbsp;
                url: '/dashboard_lit.html',
                active: true
            },
            {
                title: 'Observations',
                subtitle: 'Enter Data',
                url: '/admin/observation.html',
                menuData: [
                    [ // Col 1
                        {
                            title: 'Avalanche Observations', links: [
                                { label: 'Avalanche Narrative', url: '/admin/obs_avalanche_narrative.html' },
                                { label: 'Standard Avalanche Event', url: '/admin/obs_avalanche_standard.html' },
                                { label: 'Multiple Avalanche Event', url: '/admin/obs_avalanche_multiple.html' },
                                { label: 'Avalanche Summary', url: '/admin/obs_avalanche_summary.html' }
                            ]
                        },
                        {
                            title: 'Weather Observations', links: [
                                { label: 'Weather Narrative', url: '/admin/obs_weather_narrative.html' },
                                { label: 'Standard Study Plot', url: '/admin/obs_weather_study_plot.html' },
                                { label: 'Field Weather Summary', url: '/admin/obs_weather_field.html' }
                            ]
                        }
                    ],
                    [ // Col 2
                        {
                            title: 'Layers of Interest', links: [
                                { label: 'Layer Narrative', url: '/admin/obs_layer_narrative.html' },
                                { label: 'Layers', url: '/admin/obs_layers.html' }
                            ]
                        },
                        {
                            title: 'Snowpack', links: [
                                { label: 'Snowpack Structure', url: '/admin/obs_snowpack_structure.html' },
                                { label: 'Concerns', url: '/admin/obs_snowpack_concerns.html' },
                                { label: 'Snow Profile', url: '/admin/obs_snow_profile.html' }
                            ]
                        },
                        {
                            title: 'Ratings', links: [
                                { label: 'Danger Rating', url: '/admin/obs_danger_rating.html' },
                                { label: 'Stability Rating', url: '/admin/obs_stability_rating.html' }
                            ]
                        }
                    ],
                    [ // Col 3
                        {
                            title: 'Sighting', links: [
                                { label: 'Sighting Narrative', url: '/admin/obs_sighting_narrative.html' },
                                { label: 'Sighting Event', url: '/admin/obs_sighting_event.html' }
                            ]
                        }
                    ],
                    [ // Col 4
                        {
                            title: 'Other', links: [
                                { label: 'News', url: '/admin/obs_news.html' }
                            ]
                        }
                    ]
                ]
            },
            {
                title: 'Analysis',
                subtitle: 'Review Data',
                url: '/admin/analysis_weather.html', // Default to first item
                menuData: [
                    [
                        {
                            title: 'Community', links: [
                                { label: 'Community Summary', url: '/admin/analysis_community_summary.html' },
                                { label: 'Public Report', url: '/admin/analysis_public_report.html' }
                            ]
                        }
                    ],
                    [
                        {
                            title: 'Analysis', links: [
                                { label: 'Weather Analysis', url: '/admin/analysis_weather.html' },
                                { label: 'Avalanche Activity Analysis', url: '/admin/analysis_avalanche_activity.html' },
                                { label: 'Snowpack Structure Analysis', url: '/admin/analysis_snowpack_structure.html' },
                                { label: 'Snow Profile Analysis', url: '/admin/analysis_snow_profile.html' },
                                { label: 'Concerns Analysis', url: '/admin/analysis_concerns.html' },
                                { label: 'Sightings Analysis', url: '/admin/analysis_sightings.html' },
                                { label: 'Danger Analysis', url: '/admin/analysis_danger.html' },
                                { label: 'Stability Analysis', url: '/admin/analysis_stability.html' },
                                { label: 'News Analysis', url: '/admin/analysis_news.html' }
                            ]
                        }
                    ],
                    [
                        { title: 'Charts', links: [] }
                    ]
                ]
            },
            {
                title: 'Projects',
                subtitle: 'Manage Activities',
                url: '/admin/project_list.html',
                menuData: [
                    [
                        {
                            title: 'Projects', links: [
                                { label: 'Projects', url: '/admin/project_list.html' }
                            ]
                        }
                    ],
                    [
                        {
                            title: 'Activities', links: [
                                { label: 'Avalanche Hazard Forecast', url: '/admin/activity_hazard_forecast.html' },
                                { label: 'Avalanche Hazard Evaluation', url: '/admin/activity_hazard_evaluation.html' },
                                { label: 'Run Status', url: '/admin/activity_run_status.html' },
                                { label: 'Run Usage', url: '/admin/activity_run_usage.html' },
                                { label: 'Operating Zone Status', url: '/admin/activity_zone_status.html' },
                                { label: 'Operating Zone Usage', url: '/admin/activity_zone_usage.html' },
                                { label: 'Generic', url: '/admin/activity_generic.html' }
                            ]
                        }
                    ],
                    [
                        {
                            title: 'Reports', links: [
                                { label: 'InfoEx Report', url: '/admin/report_infoex.html' },
                                { label: 'Weather Study Plots', url: '/admin/report_weather_plots.html' },
                                { label: 'Field Weather Summary', url: '/admin/report_field_weather.html' },
                                { label: 'Avalanche Activity', url: '/admin/report_avalanche_activity.html' },
                                { label: 'Snowpack Structure', url: '/admin/report_snowpack.html' },
                                { label: 'Danger', url: '/admin/report_danger.html' },
                                { label: 'Stability', url: '/admin/report_stability.html' },
                                { label: 'News', url: '/admin/report_news.html' }
                            ]
                        }
                    ]
                ]
            },
            {
                title: 'Profile',
                subtitle: 'Administration',
                url: '/admin/user_profile.html',
                menuData: [
                    [
                        {
                            title: 'Administration', links: [
                                { label: 'Operation Settings', url: '/admin/admin_settings.html' },
                                { label: 'Operation Users', url: '/admin/admin_users.html' },
                                { label: 'Operation Terrains Atlas', url: '/admin/admin_atlas.html' },
                                { label: 'Operation Data Sharing', url: '/admin/admin_data_sharing.html' },
                                { label: 'My Profile', url: '/admin/user_profile.html' }
                            ]
                        }
                    ],
                    [
                        {
                            title: 'Site Administration', links: [
                                { label: 'Operation List', url: '/admin/operation_list.html' },
                                { label: 'App Editor', url: '/admin/admin_app_editor.html' },
                                { label: 'Lookup Editor', url: '/admin/lookup_editor.html' },
                                { label: 'Role Editor', url: '/admin/admin_role_editor.html' },
                                { label: 'Observation Type Editor', url: '/admin/admin_obs_type_editor.html' }
                            ]
                        }
                    ],
                    [
                        {
                            title: 'Design System', links: [
                                { label: 'Overview', url: '/admin/design_system/overview.html' },
                                { label: 'Architecture', url: '/admin/design_system/architecture.html' },
                                { label: 'Run Structure', url: '/admin/docs/run_structure.html' },
                                { label: 'Core Components', url: '/admin/design_system/core.html' },
                                { label: 'Layout', url: '/admin/design_system/layout.html' },
                                { label: 'Containers', url: '/admin/design_system/containers.html' },
                                { label: 'Forms', url: '/admin/design_system/forms.html' },
                                { label: 'Atoms', url: '/admin/design_system/atoms.html' },
                                { label: 'Overlays', url: '/admin/design_system/overlays.html' },
                                { label: 'Feedback', url: '/admin/design_system/feedback.html' },
                                { label: 'Patterns', url: '/admin/design_system/patterns.html' },
                                { label: 'Graphical Elements', url: '/admin/design_system/graphics.html' },
                                { label: 'Validators', url: '/admin/design_system/validators.html' }
                            ]
                        }
                    ]
                ]
            },
            {
                title: 'Login',
                subtitle: 'Hard Reset',
                url: 'javascript:location.reload()',
                menuData: []
            }
        ];
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
                        ${this.menus.map(menu => html`
                            <powdercloud-mega-menu 
                                .title="${menu.title}" 
                                .subtitle="${menu.subtitle}" 
                                .url="${menu.url}" 
                                .menuData="${menu.menuData}"
                                .active="${menu.active || false}">
                            </powdercloud-mega-menu>
                        `)}
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

customElements.define('powdercloud-header', PowdercloudHeader);
