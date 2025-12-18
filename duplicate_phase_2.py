import os
import re

# Components to duplicate (The ones missing from previous step)
# Format: (OriginalFile, OriginalClass, OriginalTag) - WE AUTO-DERIVE DESTINATION
MISSING_COMPONENTS = [
    ("AvalancheForm.js", "AvalancheForm", "avalanche-form"),
    ("AvalancheGrid.js", "AvalancheGrid", "avalanche-grid"),
    ("FailureTypesChart.js", "FailureTypesChart", "failure-types-chart"),
    ("NewsForm.js", "NewsForm", "news-form"),
    ("NewsGrid.js", "NewsGrid", "news-grid"),
    ("ObservationTypeListGrid.js", "ObservationTypeListGrid", "observation-type-list-grid"),
    ("OperationForm.js", "OperationForm", "operation-form"),
    ("OperationListGrid.js", "OperationListGrid", "operation-list-grid"),
    ("PartyForm.js", "PartyForm", "party-form"),
    ("PartyListGrid.js", "PartyListGrid", "party-list-grid"),
    ("RoleForm.js", "RoleForm", "role-form"),
    ("RoleListGrid.js", "RoleListGrid", "role-list-grid"),
    ("SeasonalChart.js", "SeasonalChart", "seasonal-chart"),
    ("SkyConditionsChart.js", "SkyConditionsChart", "sky-conditions-chart"),
    ("SnowpackForm.js", "SnowpackForm", "snowpack-form"),
    ("SnowpackGrid.js", "SnowpackGrid", "snowpack-grid"),
    ("SnowpackHeightChart.js", "SnowpackHeightChart", "snowpack-height-chart"),
    ("StabilityForm.js", "StabilityForm", "stability-form"),
    ("StabilityGrid.js", "StabilityGrid", "stability-grid"),
    ("TemperatureRangeChart.js", "TemperatureRangeChart", "temperature-range-chart"),
    ("TerrainAtlasGrid.js", "TerrainAtlasGrid", "terrain-atlas-grid"),
    ("TriggerTypesChart.js", "TriggerTypesChart", "trigger-types-chart"),
    ("WeatherForm.js", "WeatherForm", "weather-form"),
    ("WeatherGrid.js", "WeatherGrid", "weather-grid"),
    ("WindSpeedChart.js", "WindSpeedChart", "wind-speed-chart")
]

BASE_DIR = "public/js/lit/components"

def duplicate_missing():
    print(f"Starting duplication phase 2 in {BASE_DIR}...")
    
    new_components = []

    for old_file, old_class, old_tag in MISSING_COMPONENTS:
        old_path = os.path.join(BASE_DIR, old_file)
        
        # New Name Logic: Just prepend Powdercloud
        new_file = "Powdercloud" + old_file
        new_class = "Powdercloud" + old_class
        new_tag = "powdercloud-" + old_tag
        
        new_path = os.path.join(BASE_DIR, new_file)
        
        if not os.path.exists(old_path):
            print(f"Skipping {old_file}: File not found.")
            continue
            
        with open(old_path, 'r') as f:
            content = f.read()
            
        # 1. Replace Class Name
        # Check integrity
        if f"class {old_class}" not in content:
            print(f"Warning: class {old_class} definition not found in {old_file}")

        content = content.replace(f"class {old_class}", f"class {new_class}")
        content = content.replace(f"export class {new_class}", f"export class {new_class}") # Handle export
        
        # 2. Replace Tag Name in define
        # Regex to handle quotes
        pattern_dq = re.compile(f"customElements\.define\(\"{old_tag}\",\s*{new_class}\)")
        pattern_sq = re.compile(f"customElements\.define\('{old_tag}',\s*{new_class}\)")
        
        if pattern_dq.search(content):
            content = pattern_dq.sub(f"customElements.define(\"{new_tag}\", {new_class})", content)
        elif pattern_sq.search(content):
            content = pattern_sq.sub(f"customElements.define('{new_tag}', {new_class})", content)
        else:
            # Fallback for old class reference
            pattern_old_ref = re.compile(f"customElements\.define\(['\"]{old_tag}['\"],\s*{old_class}\)")
            if pattern_old_ref.search(content):
                 content = pattern_old_ref.sub(f"customElements.define('{new_tag}', {new_class})", content)
            else:
                 print(f"Warning: Could not auto-replace customElements.define in {old_file}")

        # 3. Write New File
        with open(new_path, 'w') as f:
            f.write(content)
            
        new_components.append((new_file, new_tag))
        print(f"Created {new_file}")

    # Generate Table
    print("\n\n# New Powdercloud Components (Phase 2)\n")
    print("| New File | New Tag |")
    print("| :--- | :--- |")
    for f, t in new_components:
        print(f"| `{f}` | `<{t}>` |")

if __name__ == "__main__":
    duplicate_missing()
