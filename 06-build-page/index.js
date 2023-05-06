const fsPromises = require('fs').promises;
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');

// Create project-dist folder
fsPromises.mkdir(projectDistPath)
  .then(() => console.log('project-dist folder created'))
  .catch((err) => console.error(err));

// Replace tags in template and create index.html file
const templatePath = path.join(__dirname, 'template.html');
const indexPath = path.join(projectDistPath, 'index.html');

fsPromises.readFile(templatePath, 'utf-8')
  .then((template) => {
    // Replace {{header}} with contents of components/header.html
    return fsPromises.readFile(path.join(__dirname, 'components', 'header.html'), 'utf-8')
      .then((header) => template.replace(/{{header}}/g, header))
      .then((template) => {
        // Replace {{articles}} with contents of components/articles.html
        return fsPromises.readFile(path.join(__dirname, 'components', 'articles.html'), 'utf-8')
          .then((articles) => template.replace(/{{articles}}/g, articles))
          .then((template) => {
            // Replace {{footer}} with contents of components/footer.html
            return fsPromises.readFile(path.join(__dirname, 'components', 'footer.html'), 'utf-8')
              .then((footer) => template.replace(/{{footer}}/g, footer))
              .then((template) => fsPromises.writeFile(indexPath, template))
          })
      })
  })
  .then(() => console.log('index.html created'))
  .catch((err) => console.error(err));

// Combine styles into style.css file
const stylesPath = path.join(__dirname, 'styles');
const stylePath = path.join(projectDistPath, 'style.css');

fsPromises.readdir(stylesPath)
  .then((files) => {
    const promises = files.map((file) => fsPromises.readFile(path.join(stylesPath, file), 'utf-8'));
    return Promise.all(promises)
      .then((contents) => contents.join('\n'))
      .then((combined) => fsPromises.writeFile(stylePath, combined));
  })
  .then(() => console.log('style.css created'))
  .catch((err) => console.error(err));

// Copy assets folder
const fs = require('fs');
const { promisify } = require('util');

// Use promisify to convert fs functions into promises
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

async function copyFolder(source, target) {
  try {
    // Check if source is a directory
    const sourceStats = await stat(source);
    if (!sourceStats.isDirectory()) {
      throw new Error('Source is not a directory');
    }

    // Create target directory if it doesn't exist
    await mkdir(target, { recursive: true });

    // Read contents of source directory
    const files = await readdir(source);

    // Copy each file to the target directory
    await Promise.all(files.map(async (file) => {
      const filePath = `${source}/${file}`;
      const fileStats = await stat(filePath);
      if (fileStats.isDirectory()) {
        // Recursively copy subdirectory
        await copyFolder(filePath, `${target}/${file}`);
      } else {
        // Copy file
        await copyFile(filePath, `${target}/${file}`);
      }
    }));

    console.log(`Successfully copied ${source} to ${target}`);
  } catch (err) {
    console.error(`Error copying`)}
}