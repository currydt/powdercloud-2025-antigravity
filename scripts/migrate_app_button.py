import os

# Configuration for this run (AppButton)
OLD_COMPONENT = "AppButton.js"
NEW_COMPONENT = "PowdercloudButton.js"
OLD_TAG = "app-button"
NEW_TAG = "powdercloud-button"

# Found via grep
FILES_TO_CHECK = [
    "public/js/lit/ComponentsPage.js",
    "public/js/lit/DesignSystemAtomsPage.js",
    "public/js/lit/DesignSystemFeedbackPage.js",
    "public/js/lit/DesignSystemFormsPage.js",
    "public/js/lit/DesignSystemLayoutPage.js",
    "public/js/lit/DesignSystemOverlaysPage.js"
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
        new_content = new_content.replace(f"./components/{OLD_COMPONENT}", f"./components/{NEW_COMPONENT}")
        
        # 2. Update Tag
        new_content = new_content.replace(f"<{OLD_TAG}", f"<{NEW_TAG}")
        new_content = new_content.replace(f"</{OLD_TAG}>", f"</{NEW_TAG}>")
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath}")

if __name__ == "__main__":
    migrate_component()
