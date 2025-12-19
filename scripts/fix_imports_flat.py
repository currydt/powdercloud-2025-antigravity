import os
import re

LIT_DIR = "public/js/lit"

def fix_pages_flat():
    print("Fixing imports in PAGES (now in lit base dir)...")
    for filename in os.listdir(LIT_DIR):
        if not filename.endswith(".js"): continue
        
        # Don't accidentally edit components if they are in a subdir, but in this case
        # components are in LIT_DIR/components/.
        # However, we are scanning LIT_DIR which contains pages AND the components dir.
        # os.listdir(LIT_DIR) returns files and folders. We only want files (the pages).
        
        filepath = os.path.join(LIT_DIR, filename)
        if not os.path.isfile(filepath): continue
        
        with open(filepath, 'r') as f:
            content = f.read()
            
        # We need to change imports from: 
        #   '../components/Foo.js'  -> './components/Foo.js'
        #   './Foo.js' (if they were importing siblings in pages dir) -> './Foo.js' (still siblings)
        
        # Actually, previous script changed them to '../components/Foo.js'.
        # We just need to replace '../components/' with './components/'.
        
        new_content = content.replace("'../components/", "'./components/")
        new_content = new_content.replace('"../components/', '"./components/')

        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")

if __name__ == "__main__":
    fix_pages_flat()
