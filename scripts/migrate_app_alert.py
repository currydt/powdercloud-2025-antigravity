import os

# Configuration for this run
OLD_COMPONENT = "AppAlert.js"
NEW_COMPONENT = "PowdercloudAlert.js"
OLD_TAG = "app-alert"
NEW_TAG = "powdercloud-alert"

FILES_TO_CHECK = [
    "public/js/lit/ComponentsPage.js",
    "public/js/lit/DesignSystemArchitecturePage.js",
    "public/js/lit/DesignSystemCorePage.js"
]

def migrate_component():
    print(f"Migrating {OLD_COMPONENT} -> {NEW_COMPONENT}...")
    
    for filepath in FILES_TO_CHECK:
        if not os.path.exists(filepath):
            print(f"Skipping {filepath} (not found)")
            continue
            
        with open(filepath, 'r') as f:
            content = f.read()
            
        new_content = content
        
        # 1. Update Import
        # Look for import ... from './components/AppAlert.js' (or variants)
        # We know they are flattened now so they should be './components/AppAlert.js'
        new_content = new_content.replace(f"./components/{OLD_COMPONENT}", f"./components/{NEW_COMPONENT}")
        
        # 2. Update Tag
        new_content = new_content.replace(f"<{OLD_TAG}", f"<{NEW_TAG}")
        new_content = new_content.replace(f"</{OLD_TAG}>", f"</{NEW_TAG}>")
        
        # 3. Update Class Usage? (Less common in HTML templates but possible)
        # Keeping it simple mostly updates imports and tags.
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
        else:
            print(f"No changes in {filepath}")

if __name__ == "__main__":
    migrate_component()
