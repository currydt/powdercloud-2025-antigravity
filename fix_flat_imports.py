
import os
import re

directories = [
    'actions', 'charts', 'communication', 'containment', 'data-display', 
    'forms', 'grids', 'inputs', 'layout', 'navigation', 'utils'
]

# Regex for JS 'import' (../category/)
js_pattern_str = r'\.\.\/(' + '|'.join(directories) + r')\/'
js_regex = re.compile(js_pattern_str)

# Regex for HTML 'src' (/js/lit/category/)
html_pattern_str = r'\/js\/lit\/(' + '|'.join(directories) + r')\/'
html_regex = re.compile(html_pattern_str)

def process_file(filepath, replacement, regex):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"Skipping binary/encoding issue: {filepath}")
        return

    new_content = regex.sub(replacement, content)
    
    if content != new_content:
        print(f"Updating {filepath}")
        with open(filepath, 'w') as f:
            f.write(new_content)

# Update Components (they are all in components/ now, so imports from other categories become local ./)
# JS Script logic (using js_regex)
components_dir = 'public/js/lit/components'
if os.path.exists(components_dir):
    for filename in os.listdir(components_dir):
        if filename.endswith('.js'):
            process_file(os.path.join(components_dir, filename), './', js_regex)

# Update Pages (they are in pages/, so imports become ../components/)
# JS Script logic (using js_regex)
pages_dir = 'public/js/lit/pages'
if os.path.exists(pages_dir):
    for filename in os.listdir(pages_dir):
        if filename.endswith('.js'):
            process_file(os.path.join(pages_dir, filename), '../components/', js_regex)

# Update HTML files (recursively in public/)
# HTML Script logic (using html_regex)
for root, dirs, files in os.walk('public'):
    for filename in files:
        if filename.endswith('.html'):
            process_file(os.path.join(root, filename), '/js/lit/components/', html_regex)
