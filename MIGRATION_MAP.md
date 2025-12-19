# System Migration Mapping

This document provides a comprehensive mapping between the legacy ExtJS/Django system and the new Lit/Firebase/Node architecture.

## 1. Route Mapping

| Legacy Route (ExtJS/Django) | Legacy File (Reference) | New Route (Lit App) | New Component | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/management/` | `index.html` | `/management/` | `DashboardPage.js` | ✅ Active |
| `/management/admin` | `admin.html` | `/management/admin` | `AdminSettingsPage.js` | ✅ Active |
| `/observation/weather_narrative` | `weather_narrative.html` | `/observation/weather_narrative` | `ObservationWeatherNarrativePage.js` | ✅ Linked |
| `/observation/avalanche_narrative` | `avalanche_narrative.html` | `/observation/avalanche_narrative` | `ObservationAvalancheNarrativePage.js` | ✅ Linked |
| `/reports/avalanche_event` | `reports/avalanche_event.html` | `/reports/avalanche_event` | `ReportAvalancheEventPage.js` | ✅ Linked |
| `/reports/weather_analysis` | `reports/weather_analysis.html` | `/reports/weather_analysis` | `ReportWeatherPlotsPage.js` | ✅ Linked |

*(See full route list in ROUTE_MAPPING.md)*

## 2. Data Acquisition Mapping

This section details how data fetching has evolved. The **Server Shim** (`server.js`) currently bridges the gap by serving Firestore data in the legacy ExtJS JSON format.

| Feature | Legacy System (ExtJS) | New System (Lit + Server Shim) |
| :--- | :--- | :--- |
| **Client Fetcher** | `Ext.data.Store` / `Ext.Ajax.request` | Native `fetch()` inside `async _fetchData()` |
| **Endpoint Style** | `/json/entity_query_all/?entity=Observation` | *Same* (Proxied/Shimmed by `server.js`) |
| **Response Format** | `{ success: true, rows: [...], totalCount: N }` | *Same* (Shim converts Firestore docs to this) |
| **Parameters** | `start`, `limit`, `sort`, `filter` | `limit`, `entity`, `subtype` (Shim translates these) |
| **Authentication** | Django Session / Cookie | Firebase Auth (Future) / Currently using generic shim |
| **Mocking** | N/A (Live DB) | `server.js` generates mock data if Firestore is empty |

### Key Shimmed Endpoints
*   **Lookups:** `/json/lookup_query_all/` -> Queries Firestore `Lookup` collection -> Returns legacy tree/list structure.
*   **Entities:** `/json/entity_query_all/` -> Maps `entity=Observation` to Firestore `Observations` collection.
*   **Parties:** `/json/operation-party-list/` -> Queries Firestore `Party` collection.

## 3. Component Mapping

Mapping of standard ExtJS "xtypes" and custom components to the new **Powdercloud Design System** (Lit components).

### Core Containers & Layout
| ExtJS xtype | ExtJS Class | New Lit Component | File Location |
| :--- | :--- | :--- | :--- |
| `viewport` | `Ext.container.Viewport` | `<powdercloud-layout>` | `layout/PowdercloudLayout.js` |
| `panel` | `Ext.panel.Panel` | `<powdercloud-card>` | `containment/PowdercloudCard.js` |
| `container` | `Ext.container.Container` | `<powdercloud-container>` | `layout/PowdercloudContainer.js` |
| `tabpanel` | `Ext.tab.Panel` | `<powdercloud-tabs>` | `navigation/PowdercloudTabs.js` |
| `window` | `Ext.window.Window` | `<powdercloud-modal>` | `containment/PowdercloudModal.js` |
| `fieldset` | `Ext.form.FieldSet` | `<powdercloud-fieldset>` | `containment/PowdercloudFieldset.js` |
| `toolbar` | `Ext.toolbar.Toolbar` | `<powdercloud-button>` (in flex container) | `actions/PowdercloudButton.js` |

### Data Display
| ExtJS xtype | New Lit Component | Notes |
| :--- | :--- | :--- |
| `grid` / `gridpanel` | `<powdercloud-grid>` | Generic grid wrapper (wrapper for specific grids) |
| *(Custom Grid)* | `<powdercloud-[type]-grid>` | e.g., `PowdercloudAvalancheGrid.js` |
| `dataview` | *(Custom Render in loops)* | Use `items.map(i => html\`...\`)` |
| `templatecolumn` | *(Lit Template)* | Use `${variable}` syntax |

### Form Fields
| ExtJS xtype | New Lit Component | File Location |
| :--- | :--- | :--- |
| `textfield` | `<powdercloud-input>` | `inputs/PowdercloudInput.js` |
| `numberfield` | `<powdercloud-input type="number">`| `inputs/PowdercloudInput.js` |
| `textarea` | `<powdercloud-textarea>` | `inputs/PowdercloudTextarea.js` |
| `combobox` | `<powdercloud-select>` / `<powdercloud-combobox>` | `inputs/PowdercloudSelect.js` |
| `datefield` | `<powdercloud-date-selector>` | `utils/PowdercloudDateSelector.js` |
| `checkbox` | `<powdercloud-checkbox>` | `inputs/PowdercloudCheckbox.js` |
| `radio` | `<powdercloud-radio>` | `inputs/PowdercloudRadio.js` |
| `filefield` | `<powdercloud-file-upload>` | `inputs/PowdercloudFileUpload.js` |
| `htmleditor` | `<powdercloud-rich-text>` | `inputs/PowdercloudRichText.js` |

### Custom App Components
| Legacy App Concept | New Lit Component |
| :--- | :--- |
| **Avalanche Rose** (SVG/Canvas) | `<powdercloud-avalanche-rose>` |
| **Snow Profile** (SVG) | `<powdercloud-snow-profile-graph>` |
| **Dashboard Charts** (Highcharts) | `<powdercloud-dashboard-chart>` |
| **Breadcrumbs** | `<powdercloud-breadcrumbs>` |
| **Mega Menu** | `<powdercloud-mega-menu>` |

