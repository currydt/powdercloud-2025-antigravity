
import os

FORMS_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public/js/lit/forms'

def fix_forms_imports():
    if not os.path.exists(FORMS_DIR):
        print("Forms directory not found")
        return

    for file in os.listdir(FORMS_DIR):
        if file.endswith('.js'):
            filepath = os.path.join(FORMS_DIR, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = content
            
            # Fix Tabs import
            new_content = new_content.replace(
                "import 'PowdercloudTabs.js';", 
                "import '../navigation/PowdercloudTabs.js';"
            )
            
            # Fix Lookup import
            new_content = new_content.replace(
                "import 'PowdercloudLookup.js';", 
                "import '../data-display/PowdercloudLookup.js';"
            )

            # Fix Breadcrumbs import if present (common in pages, maybe forms?)
            new_content = new_content.replace(
                "import 'PowdercloudBreadcrumbs.js';", 
                "import '../navigation/PowdercloudBreadcrumbs.js';"
            )

            if new_content != content:
                print(f"Fixed {file}")
                with open(filepath, 'w') as f:
                    f.write(new_content)

if __name__ == "__main__":
    fix_forms_imports()
