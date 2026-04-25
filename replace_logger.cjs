const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

function traverse(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

// Replace console.warn/error with logger
traverse(srcDir, (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    if (filePath.includes('logger.js')) return;
    if (filePath.includes('test')) return; // skip tests
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    if (content.includes('console.warn') || content.includes('console.error')) {
      content = content.replace(/console\.warn/g, 'logger.warn');
      content = content.replace(/console\.error/g, 'logger.error');
      
      const normalizedPath = filePath.replace(/\\/g, '/');
      const srcIdx = normalizedPath.indexOf('/src/');
      const relativeToSrc = normalizedPath.substring(srcIdx + 5); // after /src/
      const depth = relativeToSrc.split('/').length - 1;
      
      let importPath = depth === 0 ? './utils/logger' : '../'.repeat(depth) + 'utils/logger';
      
      const importStmt = `import { logger } from '${importPath}'\n`;
      // insert after first import or at top
      if (content.includes('import ')) {
        content = content.replace(/(import .*?\n)/, `$1${importStmt}`);
      } else {
        content = importStmt + content;
      }
      
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Added logger to ' + filePath);
    }
  }
});
