import os
import subprocess
import re

# Full list of components to migrate (excluding the 4 already done)
# Format: (OldFile, NewFile, OldTag, NewTag)
MIGRATION_LIST = [
    ("AppCheckbox.js", "PowdercloudCheckbox.js", "app-checkbox", "powdercloud-checkbox"),
    ("AppChip.js", "PowdercloudChip.js", "app-chip", "powdercloud-chip"),
    ("AppCombobox.js", "PowdercloudCombobox.js", "app-combobox", "powdercloud-combobox"),
    ("AppContainer.js", "PowdercloudContainer.js", "app-container", "powdercloud-container"),
    ("AppDateRange.js", "PowdercloudDateRange.js", "app-date-range", "powdercloud-date-range"),
    ("AppDisclaimer.js", "PowdercloudDisclaimer.js", "app-disclaimer", "powdercloud-disclaimer"),
    ("AppDivider.js", "PowdercloudDivider.js", "app-divider", "powdercloud-divider"),
    ("AppFieldset.js", "PowdercloudFieldset.js", "app-fieldset", "powdercloud-fieldset"),
    ("AppFileUpload.js", "PowdercloudFileUpload.js", "app-file-upload", "powdercloud-file-upload"),
    ("AppFooter.js", "PowdercloudFooter.js", "app-footer", "powdercloud-footer"),
    ("AppGrid.js", "PowdercloudGrid.js", "app-grid", "powdercloud-grid"),
    ("AppHeader.js", "PowdercloudHeader.js", "app-header", "powdercloud-header"),
    ("AppInput.js", "PowdercloudInput.js", "app-input", "powdercloud-input"),
    ("AppLayout.js", "PowdercloudLayout.js", "app-layout", "powdercloud-layout"),
    ("AppLookup.js", "PowdercloudLookup.js", "app-lookup", "powdercloud-lookup"),
    ("AppModal.js", "PowdercloudModal.js", "app-modal", "powdercloud-modal"),
    ("AppProgress.js", "PowdercloudProgress.js", "app-progress", "powdercloud-progress"),
    ("AppRadio.js", "PowdercloudRadio.js", "app-radio", "powdercloud-radio"),
    ("AppRichText.js", "PowdercloudRichText.js", "app-rich-text", "powdercloud-rich-text"),
    ("AppSelect.js", "PowdercloudSelect.js", "app-select", "powdercloud-select"),
    ("AppSpacer.js", "PowdercloudSpacer.js", "app-spacer", "powdercloud-spacer"),
    ("AppStack.js", "PowdercloudStack.js", "app-stack", "powdercloud-stack"),
    ("AppSwitch.js", "PowdercloudSwitch.js", "app-switch", "powdercloud-switch"),
    ("AppTabs.js", "PowdercloudTabs.js", "app-tabs", "powdercloud-tabs"),
    ("AppTextarea.js", "PowdercloudTextarea.js", "app-textarea", "powdercloud-textarea"),
    ("AppToast.js", "PowdercloudToast.js", "app-toast", "powdercloud-toast"),
    ("AppTooltip.js", "PowdercloudTooltip.js", "app-tooltip", "powdercloud-tooltip"),
    ("AvalancheRose.js", "PowdercloudAvalancheRose.js", "avalanche-rose", "powdercloud-avalanche-rose"),
    ("Breadcrumbs.js", "PowdercloudBreadcrumbs.js", "app-breadcrumbs", "powdercloud-breadcrumbs"),
    ("CollapsiblePanel.js", "PowdercloudCollapsiblePanel.js", "collapsible-panel", "powdercloud-collapsible-panel"),
    ("ComponentDoc.js", "PowdercloudComponentDoc.js", "component-doc", "powdercloud-component-doc"),
    ("DashboardChart.js", "PowdercloudDashboardChart.js", "dashboard-chart", "powdercloud-dashboard-chart"),
    ("DashboardGrid.js", "PowdercloudDashboardGrid.js", "dashboard-grid", "powdercloud-dashboard-grid"),
    ("DateSelector.js", "PowdercloudDateSelector.js", "date-selector", "powdercloud-date-selector"),
    ("FilterPanel.js", "PowdercloudFilterPanel.js", "filter-panel", "powdercloud-filter-panel"),
    ("MegaMenu.js", "PowdercloudMegaMenu.js", "mega-menu", "powdercloud-mega-menu"),
    ("SnowProfileGraph.js", "PowdercloudSnowProfileGraph.js", "snow-profile-graph", "powdercloud-snow-profile-graph"),
    ("Validators.js", "PowdercloudValidators.js", "validators", "powdercloud-validators"),
    # Phase 2 Components
    ("AvalancheForm.js", "PowdercloudAvalancheForm.js", "avalanche-form", "powdercloud-avalanche-form"),
    ("AvalancheGrid.js", "PowdercloudAvalancheGrid.js", "avalanche-grid", "powdercloud-avalanche-grid"),
    ("FailureTypesChart.js", "PowdercloudFailureTypesChart.js", "failure-types-chart", "powdercloud-failure-types-chart"),
    ("NewsForm.js", "PowdercloudNewsForm.js", "news-form", "powdercloud-news-form"),
    ("NewsGrid.js", "PowdercloudNewsGrid.js", "news-grid", "powdercloud-news-grid"),
    ("ObservationTypeListGrid.js", "PowdercloudObservationTypeListGrid.js", "observation-type-list-grid", "powdercloud-observation-type-list-grid"),
    ("OperationForm.js", "PowdercloudOperationForm.js", "operation-form", "powdercloud-operation-form"),
    ("OperationListGrid.js", "PowdercloudOperationListGrid.js", "operation-list-grid", "powdercloud-operation-list-grid"),
    ("PartyForm.js", "PowdercloudPartyForm.js", "party-form", "powdercloud-party-form"),
    ("PartyListGrid.js", "PowdercloudPartyListGrid.js", "party-list-grid", "powdercloud-party-list-grid"),
    ("RoleForm.js", "PowdercloudRoleForm.js", "role-form", "powdercloud-role-form"),
    ("RoleListGrid.js", "PowdercloudRoleListGrid.js", "role-list-grid", "powdercloud-role-list-grid"),
    ("SeasonalChart.js", "PowdercloudSeasonalChart.js", "seasonal-chart", "powdercloud-seasonal-chart"),
    ("SkyConditionsChart.js", "PowdercloudSkyConditionsChart.js", "sky-conditions-chart", "powdercloud-sky-conditions-chart"),
    ("SnowpackForm.js", "PowdercloudSnowpackForm.js", "snowpack-form", "powdercloud-snowpack-form"),
    ("SnowpackGrid.js", "PowdercloudSnowpackGrid.js", "snowpack-grid", "powdercloud-snowpack-grid"),
    ("SnowpackHeightChart.js", "PowdercloudSnowpackHeightChart.js", "snowpack-height-chart", "powdercloud-snowpack-height-chart"),
    ("StabilityForm.js", "PowdercloudStabilityForm.js", "stability-form", "powdercloud-stability-form"),
    ("StabilityGrid.js", "PowdercloudStabilityGrid.js", "stability-grid", "powdercloud-stability-grid"),
    ("TemperatureRangeChart.js", "PowdercloudTemperatureRangeChart.js", "temperature-range-chart", "powdercloud-temperature-range-chart"),
    ("TerrainAtlasGrid.js", "PowdercloudTerrainAtlasGrid.js", "terrain-atlas-grid", "powdercloud-terrain-atlas-grid"),
    ("TriggerTypesChart.js", "PowdercloudTriggerTypesChart.js", "trigger-types-chart", "powdercloud-trigger-types-chart"),
    ("WeatherForm.js", "PowdercloudWeatherForm.js", "weather-form", "powdercloud-weather-form"),
    ("WeatherGrid.js", "PowdercloudWeatherGrid.js", "weather-grid", "powdercloud-weather-grid"),
    ("WindSpeedChart.js", "PowdercloudWindSpeedChart.js", "wind-speed-chart", "powdercloud-wind-speed-chart")
]

PAGES_DIR = "public/js/lit"

def run_git_commit(msg):
    # Git add all changes in public/js/lit (*.js only to be safe, but add . does the trick if clean)
    subprocess.run(["git", "add", "public/js/lit/*.js"], check=True)
    subprocess.run(["git", "commit", "-m", msg], check=True)

def migrate_all():
    # Get all page files
    page_files = [f for f in os.listdir(PAGES_DIR) if f.endswith(".js")]
    
    for old_file, new_file, old_tag, new_tag in MIGRATION_LIST:
        print(f"Migrating {old_file} -> {new_file}...")
        changes_count = 0
        
        for p in page_files:
            filepath = os.path.join(PAGES_DIR, p)
            if not os.path.isfile(filepath): continue
            
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = content
            
            # 1. Update Imports
            # Look for ./components/OldFile.js
            if f"./components/{old_file}" in new_content:
                new_content = new_content.replace(f"./components/{old_file}", f"./components/{new_file}")

            # 2. Update Tags
            # Replace <old-tag> and </old-tag>
            if f"<{old_tag}" in new_content:
                new_content = new_content.replace(f"<{old_tag}", f"<{new_tag}")
            if f"</{old_tag}>" in new_content:
                new_content = new_content.replace(f"</{old_tag}>", f"</{new_tag}>")

            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                changes_count += 1
                # print(f"  Updated {p}")

        if changes_count > 0:
            print(f"  {changes_count} files updated. Committing...")
            try:
                run_git_commit(f"Migrate {old_file} to {new_file}")
            except subprocess.CalledProcessError as e:
                print("  Commit failed (maybe nothing changed detected by git?):", e)
        else:
            print("  No usage found.")

if __name__ == "__main__":
    migrate_all()
