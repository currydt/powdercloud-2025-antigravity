# Site Inventory - Menu Links vs. Existing Pages

## Summary
- **Total Menu Links:** 60+ URLs across 5 main sections
- **Existing Lit Pages:** 60 page components in `public/js/lit/pages/`
- **Site URL:** http://127.0.0.1:3003

## Menu Structure from AppHeader.js

### 1. Home
- **URL:** `/dashboard_lit.html`
- **Status:** ✅ Likely exists (need to verify)

### 2. Observations (Enter Data)

#### Avalanche Observations
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Avalanche Narrative | `/admin/obs_avalanche_narrative.html` | ✅ `ObservationAvalancheNarrativePage.js` |
| Standard Avalanche Event | `/admin/obs_avalanche_standard.html` | ✅ `AvalancheEventStandardPage.js` |
| Multiple Avalanche Event | `/admin/obs_avalanche_multiple.html` | ✅ `ObservationMultipleAvalanchePage.js` |
| Avalanche Summary | `/admin/obs_avalanche_summary.html` | ✅ `ObservationAvalancheSummaryPage.js` |

#### Weather Observations
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Weather Narrative | `/admin/obs_weather_narrative.html` | ✅ `ObservationWeatherNarrativePage.js` |
| Standard Study Plot | `/admin/obs_weather_study_plot.html` | ✅ `WeatherStudyPlotStandardPage.js` |
| Field Weather Summary | `/admin/obs_weather_field.html` | ✅ `ObservationFieldWeatherPage.js` |

#### Layers of Interest
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Layer Narrative | `/admin/obs_layer_narrative.html` | ✅ `ObservationLayerNarrativePage.js` |
| Layers | `/admin/obs_layers.html` | ✅ `ObservationLayersPage.js` |

#### Snowpack
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Snowpack Structure | `/admin/obs_snowpack_structure.html` | ✅ `ObservationSnowpackStructurePage.js` |
| Concerns | `/admin/obs_snowpack_concerns.html` | ✅ `ObservationSnowpackConcernsPage.js` |
| Snow Profile | `/admin/obs_snow_profile.html` | ✅ `ObservationSnowProfilePage.js` |

#### Ratings
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Danger Rating | `/admin/obs_danger_rating.html` | ✅ `ObservationDangerRatingPage.js` |
| Stability Rating | `/admin/obs_stability_rating.html` | ✅ `ObservationStabilityRatingPage.js` |

#### Sighting
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Sighting Narrative | `/admin/obs_sighting_narrative.html` | ✅ `ObservationSightingNarrativePage.js` |
| Sighting Event | `/admin/obs_sighting_event.html` | ✅ `ObservationSightingEventPage.js` |

#### Other
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| News | `/admin/obs_news.html` | ✅ `ObservationNewsPage.js` |

### 3. Analysis (Review Data)

#### Community
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Community Summary | `/admin/analysis_community_summary.html` | ✅ `AnalysisCommunitySummaryPage.js` |
| Public Report | `/admin/analysis_public_report.html` | ✅ `AnalysisPublicReportPage.js` |

#### Analysis
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Weather Analysis | `/admin/analysis_weather.html` | ✅ `AnalysisWeatherPage.js` |
| Avalanche Activity Analysis | `/admin/analysis_avalanche_activity.html` | ✅ `AnalysisAvalancheActivityPage.js` |
| Snowpack Structure Analysis | `/admin/analysis_snowpack_structure.html` | ✅ `AnalysisSnowpackStructurePage.js` |
| Snow Profile Analysis | `/admin/analysis_snow_profile.html` | ✅ `AnalysisSnowProfilePage.js` |
| Concerns Analysis | `/admin/analysis_concerns.html` | ✅ `AnalysisConcernsPage.js` |
| Sightings Analysis | `/admin/analysis_sightings.html` | ✅ `AnalysisSightingsPage.js` |
| Danger Analysis | `/admin/analysis_danger.html` | ✅ `AnalysisDangerPage.js` |
| Stability Analysis | `/admin/analysis_stability.html` | ✅ `AnalysisStabilityPage.js` |
| News Analysis | `/admin/analysis_news.html` | ✅ `AnalysisNewsPage.js` |

### 4. Projects (Manage Activities)

#### Projects
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Projects | `/admin/project_list.html` | ✅ `ProjectListPage.js` |

#### Activities
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Avalanche Hazard Forecast | `/admin/activity_hazard_forecast.html` | ✅ `ActivityHazardForecastPage.js` |
| Avalanche Hazard Evaluation | `/admin/activity_hazard_evaluation.html` | ✅ `ActivityHazardEvaluationPage.js` |
| Run Status | `/admin/activity_run_status.html` | ✅ `ActivityRunStatusPage.js` |
| Run Usage | `/admin/activity_run_usage.html` | ✅ `ActivityRunUsagePage.js` |
| Operating Zone Status | `/admin/activity_zone_status.html` | ✅ `ActivityZoneStatusPage.js` |
| Operating Zone Usage | `/admin/activity_zone_usage.html` | ✅ `ActivityZoneUsagePage.js` |
| Generic | `/admin/activity_generic.html` | ✅ `ActivityGenericPage.js` |

#### Reports
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| InfoEx Report | `/admin/report_infoex.html` | ✅ `ReportInfoExPage.js` |
| Weather Study Plots | `/admin/report_weather_plots.html` | ✅ `ReportWeatherPlotsPage.js` |
| Field Weather Summary | `/admin/report_field_weather.html` | ✅ `ReportFieldWeatherPage.js` |
| Avalanche Activity | `/admin/report_avalanche_activity.html` | ✅ `ReportAvalancheActivityPage.js` |
| Snowpack Structure | `/admin/report_snowpack.html` | ✅ `ReportSnowpackPage.js` |
| Danger | `/admin/report_danger.html` | ✅ `ReportDangerPage.js` |
| Stability | `/admin/report_stability.html` | ✅ `ReportStabilityPage.js` |
| News | `/admin/report_news.html` | ✅ `ReportNewsPage.js` |

### 5. Profile (Administration)

#### Administration
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Operation Settings | `/admin/admin_settings.html` | ✅ `AdminSettingsPage.js` |
| Operation Users | `/admin/admin_users.html` | ✅ `AdminUsersPage.js` |
| Operation Terrains Atlas | `/admin/admin_atlas.html` | ✅ `AdminAtlasPage.js` |
| Operation Data Sharing | `/admin/admin_data_sharing.html` | ✅ `AdminDataSharingPage.js` |
| My Profile | `/admin/user_profile.html` | ✅ `UserProfilePage.js` |

#### Site Administration
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Operation List | `/admin/operation_list.html` | ✅ `OperationListPage.js` |
| App Editor | `/admin/admin_app_editor.html` | ✅ `AdminAppEditorPage.js` |
| Lookup Editor | `/admin/lookup_editor.html` | ✅ `LookupEditorPage.js` |
| Role Editor | `/admin/admin_role_editor.html` | ✅ `AdminRoleEditorPage.js` |
| Observation Type Editor | `/admin/admin_obs_type_editor.html` | ✅ `AdminObservationTypeEditorPage.js` |

#### Design System
| Label | URL | Lit Page Exists? |
|:---|:---|:---|
| Overview | `/admin/design_system/overview.html` | ❓ (in design-system subfolder) |
| Architecture | `/admin/design_system/architecture.html` | ❓ |
| Run Structure | `/admin/docs/run_structure.html` | ✅ `RunStructurePage.js` |
| Core Components | `/admin/design_system/core.html` | ✅ `DesignSystemCorePage.js` |
| Layout | `/admin/design_system/layout.html` | ❓ |
| Containers | `/admin/design_system/containers.html` | ✅ `DesignSystemContainersPage.js` |
| Forms | `/admin/design_system/forms.html` | ❓ |
| Atoms | `/admin/design_system/atoms.html` | ❓ |
| Overlays | `/admin/design_system/overlays.html` | ❓ |
| Feedback | `/admin/design_system/feedback.html` | ❓ |
| Patterns | `/admin/design_system/patterns.html` | ❓ |
| Graphical Elements | `/admin/design_system/graphics.html` | ❓ |
| Validators | `/admin/design_system/validators.html` | ❓ |

## Next Steps
1. Verify which HTML files actually exist in `public/admin/`
2. Check routing in `server.js` to see how URLs map to Lit pages
3. Test each menu link to identify broken vs. working pages
