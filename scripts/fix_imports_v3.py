
import os
import re

BASE_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public/js/lit'
MAPPING_FILE = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/document/COMPONENT_MAPPING.md'

def load_rename_map():
    """Parses COMPONENT_MAPPING.md to get OldFileName -> NewFileName map."""
    rename_map = {}
    with open(MAPPING_FILE, 'r') as f:
        lines = f.readlines()
    
    # Simple parsing logic looking for table rows
    # | AppButton.js | ... | PowdercloudButton.js | ...
    for line in lines:
        if line.strip().startswith('|') and '.js' in line:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 5:
                # parts[0] is empty, parts[1] is OldFileName, parts[3] is NewFileName
                old_name = parts[1]
                new_name = parts[3]
                if old_name.endswith('.js') and new_name.endswith('.js'):
                    rename_map[old_name] = new_name
                    
    # Add page renames if implicitly defined or use logic
    # The MD says: "pages (Already organized)". "DashboardPage.js -> <powdercloud-dashboard-page>"
    # It does NOT say DashboardPage.js -> PowdercloudDashboardPage.js
    # But wait, looking at file list, they are STILL named DashboardPage.js.
    # So pages were NOT renamed in file system, only their tags are proposed to be renamed.
    # So I don't need to rename page files import-side, unless they are imported.
    
    return rename_map

def build_file_inventory():
    """Walks BASE_DIR and returns dict {filename: absolute_path}."""
    inventory = {}
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith('.js'):
                inventory[file] = os.path.join(root, file)
    return inventory

def process_file(file_path, inventory, rename_map):
    with open(file_path, 'r') as f:
        content = f.read()
    
    new_content = content
    
    # Regex to capture import paths
    # import ... from 'PATH';
    # import 'PATH';
    # path could be single or double quoted
    
    # We use a primitive approach: iterate line by line to modify safely
    lines = content.split('\n')
    new_lines = []
    modified = False
    
    for line in lines:
        # Check for import
        match = re.search(r"import\s+(?:.*?from\s+)?['\"](.*?)['\"]", line)
        if match:
            original_path = match.group(1)
            
            # Identify filename
            filename = os.path.basename(original_path)
            
            # Skip non-relative imports (libraries)
            if original_path.startswith('http') or not original_path.startswith('.'):
                new_lines.append(line)
                continue
            
            # Handle rename
            target_filename = filename
            if filename in rename_map:
                target_filename = rename_map[filename]
            
            # Find target in inventory
            if target_filename in inventory:
                target_abs_path = inventory[target_filename]
                
                # Compute new relative path
                current_dir = os.path.dirname(file_path)
                new_rel_path = os.path.relpath(target_abs_path, current_dir)
                
                # Ensure it starts with ./ or ../
                if not new_rel_path.startswith('.'):
                    new_rel_path = './' + new_rel_path
                
                # Reconstruct line
                # Careful not to replace other parts of line
                quote = "'" if "'" in line else '"'
                
                # We need to replace the content inside quotes
                # But line might have multiple quotes. Import is usually specific structure.
                # Let's replace the captured group in the match
                
                # Use string replace for the specific path?
                # A bit risky if path appears twice (unlikely in import line).
                
                # Better: slice and dice based on match indices? 
                # re.search gives span.
                
                start, end = match.span(1) # Span of the path group
                new_line_content = line[:start] + new_rel_path + line[end:]
                
                new_lines.append(new_line_content)
                if new_line_content != line:
                    modified = True
                    # print(f"Fixed: {original_path} -> {new_rel_path} in {os.path.basename(file_path)}")
            else:
                # File not found in inventory (maybe it was deleted or I don't have it)
                # print(f"Warning: Could not resolve {target_filename} code referenced in {os.path.basename(file_path)}")
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    if modified:
        with open(file_path, 'w') as f:
            f.write('\n'.join(new_lines))
        return True
    return False

def main():
    rename_map = load_rename_map()
    inventory = build_file_inventory()
    
    print(f"Inventory size: {len(inventory)} files.")
    print(f"Rename map size: {len(rename_map)} entries.")
    
    count = 0
    for file_path in inventory.values():
        if process_file(file_path, inventory, rename_map):
            count += 1
            print(f"Updated {os.path.basename(file_path)}")
            
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    main()
