
import os
import re

PUBLIC_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public'
MAPPING_FILE = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/document/COMPONENT_MAPPING.md'

def load_mapping():
    # Returns dict: {'PowdercloudName.js': 'category'}
    mapping = {}
    with open(MAPPING_FILE, 'r') as f:
        lines = f.readlines()
    
    for line in lines:
        if line.strip().startswith('|') and '.js' in line:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 6:
                new_file = parts[3]
                category = parts[5].replace('/', '')
                if new_file and category:
                    mapping[new_file] = category
    return mapping

def fix_html_paths(mapping):
    count = 0
    for root, dirs, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    content = f.read()
                
                new_content = content
                modified_file = False
                
                for filename, category in mapping.items():
                    # Patterns to correct:
                    # 1. /js/lit/Filename.js -> /js/lit/Category/Filename.js
                    # 2. /js/lit/components/Filename.js -> /js/lit/Category/Filename.js
                    
                    # We want to match paths that end with the filename BUT are NOT preceded by the correct category.
                    # This is tricky with regex. 
                    # Simpler approach: Match the filename, check the prefix.
                    
                    esc_filename = re.escape(filename)
                    # Groups: 1=quote, 2=path prefix
                    pattern = re.compile(rf'(src=["\'])(.*?/js/lit/)(?:components/)?{esc_filename}(["\'])')
                    
                    def replace_path(match):
                        quote_start = match.group(1)
                        path_root = match.group(2) # .../js/lit/
                        quote_end = match.group(3)
                        
                        # If the path already has the category, don't change it.
                        # e.g. path_root might be ".../js/lit/pages/" if checking a page file.
                        # But wait, logic: 
                        # If we match ".../js/lit/PowdercloudPage.js", we want ".../js/lit/pages/PowdercloudPage.js"
                        # If we match ".../js/lit/pages/PowdercloudPage.js" - the regex above WON'T match if we are strict about "components/" or nothing.
                        # The regex `(.*?)` is greedy/lazy? 
                        # `(.*?/js/lit/)` matches up to `/js/lit/`.
                        # Then `(?:components/)?` matches optional components/.
                        # Then `filename`.
                        
                        # So `/js/lit/pages/PowdercloudPage.js` would NOT match `(?:components/)?filename` because of the `pages/` part... 
                        # UNLESS the `(.*?)` eats the `pages/` part too? 
                        # `(.*?/js/lit/)` forces it to end at `lit/`.
                        
                        # So `/js/lit/pages/File.js` -> 
                        # Group 2: .../js/lit/
                        # Remainder: pages/File.js
                        # Regex expects: (components/)?File.js
                        # `pages/` does not match `(components/)?`.
                        # So the regex should ideally FAIL for correct paths (good!).
                        
                        # It SHOULD match:
                        # /js/lit/File.js
                        # /js/lit/components/File.js
                        
                        return f'{quote_start}/js/lit/{category}/{filename}{quote_end}'
                        
                    if pattern.search(new_content):
                        new_content = pattern.sub(replace_path, new_content)
                        modified_file = True

                if modified_file:
                    print(f"Correcting paths in {file}")
                    with open(file_path, 'w') as f:
                        f.write(new_content)
                    count += 1
    print(f"Total HTML files fixed: {count}")

def main():
    mapping = load_mapping()
    print(f"Loaded {len(mapping)} mappings.")
    fix_html_paths(mapping)

if __name__ == "__main__":
    main()
