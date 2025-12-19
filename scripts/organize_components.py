
import os
import shutil

BASE_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public/js/lit'
COMPONENTS_DIR = os.path.join(BASE_DIR, 'components')

# Mapping from filename to category
# Based on document/COMPONENT_MAPPING.md

MAPPING = {
    # Actions
    'PowdercloudButton.js': 'actions',
    'PowdercloudChip.js': 'actions',
    'PowdercloudFab.js': 'actions',
    
    # Communication
    'PowdercloudAlert.js': 'communication',
    'PowdercloudProgress.js': 'communication',
    'PowdercloudToast.js': 'communication',
    'PowdercloudTooltip.js': 'communication',
    
    # Containment
    'PowdercloudCard.js': 'containment',
    'PowdercloudDivider.js': 'containment',
    'PowdercloudFieldset.js': 'containment',
    'PowdercloudModal.js': 'containment',
    
    # Inputs
    'PowdercloudCheckbox.js': 'inputs',
    'PowdercloudCombobox.js': 'inputs',
    'PowdercloudDateRange.js': 'inputs',
    'PowdercloudFileUpload.js': 'inputs',
    'PowdercloudInput.js': 'inputs',
    'PowdercloudRadio.js': 'inputs',
    'PowdercloudRichText.js': 'inputs',
    'PowdercloudSelect.js': 'inputs',
    'PowdercloudSwitch.js': 'inputs',
    'PowdercloudTextarea.js': 'inputs',
    
    # Layout
    'PowdercloudContainer.js': 'layout',
    'PowdercloudFooter.js': 'layout',
    'PowdercloudGrid.js': 'layout',
    'PowdercloudHeader.js': 'layout',
    'PowdercloudLayout.js': 'layout',
    'PowdercloudSpacer.js': 'layout',
    'PowdercloudStack.js': 'layout',
    
    # Navigation
    'PowdercloudTabs.js': 'navigation',
    'PowdercloudBreadcrumbs.js': 'navigation',
    'PowdercloudMegaMenu.js': 'navigation',
    
    # Data Display
    'PowdercloudAvatar.js': 'data-display',
    'PowdercloudDisclaimer.js': 'data-display',
    'PowdercloudLookup.js': 'data-display',
    
    # Utils
    'PowdercloudAvalancheRose.js': 'utils',
    'PowdercloudCollapsiblePanel.js': 'utils',
    'PowdercloudComponentDoc.js': 'utils',
    'PowdercloudDashboardChart.js': 'utils',
    'PowdercloudDashboardGrid.js': 'utils',
    'PowdercloudDateSelector.js': 'utils',
    'PowdercloudFilterPanel.js': 'utils',
    'PowdercloudSnowProfileGraph.js': 'utils',
    'PowdercloudSvgSnowprofile.js': 'utils', # Added this one as it seems to be a util/svg helper
    'PowdercloudValidators.js': 'utils',
    
    # Forms (From flat components list)
    'PowdercloudAvalancheForm.js': 'forms',
    'PowdercloudNewsForm.js': 'forms',
    'PowdercloudOperationForm.js': 'forms',
    'PowdercloudPartyForm.js': 'forms',
    'PowdercloudRoleForm.js': 'forms',
    'PowdercloudSnowpackForm.js': 'forms',
    'PowdercloudStabilityForm.js': 'forms',
    'PowdercloudWeatherForm.js': 'forms',
    
    # Grids (From flat components list)
    'PowdercloudAvalancheGrid.js': 'grids',
    'PowdercloudNewsGrid.js': 'grids',
    'PowdercloudObservationTypeListGrid.js': 'grids',
    'PowdercloudOperationListGrid.js': 'grids',
    'PowdercloudPartyListGrid.js': 'grids',
    'PowdercloudRoleListGrid.js': 'grids',
    'PowdercloudSnowpackGrid.js': 'grids',
    'PowdercloudStabilityGrid.js': 'grids',
    'PowdercloudTerrainAtlasGrid.js': 'grids',
    'PowdercloudWeatherGrid.js': 'grids',
    
    # Charts (From flat components list - likely need to check if they are in components/charts or components root)
    'PowdercloudFailureTypesChart.js': 'charts',
    'PowdercloudSeasonalChart.js': 'charts',
    'PowdercloudSkyConditionsChart.js': 'charts',
    'PowdercloudSnowpackHeightChart.js': 'charts',
    'PowdercloudTemperatureRangeChart.js': 'charts',
    'PowdercloudTriggerTypesChart.js': 'charts',
    'PowdercloudWindSpeedChart.js': 'charts',
}

# Add all Page components
for filename in os.listdir(BASE_DIR):
    if filename.endswith('Page.js'):
        MAPPING[filename] = 'pages'

def move_files():
    # Ensure categories exist
    categories = set(MAPPING.values())
    for category in categories:
        cat_path = os.path.join(BASE_DIR, category)
        if not os.path.exists(cat_path):
            print(f"Creating directory: {category}")
            os.makedirs(cat_path)

    # Move files
    for filename, category in MAPPING.items():
        # Source could be in BASE_DIR (for pages) or COMPONENTS_DIR (for components)
        
        src_path_base = os.path.join(BASE_DIR, filename)
        src_path_comp = os.path.join(COMPONENTS_DIR, filename)
        
        # Check charts special case (if valid)
        src_path_charts = os.path.join(COMPONENTS_DIR, 'charts', filename) # Hypothetical

        if os.path.exists(src_path_base):
            src = src_path_base
        elif os.path.exists(src_path_comp):
            src = src_path_comp
        elif os.path.exists(src_path_charts):
            src = src_path_charts
        else:
            print(f"File not found: {filename} (Skipping)")
            continue
            
        dst = os.path.join(BASE_DIR, category, filename)
        
        print(f"Moving {filename} to {category}/")
        shutil.move(src, dst)

    # Check for remaining files in components dir
    if os.path.exists(COMPONENTS_DIR):
        print("\nChecking remaining files in components/...")
        for root, dirs, files in os.walk(COMPONENTS_DIR):
            for file in files:
                print(f"Remaining: {os.path.join(root, file)}")

if __name__ == "__main__":
    move_files()
