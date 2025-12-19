
import os
import re

PUBLIC_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public'
MAPPING_FILE = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/document/COMPONENT_MAPPING.md'

def load_mapping():
    """
    Parses COMPONENT_MAPPING.md.
    Returns a list of dicts: {'old_file': '...', 'new_file': '...', 'old_tag': '...', 'new_tag': '...', 'category': '...'}
    """
    mappings = []
    with open(MAPPING_FILE, 'r') as f:
        lines = f.readlines()
    
    # Table row format: | OldFileName | OldTagName | NewFileName | NewTagName | TargetCategory | ...
    for line in lines:
        if line.strip().startswith('|') and '.js' in line:
            parts = [p.strip() for p in line.split('|')]
            # parts indices: 1=OldFile, 2=OldTag, 3=NewFile, 4=NewTag, 5=TargetCategory
            if len(parts) >= 6:
                old_file = parts[1]
                old_tag_raw = parts[2].replace('`', '').replace('<', '').replace('>', '') # Clean <tag> to tag
                new_file = parts[3]
                new_tag_raw = parts[4].replace('`', '').replace('<', '').replace('>', '')
                category_raw = parts[5].replace('/', '') # Clean 'layout/' to 'layout'
                
                if old_file and new_file:
                    mappings.append({
                        'old_file': old_file,
                        'new_file': new_file,
                        'old_tag': old_tag_raw,
                        'new_tag': new_tag_raw,
                        'category': category_raw
                    })
    return mappings

def process_html_files(mappings):
    count = 0
    # Walk through all files in public
    for root, dirs, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    content = f.read()
                
                new_content = content
                modified_file = False
                
                for m in mappings:
                    # 1. Replace Imports/Script Srcs
                    # We look for /js/lit/OldFile by simple string replacement to be safe? 
                    # Or regex? Simple string likely works for full paths.
                    # Patterns to check:
                    # "/js/lit/AppLayout.js" -> "/js/lit/layout/PowdercloudLayout.js"
                    # "../js/lit/AppLayout.js" -> ...
                    
                    # We can use regex to be more flexible with the prefix path
                    # Search for ends with /OldFile
                    
                    # Regex for src="..."
                    # matching src=".../AppLayout.js"
                    esc_old_file = re.escape(m['old_file'])
                    
                    # Replacement path part: "/Category/NewFile"
                    # We keep the prefix before the filename
                    # BUT wait, the structure changed depth. 
                    # Old: /js/lit/AppLayout.js
                    # New: /js/lit/layout/PowdercloudLayout.js
                    # So we insert the category folder.
                    
                    # Regex pattern: capture everything up to js/lit/ then filename
                    # src=".../js/lit/AppLayout.js"
                    
                    pattern_src = re.compile(rf'(src=["\'].*/js/lit/){esc_old_file}(["\'])')
                    
                    def replace_src(match):
                        prefix = match.group(1) # e.g. src="/js/lit/
                        suffix = match.group(2) # "
                        # Check if category is already there? No, we assume it wasn't
                        return f'{prefix}{m["category"]}/{m["new_file"]}{suffix}'
                        
                    if pattern_src.search(new_content):
                        new_content = pattern_src.sub(replace_src, new_content)
                        modified_file = True

                    # 2. Replace Tags
                    # <app-layout> -> <powdercloud-layout>
                    # </app-layout> -> </powdercloud-layout>
                    # plain app-layout (maybe in comments or class names? careful)
                    # Lets stick to tags <app-layout ... > and </app-layout>
                    
                    if m['old_tag'] and m['new_tag'] and m['old_tag'] != '❌':
                        # Open tag: <app-layout (space or >)
                        pattern_tag_open = re.compile(rf'<{re.escape(m["old_tag"])}(\s|>)')
                        if pattern_tag_open.search(new_content):
                             new_content = pattern_tag_open.sub(rf'<{m["new_tag"]}\1', new_content)
                             modified_file = True
                             
                        # Close tag: </app-layout>
                        pattern_tag_close = re.compile(rf'</{re.escape(m["old_tag"])}>')
                        if pattern_tag_close.search(new_content):
                             new_content = pattern_tag_close.sub(rf'</{m["new_tag"]}>', new_content)
                             modified_file = True
                             
                if modified_file:
                    print(f"Updating {file}")
                    with open(file_path, 'w') as f:
                        f.write(new_content)
                    count += 1
                    
    print(f"Total HTML files updated: {count}")

def main():
    mappings = load_mapping()
    print(f"Loaded {len(mappings)} mappings.")
    process_html_files(mappings)

if __name__ == "__main__":
    main()
