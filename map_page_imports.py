import os
import re

PAGES_DIR = "public/js/lit/pages"

def scan_imports():
    print("| Page | Imports |")
    print("| :--- | :--- |")
    
    # Walk through pages directory
    for root, dirs, files in os.walk(PAGES_DIR):
        for file in files:
            if file.endswith(".js"):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, PAGES_DIR)
                
                imports = []
                with open(filepath, 'r') as f:
                    for line in f:
                        # Look for imports of App* or other mapped components
                        # Regex captures the filename from: import ... '../AppButton.js'
                        match = re.search(r"import\s+.*['\"](?:\.\./)+([^'\"]+)\.js['\"]", line)
                        if match:
                            comp_name = match.group(1)
                            # Filter only known UI components + Utils (heuristic: starts with App, or is in our mapping list)
                            # Detailed filter:
                            if comp_name.startswith("App") or comp_name in ["AvalancheRose", "Breadcrumbs", "CollapsiblePanel", "ComponentDoc", "DashboardChart", "DashboardGrid", "DateSelector", "FilterPanel", "MegaMenu", "SnowProfileGraph", "Validators"]:
                                imports.append(comp_name)
                
                if imports:
                    # Sort and join for readability
                    imports = sorted(list(set(imports)))
                    import_str = ", ".join(imports)
                    print(f"| `{rel_path}` | {import_str} |")

if __name__ == "__main__":
    scan_imports()
