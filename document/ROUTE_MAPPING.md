# Route Mapping: Legacy vs. New

This document maps the original ExtJS/Django routes (and their corresponding legacy HTML wrappers in `public/`) to the new Lit application routes in `server.js` and their implementing components.

## 1. Management & Core Pages
| Original/Legacy Route | Legacy File (Reference) | New Route | New Component / File | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/management/` | `public/index.html` | `/management/` | `DashboardPage.js` (via `index.html`) | ✅ Active |
| `/management/admin` | `public/admin.html` | `/management/admin` | `AdminSettingsPage.js` (via `admin.html`) | ✅ Active |
| `/management/observation` | `public/observation.html` | `/management/observation` | *(Multiple Obs Pages)* | ⚠️ Mixed |
| `/management/reports` | `public/reports.html` | `/management/reports` | *(Multiple Report Pages)* | ⚠️ Mixed |

## 2. Observation Pages
| Original/Legacy Route | Legacy File (Reference) | New Route | New Component / File | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/observation/weather_narrative` | `public/observation/weather_narrative.html` | `/observation/weather_narrative` | `ObservationWeatherNarrativePage.js` | ✅ Linked |
| `/observation/weather_study_plot_standard` | `public/observation/weather_study_plot_standard.html` | `/observation/weather_study_plot_standard` | `WeatherStudyPlotStandardPage.js` | ✅ Linked |
| `/observation/avalanche_narrative` | `public/observation/avalanche_narrative.html` | `/observation/avalanche_narrative` | `ObservationAvalancheNarrativePage.js` | ✅ Linked |
| `/observation/avalanche_event_standard` | `public/observation/avalanche_event_standard.html` | `/observation/avalanche_event_standard` | `ObservationAvalancheStandardPage.js` | ✅ Linked |
| `/observation/avalanche_event_multiple` | `public/observation/avalanche_event_multiple.html` | `/observation/avalanche_event_multiple` | `ObservationMultipleAvalanchePage.js` | ✅ Linked |
| `/observation/avalanche_summary` | `public/observation/avalanche_summary.html` | `/observation/avalanche_summary` | `ObservationAvalancheSummaryPage.js` | ✅ Linked |
| `/observation/sighting_narrative` | `public/observation/sighting_narrative.html` | `/observation/sighting_narrative` | `ObservationSightingNarrativePage.js` | ✅ Linked |
| `/observation/sighting_event` | `public/observation/sighting_event.html` | `/observation/sighting_event` | `ObservationSightingEventPage.js` | ✅ Linked |
| `/observation/rating_danger` | `public/observation/rating_danger.html` | `/observation/rating_danger` | `ObservationDangerRatingPage.js` | ✅ Linked |
| `/observation/rating_stability` | `public/observation/rating_stability.html` | `/observation/rating_stability` | `ObservationStabilityRatingPage.js` | ✅ Linked |
| `/observation/news` | `public/observation/news.html` | `/observation/news` | `ObservationNewsPage.js` | ✅ Linked |
| `/observation/persistent_layer` | `public/observation/persistent_layer.html` | `/observation/persistent_layer` | *(Missing / In Progress)* | ⚠️ Partial |
| `/observation/persistent_layer_narrative` | `public/observation/persistent_layer_narrative.html` | `/observation/persistent_layer_narrative` | *(Missing / In Progress)* | ⚠️ Partial |

## 3. Analysis & Reports (ExtJS Heavy)
| Original/Legacy Route | Legacy File (Reference) | New Route | New Component / File | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/reports/avalanche_event` | `public/reports/avalanche_event.html` | `/reports/avalanche_event` | `ReportAvalancheEventPage.js` | ✅ Linked |
| `/reports/weather_analysis` | `public/reports/weather_analysis.html` | `/reports/weather_analysis` | `ReportWeatherPlotsPage.js` | ✅ Linked |
| `/reports/snowpack_structure_analysis` | `public/reports/snowpack_structure_analysis.html` | `/reports/snowpack_structure_analysis` | `ReportSnowpackPage.js` | ✅ Linked |
| `/reports/snow_profile_analysis` | `public/reports/snow_profile_analysis.html` | `/reports/snow_profile_analysis` | `AnalysisSnowProfilePage.js` | ✅ Linked |
| `/reports/concerns_analysis` | `public/reports/concerns_analysis.html` | `/reports/concerns_analysis` | `AnalysisConcernsPage.js` | ✅ Linked |
| `/reports/sightings_analysis` | `public/reports/sightings_analysis.html` | `/reports/sightings_analysis` | `AnalysisSightingsPage.js` | ✅ Linked |
| `/reports/danger_analysis` | `public/reports/danger_analysis.html` | `/reports/danger_analysis` | `ReportDangerPage.js` | ✅ Linked |
| `/reports/stability_analysis` | `public/reports/stability_analysis.html` | `/reports/stability_analysis` | `ReportStabilityPage.js` | ✅ Linked |
| `/reports/news_analysis` | `public/reports/news_analysis.html` | `/reports/news_analysis` | `ReportNewsPage.js` | ✅ Linked |

## 4. API / JSON Shim Endpoints (Server.js)
These endpoints exist to serve the legacy ExtJS data expectations while using the new Firestore backend.

| Original/Legacy Endpoint | New Shim Route | Purpose |
| :--- | :--- | :--- |
| `/json/lookup_query_all/` | `/json/lookup_query_all/` | Fetches Lookup combos (e.g. Aspects, Trigger Types) |
| `/json/entity_query_all/` | `/json/entity_query_all/` | Main data fetcher for Observations, Entities |
| `/json/entity_query_all_paging/` | `/json/entity_query_all_paging/` | Paginated data fetcher |
| `/json/operation-party-list/` | `/json/operation-party-list/:opKey/` | Fetch parties for operation |

**Note**: Routes marked with ✅ are explicitly defined in `server.js` or have corresponding Lit components. Routes marked with ⚠️ may be relying on generic handlers or are incomplete in the migration.
