
import os
import re

GRIDS_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public/js/lit/grids'

def to_kebab_case(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()

def fix_grid_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    new_content = content
    
    # 1. Fix DashboardGrid import
    new_content = new_content.replace(
        "import 'PowdercloudDashboardGrid.js';", 
        "import '../utils/PowdercloudDashboardGrid.js';"
    )
    
    # 2. Fix Modal import
    new_content = new_content.replace(
        "import 'PowdercloudModal.js';", 
        "import '../containment/PowdercloudModal.js';"
    )
    
    # 3. Fix Form Import and deduce tag
    # Match: import 'forms/Something.js';
    form_match = re.search(r"import 'forms/([a-zA-Z0-9]+)\.js';", new_content)
    
    if form_match:
        form_name = form_match.group(1) # e.g. WeatherForm
        
        # Replace import
        # Note: We renamed forms to Powdercloud[Name].js
        # So forms/WeatherForm.js -> ../forms/PowdercloudWeatherForm.js
        new_import = f"import '../forms/Powdercloud{form_name}.js';"
        new_content = new_content.replace(f"import 'forms/{form_name}.js';", new_import)
        
        # Calculate new tag name
        # WeatherForm -> weather-form -> powdercloud-weather-form
        kebab_name = to_kebab_case(form_name)
        new_tag = f"powdercloud-{kebab_name}"
        
        # Fix the broken tag <forms/
        # There might be a closing tag </forms/> too? 
        # In Step 216: ></forms/>
        
        new_content = new_content.replace('<forms/', f'<{new_tag}')
        new_content = new_content.replace('></forms/>', f'></{new_tag}>')
        new_content = new_content.replace('</forms/>', f'</{new_tag}>')
    
    if new_content != content:
        print(f"Fixed {os.path.basename(file_path)}")
        with open(file_path, 'w') as f:
            f.write(new_content)

def main():
    if not os.path.exists(GRIDS_DIR):
        print("Grids dir not found")
        return

    for file in os.listdir(GRIDS_DIR):
        if file.endswith('.js'):
            fix_grid_file(os.path.join(GRIDS_DIR, file))

if __name__ == "__main__":
    main()
