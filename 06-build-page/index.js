const fs = require('fs').promises;
const path = require('path');

const srcDir = path.join(__dirname, 'assets');
const destDir = path.join(__dirname, 'project-dist/assets');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const outFile = path.join(distDir, 'style.css');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  const files = await fs.readdir(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    const stats = await fs.stat(srcPath);
    if (stats.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildStyles(stylesDir, outFile) {
  try {
    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter(file => {
      return path.extname(file) === '.css';
    });
    
    const fileReadPromises = cssFiles.map(file => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(stylesDir, file);
        fs.readFile(filePath, 'utf8')
          .then(data => resolve(data))
          .catch(err => reject(err));
      });
    });

    const cssContents = await Promise.all(fileReadPromises);
    const cssContent = cssContents.join('');

    await fs.writeFile(outFile, cssContent);
  } catch (err) {
    console.error(err);
  }
}

async function combineComponents() {
  const templatePath = path.join(__dirname, 'template.html');
  const distPath = path.join(__dirname, 'project-dist', 'index.html');

  let html = await fs.readFile(templatePath, 'utf-8');

  const regex = /{{(.*?)}}/g;
  let match;
  while ((match = regex.exec(html))) {
    const componentName = match[1].trim();
    const componentPath = path.join(__dirname, 'components', `${componentName}.html`);
    const componentHtml = await fs.readFile(componentPath, 'utf-8');
    html = html.replace(match[0], componentHtml);
  }

  await fs.writeFile(distPath, html);
}

async function buildProject() {
  const projectDist = path.join(__dirname, 'project-dist');

  try {
    // Check if projectDist exists and remove it if it does
    const destExists = await fs.stat(projectDist).then(() => true).catch(() => false);
    if (destExists) {
      console.log(`Removing ${projectDist}`);
      await fs.rm(projectDist, { recursive: true });
    }

    // Create a new destDir and copy the files
    await copyDir(srcDir, destDir);
    console.log('Copy completed successfully!');

    // Build CSS
    await buildStyles(stylesDir, outFile);
    console.log('Style built successfully!');

    // Build HTML
    await combineComponents();
    console.log('HTML built successfully!');

  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

buildProject();