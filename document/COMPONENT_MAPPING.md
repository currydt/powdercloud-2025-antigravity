# Component Mapping & Tag Naming Strategy

## Executive Summary

This document provides the complete mapping of all Lit components in the PowderCloud application, showing:
- Current file names and locations
- Current HTML tag names
- Proposed new names with `powdercloud-` prefix
- Target directory structure based on Design System categories
- Comparison with MD2 and MD3 equivalents

---

## Directory Structure Mapping

### Current Structure (Flat + Some Subdirs)
```
public/js/lit/
├── AppButton.js, AppCard.js, etc. (31 core components - FLAT)
├── AvalancheRose.js, MegaMenu.js, etc. (11 utils - FLAT)
├── charts/ (7 components - already organized)
├── forms/ (8 components - already organized)
├── grids/ (10 components - already organized)
└── pages/ (72 components - already organized)
```

### Target Structure (Mirroring Design System)
```
public/js/lit/
├── actions/ (Button, Chip, Fab)
├── communication/ (Alert, Toast, Progress)
├── containment/ (Card, Dialog, Modal)
├── inputs/ (TextField, Checkbox, Select, DateRange)
├── layout/ (Container, Grid, Stack, Header)
├── navigation/ (Tabs, Menu, Breadcrumb)
├── data-display/ (DataTable, GoogleMap)
├── charts/ (Already exists)
├── forms/ (Already exists)
├── grids/ (Already exists)
├── pages/ (Already exists)
└── utils/ (Validators, etc.)
```

---

## Complete Component Mapping Table

| Current File | Current Tag | New File | New Tag | Target Category | MD2 | MD3 |
|:-------------|:------------|:---------|:--------|:----------------|:----|:----|
| **Actions** |
| AppButton.js | `<app-button>` | PowdercloudButton.js | `<powdercloud-button>` | actions/ | `<md2-button>` | `<md-filled-button>` |
| AppChip.js | `<app-chip>` | PowdercloudChip.js | `<powdercloud-chip>` | actions/ | `<md2-chip>` | `<md-filter-chip>` |
| AppFab.js | `<app-fab>` | PowdercloudFab.js | `<powdercloud-fab>` | actions/ | `<md2-fab>` | `<md-fab>` |
| **Communication** |
| AppAlert.js | `<app-alert>` | PowdercloudAlert.js | `<powdercloud-alert>` | communication/ | ❌ | ❌ |
| AppProgress.js | `<app-progress>` | PowdercloudProgress.js | `<powdercloud-progress>` | communication/ | `<md2-progress>` | `<md-circular-progress>` |
| AppToast.js | `<app-toast>` | PowdercloudToast.js | `<powdercloud-toast>` | communication/ | ❌ | ❌ |
| AppTooltip.js | `<app-tooltip>` | PowdercloudTooltip.js | `<powdercloud-tooltip>` | communication/ | `<md2-tooltip>` | ❌ (Planned) |
| **Containment** |
| AppCard.js | `<app-card>` | PowdercloudCard.js | `<powdercloud-card>` | containment/ | `<md2-card>` | ❌ |
| AppDivider.js | `<app-divider>` | PowdercloudDivider.js | `<powdercloud-divider>` | containment/ | `<md2-divider>` | `<md-divider>` |
| AppFieldset.js | `<app-fieldset>` | PowdercloudFieldset.js | `<powdercloud-fieldset>` | containment/ | ❌ | ❌ |
| AppModal.js | `<app-modal>` | PowdercloudModal.js | `<powdercloud-modal>` | containment/ | `<md2-dialog>` | `<md-dialog>` |
| **Inputs** |
| AppCheckbox.js | `<app-checkbox>` | PowdercloudCheckbox.js | `<powdercloud-checkbox>` | inputs/ | `<md2-checkbox>` | `<md-checkbox>` |
| AppCombobox.js | `<app-combobox>` | PowdercloudCombobox.js | `<powdercloud-combobox>` | inputs/ | ❌ | ❌ |
| AppDateRange.js | `<app-date-range>` | PowdercloudDateRange.js | `<powdercloud-date-range>` | inputs/ | ❌ | ❌ |
| AppFileUpload.js | `<app-file-upload>` | PowdercloudFileUpload.js | `<powdercloud-file-upload>` | inputs/ | ❌ | ❌ |
| AppInput.js | `<app-input>` | PowdercloudInput.js | `<powdercloud-input>` | inputs/ | `<md2-text-field>` | `<md-filled-text-field>` |
| AppRadio.js | `<app-radio>` | PowdercloudRadio.js | `<powdercloud-radio>` | inputs/ | `<md2-radio>` | `<md-radio>` |
| AppRichText.js | `<app-rich-text>` | PowdercloudRichText.js | `<powdercloud-rich-text>` | inputs/ | ❌ | ❌ |
| AppSelect.js | `<app-select>` | PowdercloudSelect.js | `<powdercloud-select>` | inputs/ | ❌ | `<md-filled-select>` |
| AppSwitch.js | `<app-switch>` | PowdercloudSwitch.js | `<powdercloud-switch>` | inputs/ | `<md2-switch>` | `<md-switch>` |
| AppTextarea.js | `<app-textarea>` | PowdercloudTextarea.js | `<powdercloud-textarea>` | inputs/ | `<md2-text-field>` | `<md-outlined-text-field>` |
| **Layout** |
| AppContainer.js | `<app-container>` | PowdercloudContainer.js | `<powdercloud-container>` | layout/ | ❌ | ❌ |
| AppFooter.js | `<app-footer>` | PowdercloudFooter.js | `<powdercloud-footer>` | layout/ | ❌ | ❌ |
| AppGrid.js | `<app-grid>` | PowdercloudGrid.js | `<powdercloud-grid>` | layout/ | ❌ | ❌ |
| AppHeader.js | `<app-header>` | PowdercloudHeader.js | `<powdercloud-header>` | layout/ | ❌ | ❌ |
| AppLayout.js | `<app-layout>` | PowdercloudLayout.js | `<powdercloud-layout>` | layout/ | ❌ | ❌ |
| AppSpacer.js | `<app-spacer>` | PowdercloudSpacer.js | `<powdercloud-spacer>` | layout/ | ❌ | ❌ |
| AppStack.js | `<app-stack>` | PowdercloudStack.js | `<powdercloud-stack>` | layout/ | ❌ | ❌ |
| **Navigation** |
| AppTabs.js | `<app-tabs>` | PowdercloudTabs.js | `<powdercloud-tabs>` | navigation/ | `<md2-tabs>` | `<md-tabs>` |
| Breadcrumbs.js | `<app-breadcrumbs>` | PowdercloudBreadcrumbs.js | `<powdercloud-breadcrumbs>` | navigation/ | ❌ | ❌ |
| MegaMenu.js | `<mega-menu>` | PowdercloudMegaMenu.js | `<powdercloud-mega-menu>` | navigation/ | `<md2-menu>` | `<md-menu>` |
| **Data Display** |
| AppAvatar.js | `<app-avatar>` | PowdercloudAvatar.js | `<powdercloud-avatar>` | data-display/ | ❌ | ❌ |
| AppDisclaimer.js | `<app-disclaimer>` | PowdercloudDisclaimer.js | `<powdercloud-disclaimer>` | data-display/ | ❌ | ❌ |
| AppLookup.js | `<app-lookup>` | PowdercloudLookup.js | `<powdercloud-lookup>` | data-display/ | ❌ | ❌ |
| **Utils** |
| AvalancheRose.js | `<avalanche-rose>` | PowdercloudAvalancheRose.js | `<powdercloud-avalanche-rose>` | utils/ | ❌ | ❌ |
| CollapsiblePanel.js | `<collapsible-panel>` | PowdercloudCollapsiblePanel.js | `<powdercloud-collapsible-panel>` | utils/ | ❌ | ❌ |
| ComponentDoc.js | `<component-doc>` | PowdercloudComponentDoc.js | `<powdercloud-component-doc>` | utils/ | ❌ | ❌ |
| DashboardChart.js | `<dashboard-chart>` | PowdercloudDashboardChart.js | `<powdercloud-dashboard-chart>` | utils/ | ❌ | ❌ |
| DashboardGrid.js | `<dashboard-grid>` | PowdercloudDashboardGrid.js | `<powdercloud-dashboard-grid>` | utils/ | ❌ | ❌ |
| DateSelector.js | `<date-selector>` | PowdercloudDateSelector.js | `<powdercloud-date-selector>` | utils/ | ❌ | ❌ |
| FilterPanel.js | `<filter-panel>` | PowdercloudFilterPanel.js | `<powdercloud-filter-panel>` | utils/ | ❌ | ❌ |
| SnowProfileGraph.js | `<snow-profile-graph>` | PowdercloudSnowProfileGraph.js | `<powdercloud-snow-profile-graph>` | utils/ | ❌ | ❌ |
| Validators.js | `<validators>` | PowdercloudValidators.js | `<powdercloud-validators>` | utils/ | ❌ | ❌ |

---

## Charts (Already Organized)

| Current File | Current Tag | New Tag | Category |
|:-------------|:------------|:--------|:---------|
| FailureTypesChart.js | `<failure-types-chart>` | `<powdercloud-failure-types-chart>` | charts/ |
| SeasonalChart.js | `<seasonal-chart>` | `<powdercloud-seasonal-chart>` | charts/ |
| SkyConditionsChart.js | `<sky-conditions-chart>` | `<powdercloud-sky-conditions-chart>` | charts/ |
| SnowpackHeightChart.js | `<snowpack-height-chart>` | `<powdercloud-snowpack-height-chart>` | charts/ |
| TemperatureRangeChart.js | `<temperature-range-chart>` | `<powdercloud-temperature-range-chart>` | charts/ |
| TriggerTypesChart.js | `<trigger-types-chart>` | `<powdercloud-trigger-types-chart>` | charts/ |
| WindSpeedChart.js | `<wind-speed-chart>` | `<powdercloud-wind-speed-chart>` | charts/ |

---

## Forms (Already Organized)

| Current File | Current Tag | New Tag | Category |
|:-------------|:------------|:--------|:---------|
| AvalancheForm.js | `<avalanche-form>` | `<powdercloud-avalanche-form>` | forms/ |
| NewsForm.js | `<news-form>` | `<powdercloud-news-form>` | forms/ |
| OperationForm.js | `<operation-form>` | `<powdercloud-operation-form>` | forms/ |
| PartyForm.js | `<party-form>` | `<powdercloud-party-form>` | forms/ |
| RoleForm.js | `<role-form>` | `<powdercloud-role-form>` | forms/ |
| SnowpackForm.js | `<snowpack-form>` | `<powdercloud-snowpack-form>` | forms/ |
| StabilityForm.js | `<stability-form>` | `<powdercloud-stability-form>` | forms/ |
| WeatherForm.js | `<weather-form>` | `<powdercloud-weather-form>` | forms/ |

---

## Grids (Already Organized)

| Current File | Current Tag | New Tag | Category |
|:-------------|:------------|:--------|:---------|
| AvalancheGrid.js | `<avalanche-grid>` | `<powdercloud-avalanche-grid>` | grids/ |
| NewsGrid.js | `<news-grid>` | `<powdercloud-news-grid>` | grids/ |
| ObservationTypeListGrid.js | `<observation-type-list-grid>` | `<powdercloud-observation-type-list-grid>` | grids/ |
| OperationListGrid.js | `<operation-list-grid>` | `<powdercloud-operation-list-grid>` | grids/ |
| PartyListGrid.js | `<party-list-grid>` | `<powdercloud-party-list-grid>` | grids/ |
| RoleListGrid.js | `<role-list-grid>` | `<powdercloud-role-list-grid>` | grids/ |
| SnowpackGrid.js | `<snowpack-grid>` | `<powdercloud-snowpack-grid>` | grids/ |
| StabilityGrid.js | `<stability-grid>` | `<powdercloud-stability-grid>` | grids/ |
| TerrainAtlasGrid.js | `<terrain-atlas-grid>` | `<powdercloud-terrain-atlas-grid>` | grids/ |
| WeatherGrid.js | `<weather-grid>` | `<powdercloud-weather-grid>` | grids/ |

---

## Pages (Already Organized - 72 total)

All page components follow the pattern:
- Current: `<page-name-page>`
- New: `<powdercloud-page-name-page>`
- Category: `pages/`

Examples:
- `DashboardPage.js` → `<powdercloud-dashboard-page>`
- `ObservationAvalancheNarrativePage.js` → `<powdercloud-observation-avalanche-narrative-page>`
- `AnalysisDangerPage.js` → `<powdercloud-analysis-danger-page>`

---

## Summary Statistics

- **Total Components:** 139
- **Core UI (to be organized):** 42
  - actions: 3
  - communication: 4
  - containment: 4
  - inputs: 10
  - layout: 7
  - navigation: 3
  - data-display: 3
  - utils: 9
- **Already Organized:** 97
  - charts: 7
  - forms: 8
  - grids: 10
  - pages: 72

---

## Naming Convention Rules

1. **Prefix:** All components use `powdercloud-` prefix
2. **Format:** kebab-case (e.g., `powdercloud-button`, `powdercloud-date-range`)
3. **Consistency:** Matches Design System structure but with unique namespace
4. **No Conflicts:** Distinct from `app-*`, `md2-*`, and `md-*` prefixes

---

## Next Steps

1. ✅ Agree on this mapping
2. ⏳ Execute Phase 1: Rename in place (no moving)
3. ⏳ Verify site works with new names
4. ⏳ Execute Phase 2: Move to categorized folders
5. ⏳ Update all imports
6. ⏳ Final verification
