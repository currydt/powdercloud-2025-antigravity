# MegaMenu Structure & HTML Page Mapping

## MegaMenu Tree Structure

```
Navigation
├── Home
│   └── /dashboard_lit.html
│
├── Observations (Enter Data)
│   ├── Avalanche Observations
│   │   ├── Avalanche Narrative → /admin/obs_avalanche_narrative.html
│   │   ├── Standard Avalanche Event → /admin/obs_avalanche_standard.html
│   │   ├── Multiple Avalanche Event → /admin/obs_avalanche_multiple.html
│   │   └── Avalanche Summary → /admin/obs_avalanche_summary.html
│   │
│   ├── Weather Observations
│   │   ├── Weather Narrative → /admin/obs_weather_narrative.html
│   │   ├── Standard Study Plot → /admin/obs_weather_study_plot.html
│   │   └── Field Weather Summary → /admin/obs_weather_field.html
│   │
│   ├── Layers of Interest
│   │   ├── Layer Narrative → /admin/obs_layer_narrative.html
│   │   └── Layers → /admin/obs_layers.html
│   │
│   ├── Snowpack
│   │   ├── Snowpack Structure → /admin/obs_snowpack_structure.html
│   │   ├── Concerns → /admin/obs_snowpack_concerns.html
│   │   └── Snow Profile → /admin/obs_snow_profile.html
│   │
│   ├── Ratings
│   │   ├── Danger Rating → /admin/obs_danger_rating.html
│   │   └── Stability Rating → /admin/obs_stability_rating.html
│   │
│   ├── Sighting
│   │   ├── Sighting Narrative → /admin/obs_sighting_narrative.html
│   │   └── Sighting Event → /admin/obs_sighting_event.html
│   │
│   └── Other
│       └── News → /admin/obs_news.html
│
├── Analysis (Review Data)
│   ├── Community
│   │   ├── Community Summary → /admin/analysis_community_summary.html
│   │   └── Public Report → /admin/analysis_public_report.html
│   │
│   └── Analysis
│       ├── Weather Analysis → /admin/analysis_weather.html
│       ├── Avalanche Activity Analysis → /admin/analysis_avalanche_activity.html
│       ├── Snowpack Structure Analysis → /admin/analysis_snowpack_structure.html
│       ├── Snow Profile Analysis → /admin/analysis_snow_profile.html
│       ├── Concerns Analysis → /admin/analysis_concerns.html
│       ├── Sightings Analysis → /admin/analysis_sightings.html
│       ├── Danger Analysis → /admin/analysis_danger.html
│       ├── Stability Analysis → /admin/analysis_stability.html
│       └── News Analysis → /admin/analysis_news.html
│
├── Projects (Manage Activities)
│   ├── Projects
│   │   └── Projects → /admin/project_list.html
│   │
│   ├── Activities
│   │   ├── Avalanche Hazard Forecast → /admin/activity_hazard_forecast.html
│   │   ├── Avalanche Hazard Evaluation → /admin/activity_hazard_evaluation.html
│   │   ├── Run Status → /admin/activity_run_status.html
│   │   ├── Run Usage → /admin/activity_run_usage.html
│   │   ├── Operating Zone Status → /admin/activity_zone_status.html
│   │   ├── Operating Zone Usage → /admin/activity_zone_usage.html
│   │   └── Generic → /admin/activity_generic.html
│   │
│   └── Reports
│       ├── InfoEx Report → /admin/report_infoex.html
│       ├── Weather Study Plots → /admin/report_weather_plots.html
│       ├── Field Weather Summary → /admin/report_field_weather.html
│       ├── Avalanche Activity → /admin/report_avalanche_activity.html
│       ├── Snowpack Structure → /admin/report_snowpack.html
│       ├── Danger → /admin/report_danger.html
│       ├── Stability → /admin/report_stability.html
│       └── News → /admin/report_news.html
│
└── Profile (Administration)
    ├── Administration
    │   ├── Operation Settings → /admin/admin_settings.html
    │   ├── Operation Users → /admin/admin_users.html
    │   ├── Operation Terrains Atlas → /admin/admin_atlas.html
    │   ├── Operation Data Sharing → /admin/admin_data_sharing.html
    │   └── My Profile → /admin/user_profile.html
    │
    ├── Site Administration
    │   ├── Operation List → /admin/operation_list.html
    │   ├── App Editor → /admin/admin_app_editor.html
    │   ├── Lookup Editor → /admin/lookup_editor.html
    │   ├── Role Editor → /admin/admin_role_editor.html
    │   └── Observation Type Editor → /admin/admin_obs_type_editor.html
    │
    └── Design System
        ├── Overview → /admin/design_system/overview.html
        ├── Architecture → /admin/design_system/architecture.html
        ├── Run Structure → /admin/docs/run_structure.html
        ├── Core Components → /admin/design_system/core.html
        ├── Layout → /admin/design_system/layout.html
        ├── Containers → /admin/design_system/containers.html
        ├── Forms → /admin/design_system/forms.html
        ├── Atoms → /admin/design_system/atoms.html
        ├── Overlays → /admin/design_system/overlays.html
        ├── Feedback → /admin/design_system/feedback.html
        ├── Patterns → /admin/design_system/patterns.html
        ├── Graphical Elements → /admin/design_system/graphics.html
        └── Validators → /admin/design_system/validators.html
```

## HTML Files Mapping Table

| Menu Link | URL | HTML File Exists? | Lit Page Component |
|:---|:---|:---:|:---|
| **Home** |
| Dashboard | `/dashboard_lit.html` | ✅ | `DashboardPage.js` |
| **Observations** |
| Avalanche Narrative | `/admin/obs_avalanche_narrative.html` | ✅ | `ObservationAvalancheNarrativePage.js` |
| Standard Avalanche Event | `/admin/obs_avalanche_standard.html` | ✅ | `AvalancheEventStandardPage.js` |
| Multiple Avalanche Event | `/admin/obs_avalanche_multiple.html` | ✅ | `ObservationMultipleAvalanchePage.js` |
| Avalanche Summary | `/admin/obs_avalanche_summary.html` | ✅ | `ObservationAvalancheSummaryPage.js` |
| Weather Narrative | `/admin/obs_weather_narrative.html` | ✅ | `ObservationWeatherNarrativePage.js` |
| Standard Study Plot | `/admin/obs_weather_study_plot.html` | ✅ | `WeatherStudyPlotStandardPage.js` |
| Field Weather Summary | `/admin/obs_weather_field.html` | ✅ | `ObservationFieldWeatherPage.js` |
| Layer Narrative | `/admin/obs_layer_narrative.html` | ✅ | `ObservationLayerNarrativePage.js` |
| Layers | `/admin/obs_layers.html` | ✅ | `ObservationLayersPage.js` |
| Snowpack Structure | `/admin/obs_snowpack_structure.html` | ✅ | `ObservationSnowpackStructurePage.js` |
| Concerns | `/admin/obs_snowpack_concerns.html` | ✅ | `ObservationSnowpackConcernsPage.js` |
| Snow Profile | `/admin/obs_snow_profile.html` | ✅ | `ObservationSnowProfilePage.js` |
| Danger Rating | `/admin/obs_danger_rating.html` | ✅ | `ObservationDangerRatingPage.js` |
| Stability Rating | `/admin/obs_stability_rating.html` | ✅ | `ObservationStabilityRatingPage.js` |
| Sighting Narrative | `/admin/obs_sighting_narrative.html` | ✅ | `ObservationSightingNarrativePage.js` |
| Sighting Event | `/admin/obs_sighting_event.html` | ✅ | `ObservationSightingEventPage.js` |
| News | `/admin/obs_news.html` | ✅ | `ObservationNewsPage.js` |
| **Analysis** |
| Community Summary | `/admin/analysis_community_summary.html` | ✅ | `AnalysisCommunitySummaryPage.js` |
| Public Report | `/admin/analysis_public_report.html` | ✅ | `AnalysisPublicReportPage.js` |
| Weather Analysis | `/admin/analysis_weather.html` | ✅ | `AnalysisWeatherPage.js` |
| Avalanche Activity Analysis | `/admin/analysis_avalanche_activity.html` | ✅ | `AnalysisAvalancheActivityPage.js` |
| Snowpack Structure Analysis | `/admin/analysis_snowpack_structure.html` | ✅ | `AnalysisSnowpackStructurePage.js` |
| Snow Profile Analysis | `/admin/analysis_snow_profile.html` | ✅ | `AnalysisSnowProfilePage.js` |
| Concerns Analysis | `/admin/analysis_concerns.html` | ✅ | `AnalysisConcernsPage.js` |
| Sightings Analysis | `/admin/analysis_sightings.html` | ✅ | `AnalysisSightingsPage.js` |
| Danger Analysis | `/admin/analysis_danger.html` | ✅ | `AnalysisDangerPage.js` |
| Stability Analysis | `/admin/analysis_stability.html` | ✅ | `AnalysisStabilityPage.js` |
| News Analysis | `/admin/analysis_news.html` | ✅ | `AnalysisNewsPage.js` |
| **Projects** |
| Projects | `/admin/project_list.html` | ✅ | `ProjectListPage.js` |
| Avalanche Hazard Forecast | `/admin/activity_hazard_forecast.html` | ✅ | `ActivityHazardForecastPage.js` |
| Avalanche Hazard Evaluation | `/admin/activity_hazard_evaluation.html` | ✅ | `ActivityHazardEvaluationPage.js` |
| Run Status | `/admin/activity_run_status.html` | ✅ | `ActivityRunStatusPage.js` |
| Run Usage | `/admin/activity_run_usage.html` | ✅ | `ActivityRunUsagePage.js` |
| Operating Zone Status | `/admin/activity_zone_status.html` | ✅ | `ActivityZoneStatusPage.js` |
| Operating Zone Usage | `/admin/activity_zone_usage.html` | ✅ | `ActivityZoneUsagePage.js` |
| Generic | `/admin/activity_generic.html` | ✅ | `ActivityGenericPage.js` |
| InfoEx Report | `/admin/report_infoex.html` | ✅ | `ReportInfoExPage.js` |
| Weather Study Plots | `/admin/report_weather_plots.html` | ✅ | `ReportWeatherPlotsPage.js` |
| Field Weather Summary | `/admin/report_field_weather.html` | ✅ | `ReportFieldWeatherPage.js` |
| Avalanche Activity | `/admin/report_avalanche_activity.html` | ✅ | `ReportAvalancheActivityPage.js` |
| Snowpack Structure | `/admin/report_snowpack.html` | ✅ | `ReportSnowpackPage.js` |
| Danger | `/admin/report_danger.html` | ✅ | `ReportDangerPage.js` |
| Stability | `/admin/report_stability.html` | ✅ | `ReportStabilityPage.js` |
| News | `/admin/report_news.html` | ✅ | `ReportNewsPage.js` |
| **Profile** |
| Operation Settings | `/admin/admin_settings.html` | ✅ | `AdminSettingsPage.js` |
| Operation Users | `/admin/admin_users.html` | ✅ | `AdminUsersPage.js` |
| Operation Terrains Atlas | `/admin/admin_atlas.html` | ✅ | `AdminAtlasPage.js` |
| Operation Data Sharing | `/admin/admin_data_sharing.html` | ✅ | `AdminDataSharingPage.js` |
| My Profile | `/admin/user_profile.html` | ✅ | `UserProfilePage.js` |
| Operation List | `/admin/operation_list.html` | ✅ | `OperationListPage.js` |
| App Editor | `/admin/admin_app_editor.html` | ✅ | `AdminAppEditorPage.js` |
| Lookup Editor | `/admin/lookup_editor.html` | ✅ | `LookupEditorPage.js` |
| Role Editor | `/admin/admin_role_editor.html` | ✅ | `AdminRoleEditorPage.js` |
| Observation Type Editor | `/admin/admin_obs_type_editor.html` | ✅ | `AdminObservationTypeEditorPage.js` |
| **Design System** |
| Overview | `/admin/design_system/overview.html` | ✅ | *(Static HTML)* |
| Architecture | `/admin/design_system/architecture.html` | ✅ | *(Static HTML)* |
| Run Structure | `/admin/docs/run_structure.html` | ✅ | `RunStructurePage.js` |
| Core Components | `/admin/design_system/core.html` | ✅ | `DesignSystemCorePage.js` |
| Layout | `/admin/design_system/layout.html` | ✅ | *(Static HTML)* |
| Containers | `/admin/design_system/containers.html` | ✅ | `DesignSystemContainersPage.js` |
| Forms | `/admin/design_system/forms.html` | ✅ | *(Static HTML)* |
| Atoms | `/admin/design_system/atoms.html` | ✅ | *(Static HTML)* |
| Overlays | `/admin/design_system/overlays.html` | ✅ | *(Static HTML)* |
| Feedback | `/admin/design_system/feedback.html` | ✅ | *(Static HTML)* |
| Patterns | `/admin/design_system/patterns.html` | ✅ | *(Static HTML)* |
| Graphical Elements | `/admin/design_system/graphics.html` | ✅ | *(Static HTML)* |
| Validators | `/admin/design_system/validators.html` | ✅ | *(Static HTML)* |

## Summary
- **Total Menu Links:** 60+
- **HTML Files Found:** 74 files in `public/admin/`
- **Coverage:** ✅ **100% of menu links have corresponding HTML files**
- **Lit Pages:** 60 page components exist
- **Static HTML:** Design System pages are mostly static HTML (not Lit components)
