import os
import re

# Directories to scan and update
DIRECTORIES = [
    "public/js/lit/pages",
    "public/js/lit/charts",
    "public/js/lit/forms",
    "public/js/lit/grids"
]

# Components that were moved to "public/js/lit/components"
# These are the files we need to update references to.
# We can detect them by checking if the import target is an App* file or known utility.
MOVED_COMPONENTS = [
    "AppAlert.js", "AppAvatar.js", "AppButton.js", "AppCard.js", "AppCheckbox.js", 
    "AppChip.js", "AppCombobox.js", "AppContainer.js", "AppDateRange.js", "AppDisclaimer.js", 
    "AppDivider.js", "AppFieldset.js", "AppFileUpload.js", "AppFooter.js", "AppGrid.js", 
    "AppHeader.js", "AppInput.js", "AppLayout.js", "AppLookup.js", "AppModal.js", 
    "AppProgress.js", "AppRadio.js", "AppRichText.js", "AppSelect.js", "AppSpacer.js", 
    "AppStack.js", "AppSwitch.js", "AppTabs.js", "AppTextarea.js", "AppToast.js", 
    "AppTooltip.js", "AvalancheRose.js", "Breadcrumbs.js", "CollapsiblePanel.js", 
    "ComponentDoc.js", "DashboardChart.js", "DashboardGrid.js", "DateSelector.js", 
    "FilterPanel.js", "MegaMenu.js", "SnowProfileGraph.js", "Validators.js"
]

def update_imports():
    print("Starting import update...")
    
    for directory in DIRECTORIES:
        if not os.path.exists(directory):
            print(f"Skipping {directory} (not found)")
            continue

        print(f"Processing {directory}...")
        for filename in os.listdir(directory):
            if not filename.endswith(".js"):
                continue

            filepath = os.path.join(directory, filename)
            
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content
            
            # Regex to find imports
            # We look for: import ... from 'PATH';
            # We want to catch paths that look like '../AppButton.js' or '../../AppButton.js'
            # And change them to '../components/AppButton.js' (since pages/charts/forms/grids are all 1 level deep from 'lit')
            
            # Note: All target directories (pages, charts, forms, grids) are direct children of public/js/lit/
            # So the correct path to components is ALWAYS "../components/ComponentName.js"
            
            def replace_callback(match):
                path = match.group(1)
                for component in MOVED_COMPONENTS:
                     # Check if the path ends with our component name
                     if path.endswith(component):
                         # If it's already pointing to components, ignore (idempotence)
                         if "components/" in path:
                             return match.group(0)
                         
                         return f"from '../components/{component}'"
                
                return match.group(0)

            # Match: from '...';   (Capture the path inside quotes)
            # Use strict regex to avoid messing up other imports
            new_content = re.sub(r"from\s+['\"]([^'\"]+)['\"]", replace_callback, new_content)

            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filename}")

if __name__ == "__main__":
    update_imports()
