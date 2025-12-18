import os
import re

COMPONENTS_DIR = "public/js/lit/components"
PAGES_DIR = "public/js/lit/pages"

# Get a list of all files now in components
# We will use this to verify if an import target is indeed a moved component
ALL_COMPONENTS = set()
for f in os.listdir(COMPONENTS_DIR):
    if f.endswith(".js"):
        ALL_COMPONENTS.add(f)

def fix_pages():
    print("Fixing imports in PAGES...")
    for filename in os.listdir(PAGES_DIR):
        if not filename.endswith(".js"): continue
        
        filepath = os.path.join(PAGES_DIR, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Regex to find imports with relative paths
        # We want to change ANY import of a file that is in ALL_COMPONENTS to "../components/Filename.js"
        # Example match:  import ... from '../AppButton.js'  -> import ... from '../components/AppButton.js'
        # Example match:  import ... from '../../AppButton.js' -> import ... from '../components/AppButton.js'
        # Example match:  import ... from '../charts/SomeChart.js' -> import ... from '../components/SomeChart.js'
        
        def replace_import(match):
            full_str = match.group(0) # e.g. from '../AppButton.js'
            path = match.group(1)     # e.g. ../AppButton.js
            
            # Extract just the filename from the path
            basename = os.path.basename(path)
            
            if basename in ALL_COMPONENTS:
                # If the file exists in our new components dir, point to it correctly
                # Pages are in "public/js/lit/pages", components are in "public/js/lit/components"
                # So relative path is "../components/<File>"
                return f"from '../components/{basename}'"
            
            return full_str # No change if not a known component

        # Match: from '...';
        new_content = re.sub(r"from\s+['\"]([^'\"]+)['\"]", replace_import, content)
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")

def fix_components():
    print("Fixing imports in COMPONENTS...")
    for filename in os.listdir(COMPONENTS_DIR):
        if not filename.endswith(".js"): continue
        
        filepath = os.path.join(COMPONENTS_DIR, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Example: Component A imports Component B.
        # Old: import ... from '../DashboardChart.js' (if A was in charts/)
        # New: import ... from './DashboardChart.js' (since they are now siblings)
        
        def replace_sibling_import(match):
            full_str = match.group(0)
            path = match.group(1)
            basename = os.path.basename(path)
            
            if basename in ALL_COMPONENTS:
                # They are siblings now
                return f"from './{basename}'"
            
            # Special case: lit-core.min.js is external
            if "lit-core.min.js" in path:
                return full_str

            return full_str

        new_content = re.sub(r"from\s+['\"]([^'\"]+)['\"]", replace_sibling_import, content)
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")

if __name__ == "__main__":
    fix_pages()
    fix_components()
