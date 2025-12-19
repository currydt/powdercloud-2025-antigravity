# Powdercloud Component Structure

This document outlines the directory structure of the Lit components and pages within the `public/js/lit` directory.

```
public/js/lit
├── actions
│   ├── PowdercloudButton.js
│   └── PowdercloudChip.js
├── charts
│   ├── PowdercloudFailureTypesChart.js
│   ├── PowdercloudSeasonalChart.js
│   ├── PowdercloudSkyConditionsChart.js
│   ├── PowdercloudSnowProfileChart.js
│   ├── PowdercloudSnowpackHeightChart.js
│   ├── PowdercloudTemperatureRangeChart.js
│   ├── PowdercloudTriggerTypesChart.js
│   └── PowdercloudWindSpeedChart.js
├── communication
│   ├── PowdercloudAlert.js
│   ├── PowdercloudProgress.js
│   ├── PowdercloudToast.js
│   └── PowdercloudTooltip.js
├── containment
│   ├── PowdercloudCard.js
│   ├── PowdercloudDivider.js
│   ├── PowdercloudFieldset.js
│   └── PowdercloudModal.js
├── data-display
│   ├── PowdercloudAvatar.js
│   ├── PowdercloudDisclaimer.js
│   ├── PowdercloudGoogleMap.js
│   └── PowdercloudLookup.js
├── forms
│   ├── PowdercloudAvalancheForm.js
│   ├── PowdercloudNewsForm.js
│   ├── PowdercloudOperationForm.js
│   ├── PowdercloudPartyForm.js
│   ├── PowdercloudRoleForm.js
│   ├── PowdercloudSnowpackForm.js
│   ├── PowdercloudStabilityForm.js
│   └── PowdercloudWeatherForm.js
├── grids
│   ├── PowdercloudAvalancheGrid.js
│   ├── PowdercloudNewsGrid.js
│   ├── PowdercloudObservationTypeListGrid.js
│   ├── PowdercloudOperationListGrid.js
│   ├── PowdercloudPartyListGrid.js
│   ├── PowdercloudRoleListGrid.js
│   ├── PowdercloudSnowpackGrid.js
│   ├── PowdercloudStabilityGrid.js
│   ├── PowdercloudTerrainAtlasGrid.js
│   └── PowdercloudWeatherGrid.js
├── inputs
│   ├── PowdercloudCheckbox.js
│   ├── PowdercloudCombobox.js
│   ├── PowdercloudDateRange.js
│   ├── PowdercloudFileUpload.js
│   ├── PowdercloudInput.js
│   ├── PowdercloudRadio.js
│   ├── PowdercloudRichText.js
│   ├── PowdercloudSelect.js
│   ├── PowdercloudSwitch.js
│   └── PowdercloudTextarea.js
├── layout
│   ├── PowdercloudContainer.js
│   ├── PowdercloudFooter.js
│   ├── PowdercloudGrid.js
│   ├── PowdercloudHeader.js
│   ├── PowdercloudLayout.js
│   ├── PowdercloudSpacer.js
│   └── PowdercloudStack.js
├── navigation
│   ├── PowdercloudBreadcrumbs.js
│   ├── PowdercloudMegaMenu.js
│   └── PowdercloudTabs.js
├── pages
│   ├── ActivityGenericPage.js
│   ├── ActivityHazardEvaluationPage.js
│   ├── ActivityHazardForecastPage.js
│   ├── ActivityRunStatusPage.js
│   ├── ActivityRunUsagePage.js
│   ├── ActivityZoneStatusPage.js
│   ├── ActivityZoneUsagePage.js
│   ├── AdminAppEditorPage.js
│   ├── AdminAtlasPage.js
│   ├── AdminDataSharingPage.js
│   ├── AdminObservationTypeEditorPage.js
│   ├── AdminRoleEditorPage.js
│   ├── AdminSettingsPage.js
│   ├── AdminUsersPage.js
│   ├── AnalysisAvalancheActivityPage.js
│   ├── AnalysisCommunitySummaryPage.js
│   ├── AnalysisConcernsPage.js
│   ├── AnalysisDangerPage.js
│   ├── AnalysisNewsPage.js
│   ├── AnalysisPublicReportPage.js
│   ├── AnalysisSightingsPage.js
│   ├── AnalysisSnowProfilePage.js
│   ├── AnalysisSnowpackPage.js
│   ├── AnalysisSnowpackStructurePage.js
│   ├── AnalysisStabilityPage.js
│   ├── AnalysisWeatherPage.js
│   ├── AvalancheEventStandardPage.js
│   ├── BasicAnalysisPage.js
│   ├── ComponentsPage.js
│   ├── DashboardPage.js
│   ├── DesignSystemArchitecturePage.js
│   ├── DesignSystemAtomsPage.js
│   ├── DesignSystemContainersPage.js
│   ├── DesignSystemCorePage.js
│   ├── DesignSystemFeedbackPage.js
│   ├── DesignSystemFormsPage.js
│   ├── DesignSystemGraphicsPage.js
│   ├── DesignSystemLayoutPage.js
│   ├── DesignSystemOverlaysPage.js
│   ├── DesignSystemOverviewPage.js
│   ├── DesignSystemPatternsPage.js
│   ├── DesignSystemValidatorsPage.js
│   ├── LookupEditorPage.js
│   ├── ObservationAvalancheNarrativePage.js
│   ├── ObservationAvalancheStandardPage.js
│   ├── ObservationAvalancheSummaryPage.js
│   ├── ObservationDangerRatingPage.js
│   ├── ObservationFieldWeatherPage.js
│   ├── ObservationLayerNarrativePage.js
│   ├── ObservationLayersPage.js
│   ├── ObservationMasterPage.js
│   ├── ObservationMultipleAvalanchePage.js
│   ├── ObservationNewsPage.js
│   ├── ObservationSightingEventPage.js
│   ├── ObservationSightingNarrativePage.js
│   ├── ObservationSnowProfilePage.js
│   ├── ObservationSnowpackConcernsPage.js
│   ├── ObservationSnowpackStructurePage.js
│   ├── ObservationStabilityRatingPage.js
│   ├── ObservationWeatherNarrativePage.js
│   ├── OperationListPage.js
│   ├── ProjectListPage.js
│   ├── ReportAvalancheActivityPage.js
│   ├── ReportAvalancheEventPage.js
│   ├── ReportDangerPage.js
│   ├── ReportFieldWeatherPage.js
│   ├── ReportInfoExPage.js
│   ├── ReportNewsPage.js
│   ├── ReportSnowpackPage.js
│   ├── ReportStabilityPage.js
│   ├── ReportWeatherPlotsPage.js
│   ├── RunStructurePage.js
│   ├── UserProfilePage.js
│   └── WeatherStudyPlotStandardPage.js
└── utils
    ├── PowdercloudAvalancheRose.js
    ├── PowdercloudCollapsiblePanel.js
    ├── PowdercloudComponentDoc.js
    ├── PowdercloudDashboardChart.js
    ├── PowdercloudDashboardGrid.js
    ├── PowdercloudDateSelector.js
    ├── PowdercloudFilterPanel.js
    ├── PowdercloudSnowProfileGraph.js
    ├── PowdercloudSvgSnowprofile.js
    ├── PowdercloudValidators.js
    └── psvg-core.js
```

# Powdercloud HTML Structure

This document outlines the directory structure of the HTML files within the `public` directory.

```
public
├── _jquery
│   ├── admin.html
│   ├── admin
│   │   ├── lookup_list.html
│   │   ├── observation_list.html
│   │   └── operation_list.html
│   ├── dashboard_lit.html
│   ├── incidents.html
│   ├── index.html
│   ├── observation.html
│   ├── observation
│   │   ├── avalanche_event_multiple.html
│   │   ├── avalanche_event_standard.html
│   │   ├── avalanche_narrative.html
│   │   ├── avalanche_summary.html
│   │   ├── concerns.html
│   │   ├── news.html
│   │   ├── persistent_layer.html
│   │   ├── persistent_layer_narrative.html
│   │   ├── rating_danger.html
│   │   ├── rating_stability.html
│   │   ├── sighting_event.html
│   │   ├── sighting_narrative.html
│   │   ├── snow_profile_industrial.html
│   │   ├── snowpack_structure.html
│   │   ├── weather_field_summary.html
│   │   ├── weather_narrative.html
│   │   └── weather_study_plot_standard.html
│   ├── projects
│   │   └── activities_list.html
│   ├── reports.html
│   ├── reports
│   │   ├── avalanche_event.html
│   │   ├── concerns_analysis.html
│   │   ├── danger_analysis.html
│   │   ├── news_analysis.html
│   │   ├── sightings_analysis.html
│   │   ├── snow_profile_analysis.html
│   │   ├── snowpack_structure_analysis.html
│   │   ├── stability_analysis.html
│   │   ├── weather_analysis.html
│   │   └── weather_analysis_extjs.html
│   └── svg_editor
│       ├── index.html
│       ├── svg-editor-old-index.html
│       └── svg-editor.html
├── admin.html
├── admin
│   ├── activity_generic.html
│   ├── activity_hazard_evaluation.html
│   ├── activity_hazard_forecast.html
│   ├── activity_run_status.html
│   ├── activity_run_usage.html
│   ├── activity_zone_status.html
│   ├── activity_zone_usage.html
│   ├── admin_app_editor.html
│   ├── admin_atlas.html
│   ├── admin_data_sharing.html
│   ├── admin_obs_type_editor.html
│   ├── admin_role_editor.html
│   ├── admin_settings.html
│   ├── admin_users.html
│   ├── analysis_avalanche.html
│   ├── analysis_avalanche_activity.html
│   ├── analysis_basic.html
│   ├── analysis_community_summary.html
│   ├── analysis_concerns.html
│   ├── analysis_danger.html
│   ├── analysis_news.html
│   ├── analysis_public_report.html
│   ├── analysis_sightings.html
│   ├── analysis_snow_profile.html
│   ├── analysis_snowpack.html
│   ├── analysis_snowpack_structure.html
│   ├── analysis_stability.html
│   ├── analysis_weather.html
│   ├── design_system
│   │   ├── architecture.html
│   │   ├── atoms.html
│   │   ├── containers.html
│   │   ├── core.html
│   │   ├── feedback.html
│   │   ├── forms.html
│   │   ├── graphics.html
│   │   ├── layout.html
│   │   ├── overlays.html
│   │   ├── overview.html
│   │   ├── patterns.html
│   │   └── validators.html
│   ├── development_components.html
│   ├── docs
│   │   └── run_structure.html
│   ├── lookup_editor.html
│   ├── lookup_list.html
│   ├── obs_avalanche_multiple.html
│   ├── obs_avalanche_narrative.html
│   ├── obs_avalanche_standard.html
│   ├── obs_avalanche_summary.html
│   ├── obs_danger_rating.html
│   ├── obs_layer_narrative.html
│   ├── obs_layers.html
│   ├── obs_news.html
│   ├── obs_sighting_event.html
│   ├── obs_sighting_narrative.html
│   ├── obs_snow_profile.html
│   ├── obs_snowpack_concerns.html
│   ├── obs_snowpack_structure.html
│   ├── obs_stability_rating.html
│   ├── obs_weather_field.html
│   ├── obs_weather_narrative.html
│   ├── obs_weather_study_plot.html
│   ├── observation.html
│   ├── observation_list.html
│   ├── operation_list.html
│   ├── project_list.html
│   ├── report_avalanche_activity.html
│   ├── report_danger.html
│   ├── report_field_weather.html
│   ├── report_infoex.html
│   ├── report_news.html
│   ├── report_snowpack.html
│   ├── report_stability.html
│   ├── report_weather_plots.html
│   ├── user_profile.html
│   └── weather_analysis.html
├── dashboard_lit.html
├── incidents.html
├── index.html
├── legacy.html
├── observation.html
├── observation
│   ├── avalanche_event_multiple.html
│   ├── avalanche_event_standard.html
│   ├── avalanche_narrative.html
│   ├── avalanche_summary.html
│   ├── concerns.html
│   ├── news.html
│   ├── persistent_layer.html
│   ├── persistent_layer_narrative.html
│   ├── rating_danger.html
│   ├── rating_stability.html
│   ├── sighting_event.html
│   ├── sighting_narrative.html
│   ├── snow_profile_industrial.html
│   ├── snowpack_structure.html
│   ├── weather_field_summary.html
│   ├── weather_narrative.html
│   └── weather_study_plot_standard.html
├── projects
│   └── activities_list.html
├── reports.html
├── reports
│   ├── avalanche_event.html
│   ├── concerns_analysis.html
│   ├── danger_analysis.html
│   ├── news_analysis.html
│   ├── sightings_analysis.html
│   ├── snow_profile_analysis.html
│   ├── snowpack_structure_analysis.html
│   ├── stability_analysis.html
│   ├── weather_analysis.html
│   └── weather_analysis_extjs.html
└── svg_editor
    ├── index.html
    ├── svg-editor-old-index.html
    └── svg-editor.html
```
