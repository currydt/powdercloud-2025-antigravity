import os
import re

COMPONENTS_DIR = "public/js/lit/components"
PAGES_DIR = "public/js/lit/pages"

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
            
        def replace_import(match):
            full_str = match.group(0) 
            path = match.group(2) # Group 2 is the path
            
            basename = os.path.basename(path)
            
            if basename in ALL_COMPONENTS:
                return full_str.replace(path, f"../components/{basename}")
            
            return full_str

        # Matches: import ... from '...'; OR import '...';
        # Group 1: Optional " ... from"
        # Group 2: The Path
        new_content = re.sub(r"import(\s+.*from)?\s+['\"]([^'\"]+)['\"]", replace_import, content)
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")

if __name__ == "__main__":
    fix_pages()
