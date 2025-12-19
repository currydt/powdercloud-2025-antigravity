
import os
import re

PUBLIC_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public/js/lit'
MAPPING_FILE = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/document/COMPONENT_MAPPING.md'

def load_mapping():
    mappings = []
    with open(MAPPING_FILE, 'r') as f:
        lines = f.readlines()
    
    for line in lines:
        if line.strip().startswith('|') and '.js' in line:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 6:
                old_tag_raw = parts[2].replace('`', '').replace('<', '').replace('>', '')
                new_tag_raw = parts[4].replace('`', '').replace('<', '').replace('>', '')
                
                if old_tag_raw and new_tag_raw and old_tag_raw != '❌':
                    mappings.append({
                        'old_tag': old_tag_raw,
                        'new_tag': new_tag_raw
                    })
    return mappings

def process_js_files(mappings):
    count = 0
    for root, dirs, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith('.js'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    content = f.read()
                
                new_content = content
                modified_file = False
                
                for m in mappings:
                    # Replace Open Tag: <app-btn or <app-btn>
                    pattern_tag_open = re.compile(rf'<{re.escape(m["old_tag"])}(\s|>)')
                    if pattern_tag_open.search(new_content):
                            new_content = pattern_tag_open.sub(rf'<{m["new_tag"]}\1', new_content)
                            modified_file = True
                            
                    # Replace Close Tag: </app-btn>
                    pattern_tag_close = re.compile(rf'</{re.escape(m["old_tag"])}>')
                    if pattern_tag_close.search(new_content):
                            new_content = pattern_tag_close.sub(rf'</{m["new_tag"]}>', new_content)
                            modified_file = True
                            
                if modified_file:
                    print(f"Updating tags in {file}")
                    with open(file_path, 'w') as f:
                        f.write(new_content)
                    count += 1
                    
    print(f"Total JS files updated: {count}")

def main():
    mappings = load_mapping()
    print(f"Loaded {len(mappings)} mappings.")
    process_js_files(mappings)

if __name__ == "__main__":
    main()
