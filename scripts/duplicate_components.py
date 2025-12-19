import os
import re

# Mapping of original filename -> (new filename, old class, new class, old tag, new tag)
# Based on the user's COMPONENT_MAPPING.md
MAPPING = [
    ("AppAlert.js", "PowdercloudAlert.js", "AppAlert", "PowdercloudAlert", "app-alert", "powdercloud-alert"),
    ("AppAvatar.js", "PowdercloudAvatar.js", "AppAvatar", "PowdercloudAvatar", "app-avatar", "powdercloud-avatar"),
    ("Breadcrumbs.js", "PowdercloudBreadcrumbs.js", "Breadcrumbs", "PowdercloudBreadcrumbs", "app-breadcrumbs", "powdercloud-breadcrumbs"),
    ("AppButton.js", "PowdercloudButton.js", "AppButton", "PowdercloudButton", "app-button", "powdercloud-button"),
    ("AppCard.js", "PowdercloudCard.js", "AppCard", "PowdercloudCard", "app-card", "powdercloud-card"),
    ("AppCheckbox.js", "PowdercloudCheckbox.js", "AppCheckbox", "PowdercloudCheckbox", "app-checkbox", "powdercloud-checkbox"),
    ("AppChip.js", "PowdercloudChip.js", "AppChip", "PowdercloudChip", "app-chip", "powdercloud-chip"),
    ("AppCombobox.js", "PowdercloudCombobox.js", "AppCombobox", "PowdercloudCombobox", "app-combobox", "powdercloud-combobox"),
    ("AppContainer.js", "PowdercloudContainer.js", "AppContainer", "PowdercloudContainer", "app-container", "powdercloud-container"),
    ("AppDateRange.js", "PowdercloudDateRange.js", "AppDateRange", "PowdercloudDateRange", "app-date-range", "powdercloud-date-range"),
    ("AppDisclaimer.js", "PowdercloudDisclaimer.js", "AppDisclaimer", "PowdercloudDisclaimer", "app-disclaimer", "powdercloud-disclaimer"),
    ("AppDivider.js", "PowdercloudDivider.js", "AppDivider", "PowdercloudDivider", "app-divider", "powdercloud-divider"),
    ("AppFieldset.js", "PowdercloudFieldset.js", "AppFieldset", "PowdercloudFieldset", "app-fieldset", "powdercloud-fieldset"),
    ("AppFileUpload.js", "PowdercloudFileUpload.js", "AppFileUpload", "PowdercloudFileUpload", "app-file-upload", "powdercloud-file-upload"),
    ("AppFooter.js", "PowdercloudFooter.js", "AppFooter", "PowdercloudFooter", "app-footer", "powdercloud-footer"),
    ("AppGrid.js", "PowdercloudGrid.js", "AppGrid", "PowdercloudGrid", "app-grid", "powdercloud-grid"),
    ("AppHeader.js", "PowdercloudHeader.js", "AppHeader", "PowdercloudHeader", "app-header", "powdercloud-header"),
    ("AppInput.js", "PowdercloudInput.js", "AppInput", "PowdercloudInput", "app-input", "powdercloud-input"),
    ("AppLayout.js", "PowdercloudLayout.js", "AppLayout", "PowdercloudLayout", "app-layout", "powdercloud-layout"),
    ("AppLookup.js", "PowdercloudLookup.js", "AppLookup", "PowdercloudLookup", "app-lookup", "powdercloud-lookup"),
    ("AppModal.js", "PowdercloudModal.js", "AppModal", "PowdercloudModal", "app-modal", "powdercloud-modal"),
    ("AppProgress.js", "PowdercloudProgress.js", "AppProgress", "PowdercloudProgress", "app-progress", "powdercloud-progress"),
    ("AppRadio.js", "PowdercloudRadio.js", "AppRadio", "PowdercloudRadio", "app-radio", "powdercloud-radio"),
    ("AppRichText.js", "PowdercloudRichText.js", "AppRichText", "PowdercloudRichText", "app-rich-text", "powdercloud-rich-text"),
    ("AppSelect.js", "PowdercloudSelect.js", "AppSelect", "PowdercloudSelect", "app-select", "powdercloud-select"),
    ("AppSpacer.js", "PowdercloudSpacer.js", "AppSpacer", "PowdercloudSpacer", "app-spacer", "powdercloud-spacer"),
    ("AppStack.js", "PowdercloudStack.js", "AppStack", "PowdercloudStack", "app-stack", "powdercloud-stack"),
    ("AppSwitch.js", "PowdercloudSwitch.js", "AppSwitch", "PowdercloudSwitch", "app-switch", "powdercloud-switch"),
    ("AppTabs.js", "PowdercloudTabs.js", "AppTabs", "PowdercloudTabs", "app-tabs", "powdercloud-tabs"),
    ("AppTextarea.js", "PowdercloudTextarea.js", "AppTextarea", "PowdercloudTextarea", "app-textarea", "powdercloud-textarea"),
    ("AppToast.js", "PowdercloudToast.js", "AppToast", "PowdercloudToast", "app-toast", "powdercloud-toast"),
    ("AppTooltip.js", "PowdercloudTooltip.js", "AppTooltip", "PowdercloudTooltip", "app-tooltip", "powdercloud-tooltip"),
    ("AvalancheRose.js", "PowdercloudAvalancheRose.js", "AvalancheRose", "PowdercloudAvalancheRose", "avalanche-rose", "powdercloud-avalanche-rose"),
    ("CollapsiblePanel.js", "PowdercloudCollapsiblePanel.js", "CollapsiblePanel", "PowdercloudCollapsiblePanel", "collapsible-panel", "powdercloud-collapsible-panel"),
    ("ComponentDoc.js", "PowdercloudComponentDoc.js", "ComponentDoc", "PowdercloudComponentDoc", "component-doc", "powdercloud-component-doc"),
    ("DashboardChart.js", "PowdercloudDashboardChart.js", "DashboardChart", "PowdercloudDashboardChart", "dashboard-chart", "powdercloud-dashboard-chart"),
    ("DashboardGrid.js", "PowdercloudDashboardGrid.js", "DashboardGrid", "PowdercloudDashboardGrid", "dashboard-grid", "powdercloud-dashboard-grid"),
    ("DateSelector.js", "PowdercloudDateSelector.js", "DateSelector", "PowdercloudDateSelector", "date-selector", "powdercloud-date-selector"),
    ("FilterPanel.js", "PowdercloudFilterPanel.js", "FilterPanel", "PowdercloudFilterPanel", "filter-panel", "powdercloud-filter-panel"),
    ("MegaMenu.js", "PowdercloudMegaMenu.js", "MegaMenu", "PowdercloudMegaMenu", "mega-menu", "powdercloud-mega-menu"),
    ("SnowProfileGraph.js", "PowdercloudSnowProfileGraph.js", "SnowProfileGraph", "PowdercloudSnowProfileGraph", "snow-profile-graph", "powdercloud-snow-profile-graph"),
    ("Validators.js", "PowdercloudValidators.js", "Validators", "PowdercloudValidators", "validators", "powdercloud-validators"),
]

BASE_DIR = "public/js/lit"

def duplicate_and_rename():
    print(f"Starting duplication in {BASE_DIR}...")
    
    for old_file, new_file, old_class, new_class, old_tag, new_tag in MAPPING:
        old_path = os.path.join(BASE_DIR, old_file)
        new_path = os.path.join(BASE_DIR, new_file)
        
        if not os.path.exists(old_path):
            print(f"Skipping {old_file}: File not found.")
            continue
            
        with open(old_path, 'r') as f:
            content = f.read()
            
        # 1. Replace Class Name
        # Check if class exists to avoid blind replacement errors
        if old_class not in content:
            print(f"Warning: Class {old_class} not found in {old_file}")
            
        content = content.replace(f"class {old_class}", f"class {new_class}")
        content = content.replace(f"export class {new_class}", f"export class {new_class}") # Handle export class
        
        # 2. Replace Tag Name in define
        # Look for customElements.define('old-tag', ClassName)
        # Using regex to differ single/double quotes
        pattern = re.compile(f"customElements\.define\((['\"]){old_tag}(['\"]), {new_class}\);")
        replacement = f"customElements.define('{new_tag}', {new_class});"
        
        # We replaced the class name in memory already, so the define line likely reads:
        # customElements.define('old-tag', NewClass);
        # So we search for that.
        
        legacy_define_pattern = re.compile(f"customElements\.define\((['\"]){old_tag}(['\"]), {new_class}\)")
        
        if legacy_define_pattern.search(content):
             content = legacy_define_pattern.sub(f"customElements.define('{new_tag}', {new_class})", content)
        else:
             # Fallback: maybe the last replacement didn't work on the define line if it referenced the old class
             # let's try searching for the old class name in the define just in case
             fallback_pattern = re.compile(f"customElements\.define\((['\"]){old_tag}(['\"]), {old_class}\)")
             if fallback_pattern.search(content):
                  content = fallback_pattern.sub(f"customElements.define('{new_tag}', {new_class})", content)
             else:
                  print(f"Warning: Could not auto-replace customElements.define in {old_file}")

        # 3. Write New File
        with open(new_path, 'w') as f:
            f.write(content)
            
        print(f"Created {new_file}")

if __name__ == "__main__":
    duplicate_and_rename()
