
import os
import re

ADMIN_DIR = '/Users/currydt/development/averts/powdercrowds/powdercrowd-project/powdercloud-2025-antigravity/public/admin'

def fix_broken_page_imports():
    if not os.path.exists(ADMIN_DIR):
        print("Admin dir not found")
        return

    # Pattern: src="/js/lit/SomethingPage.js" -> src="/js/lit/pages/SomethingPage.js"
    # We only care about files that are DIRECTLY in /js/lit/ and end in Page.js (convention)
    
    count = 0 
    for file in os.listdir(ADMIN_DIR):
        if file.endswith('.html'):
            filepath = os.path.join(ADMIN_DIR, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = re.sub(
                r'src="/js/lit/([a-zA-Z0-9]+Page\.js)"', 
                r'src="/js/lit/pages/\1"', 
                content
            )
            
            if new_content != content:
                print(f"Fixing {file}")
                with open(filepath, 'w') as f:
                    f.write(new_content)
                count += 1
    
    print(f"Fixed {count} files.")

if __name__ == "__main__":
    fix_broken_page_imports()
