const fs = require('fs');
const path = require('path');

const pages = [
    // Observations
    { name: 'ObservationAvalancheNarrativePage', file: 'obs_avalanche_narrative', title: 'Avalanche Narrative', section: 'Observations' },
    { name: 'ObservationStandardAvalanchePage', file: 'obs_avalanche_standard', title: 'Standard Avalanche Event', section: 'Observations' },
    { name: 'ObservationMultipleAvalanchePage', file: 'obs_avalanche_multiple', title: 'Multiple Avalanche Event', section: 'Observations' },
    { name: 'ObservationAvalancheSummaryPage', file: 'obs_avalanche_summary', title: 'Avalanche Summary', section: 'Observations' },
    { name: 'ObservationWeatherNarrativePage', file: 'obs_weather_narrative', title: 'Weather Narrative', section: 'Observations' },
    { name: 'ObservationStandardStudyPlotPage', file: 'obs_weather_study_plot', title: 'Standard Study Plot', section: 'Observations' },
    { name: 'ObservationFieldWeatherPage', file: 'obs_weather_field', title: 'Field Weather Summary', section: 'Observations' },
    { name: 'ObservationLayerNarrativePage', file: 'obs_layer_narrative', title: 'Layer Narrative', section: 'Observations' },
    { name: 'ObservationLayersPage', file: 'obs_layers', title: 'Layers', section: 'Observations' },
    { name: 'ObservationSnowpackStructurePage', file: 'obs_snowpack_structure', title: 'Snowpack Structure', section: 'Observations' },
    { name: 'ObservationSnowpackConcernsPage', file: 'obs_snowpack_concerns', title: 'Snowpack Concerns', section: 'Observations' },
    { name: 'ObservationSnowProfilePage', file: 'obs_snow_profile', title: 'Snow Profile', section: 'Observations' },
    { name: 'ObservationDangerRatingPage', file: 'obs_danger_rating', title: 'Danger Rating', section: 'Observations' },
    { name: 'ObservationStabilityRatingPage', file: 'obs_stability_rating', title: 'Stability Rating', section: 'Observations' },
    { name: 'ObservationSightingNarrativePage', file: 'obs_sighting_narrative', title: 'Sighting Narrative', section: 'Observations' },
    { name: 'ObservationSightingEventPage', file: 'obs_sighting_event', title: 'Sighting Event', section: 'Observations' },
    { name: 'ObservationNewsPage', file: 'obs_news', title: 'News', section: 'Observations' },

    // Analysis
    { name: 'AnalysisCommunitySummaryPage', file: 'analysis_community_summary', title: 'Community Summary', section: 'Analysis' },
    { name: 'AnalysisPublicReportPage', file: 'analysis_public_report', title: 'Public Report', section: 'Analysis' },
    { name: 'AnalysisWeatherPage', file: 'analysis_weather', title: 'Weather Analysis', section: 'Analysis' },
    { name: 'AnalysisAvalancheActivityPage', file: 'analysis_avalanche_activity', title: 'Avalanche Activity Analysis', section: 'Analysis' },
    { name: 'AnalysisSnowpackStructurePage', file: 'analysis_snowpack_structure', title: 'Snowpack Structure Analysis', section: 'Analysis' },
    { name: 'AnalysisSnowProfilePage', file: 'analysis_snow_profile', title: 'Snow Profile Analysis', section: 'Analysis' },
    { name: 'AnalysisConcernsPage', file: 'analysis_concerns', title: 'Concerns Analysis', section: 'Analysis' },
    { name: 'AnalysisSightingsPage', file: 'analysis_sightings', title: 'Sightings Analysis', section: 'Analysis' },
    { name: 'AnalysisDangerPage', file: 'analysis_danger', title: 'Danger Analysis', section: 'Analysis' },
    { name: 'AnalysisStabilityPage', file: 'analysis_stability', title: 'Stability Analysis', section: 'Analysis' },
    { name: 'AnalysisNewsPage', file: 'analysis_news', title: 'News Analysis', section: 'Analysis' },

    // Projects
    { name: 'ProjectListPage', file: 'project_list', title: 'Projects', section: 'Projects' },
    { name: 'ActivityHazardForecastPage', file: 'activity_hazard_forecast', title: 'Avalanche Hazard Forecast', section: 'Projects' },
    { name: 'ActivityHazardEvaluationPage', file: 'activity_hazard_evaluation', title: 'Avalanche Hazard Evaluation', section: 'Projects' },
    { name: 'ActivityRunStatusPage', file: 'activity_run_status', title: 'Run Status', section: 'Projects' },
    { name: 'ActivityRunUsagePage', file: 'activity_run_usage', title: 'Run Usage', section: 'Projects' },
    { name: 'ActivityZoneStatusPage', file: 'activity_zone_status', title: 'Operating Zone Status', section: 'Projects' },
    { name: 'ActivityZoneUsagePage', file: 'activity_zone_usage', title: 'Operating Zone Usage', section: 'Projects' },
    { name: 'ActivityGenericPage', file: 'activity_generic', title: 'Generic Activity', section: 'Projects' },
    { name: 'ReportInfoExPage', file: 'report_infoex', title: 'InfoEx Report', section: 'Projects' },
    { name: 'ReportWeatherPlotsPage', file: 'report_weather_plots', title: 'Weather Study Plots', section: 'Projects' },
    { name: 'ReportFieldWeatherPage', file: 'report_field_weather', title: 'Field Weather Summary', section: 'Projects' },
    { name: 'ReportAvalancheActivityPage', file: 'report_avalanche_activity', title: 'Avalanche Activity Report', section: 'Projects' },
    { name: 'ReportSnowpackPage', file: 'report_snowpack', title: 'Snowpack Structure Report', section: 'Projects' },
    { name: 'ReportDangerPage', file: 'report_danger', title: 'Danger Report', section: 'Projects' },
    { name: 'ReportStabilityPage', file: 'report_stability', title: 'Stability Report', section: 'Projects' },
    { name: 'ReportNewsPage', file: 'report_news', title: 'News Report', section: 'Projects' },

    // Profile (Remaining)
    { name: 'AdminSettingsPage', file: 'admin_settings', title: 'Operation Settings', section: 'Profile' },
    { name: 'AdminUsersPage', file: 'admin_users', title: 'Operation Users', section: 'Profile' },
    { name: 'AdminAtlasPage', file: 'admin_atlas', title: 'Operation Terrains Atlas', section: 'Profile' },
    { name: 'AdminDataSharingPage', file: 'admin_data_sharing', title: 'Operation Data Sharing', section: 'Profile' },
    { name: 'AdminAppEditorPage', file: 'admin_app_editor', title: 'App Editor', section: 'Profile' },
    { name: 'AdminRoleEditorPage', file: 'admin_role_editor', title: 'Role Editor', section: 'Profile' },
    { name: 'AdminObservationTypeEditorPage', file: 'admin_obs_type_editor', title: 'Observation Type Editor', section: 'Profile' }
];

const litDir = path.join(__dirname, 'public/js/lit/pages');
const htmlDir = path.join(__dirname, 'public/admin');

if (!fs.existsSync(litDir)) fs.mkdirSync(litDir, { recursive: true });
if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });

pages.forEach(page => {
    // 1. Create Lit Component
    const litContent = `import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class ${page.name} extends LitElement {
    createRenderRoot() {
        return this; // Light DOM
    }

    render() {
        return html\`
            <h1 style="color: #5399a5; font-size: 1.9em; margin: 0 0 5px 0; padding: 0; font-weight: normal; font-family: Arial, sans-serif; text-transform: uppercase;">
                ${page.title}
            </h1>
            <p>Stub page for ${page.title}.</p>
        \`;
    }
}

customElements.define('${page.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}', ${page.name});
`;
    fs.writeFileSync(path.join(litDir, `${page.name}.js`), litContent);

    // 2. Create HTML Shell
    const tagName = page.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} :: PowderCloud Antigravity</title>
    <link rel="shortcut icon" href="/favicon.ico" />

    <!-- Global CSS -->
    <link href="/css/main.css" rel="stylesheet" type="text/css" />
    <link href="/css/mainNew.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" id="theme" href="/resources/css/xtheme-gray.css" />

    <!-- Lit Components -->
    <script type="module" src="/js/lit/AppLayout.js"></script>
    <script type="module" src="/js/lit/pages/${page.name}.js"></script>
</head>
<body>
    <app-layout id="layout">
        <${tagName}></${tagName}>
    </app-layout>

    <script>
        document.getElementById('layout').breadcrumbs = [
            { label: 'Home', url: '/dashboard_lit.html' },
            { label: '${page.section}' },
            { label: '${page.title}' }
        ];
    </script>
</body>
</html>
`;
    fs.writeFileSync(path.join(htmlDir, `${page.file}.html`), htmlContent);
    console.log(`Created ${page.name} and ${page.file}.html`);
});
