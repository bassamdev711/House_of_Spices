const fs = require('fs');
const path = require('path');

const targetWord = 'التصنيفات';
const replacementWord = 'التصنيفات';
const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

function replaceInFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(targetWord)) {
            const newContent = content.split(targetWord).join(replacementWord);
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (err) {
        // Skip files that can't be read or written to
    }
}

function processDirectory(dir) {
    try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            
            try {
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!excludeDirs.includes(file)) {
                        processDirectory(fullPath);
                    }
                } else {
                    replaceInFile(fullPath);
                }
            } catch (err) {
                // Ignore files that can't be accessed
            }
        }
    } catch (err) {
        // Ignore dirs that can't be read
    }
}

console.log('Starting search and replace...');
processDirectory(__dirname);
console.log('Done.');
