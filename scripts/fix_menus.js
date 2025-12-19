const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const indexFile = path.join(publicDir, 'index.html');

const indexContent = fs.readFileSync(indexFile, 'utf8');
const navStart = indexContent.indexOf('<ul id="ulNav">');
const navEnd = indexContent.indexOf('</ul>', navStart) + 5;
const navContent = indexContent.substring(navStart, navEnd);

if (navStart === -1 || navEnd === -1) {
    console.error('Could not find ulNav in index.html');
    process.exit(1);
}

function processFile(filePath) {
    if (filePath === indexFile) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const fNavStart = content.indexOf('<ul id="ulNav">');

    if (fNavStart !== -1) {
        const fNavEnd = content.indexOf('</ul>', fNavStart) + 5;
        if (fNavEnd !== -1) {
            console.log(`Updating menu in ${filePath}`);
            const newContent = content.substring(0, fNavStart) + navContent + content.substring(fNavEnd);
            fs.writeFileSync(filePath, newContent);
        }
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.html')) {
            processFile(filePath);
        }
    });
}

walkDir(publicDir);
console.log('Menu update complete.');
