const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const outFile = path.join(distDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;

  const cssFiles = files.filter(file => {
    return path.extname(file) === '.css';
  });

  const fileReadPromises = cssFiles.map(file => {
    return new Promise((resolve, reject) => {
      const filePath = path.join(stylesDir, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  });

  Promise.all(fileReadPromises)
    .then(cssContents => {
      const cssContent = cssContents.join('');
      return cssContent;
    })
    .then(cssContent => {
      fs.writeFile(outFile, cssContent, err => {
        if (err) throw err;
        console.log(`Finished building ${outFile}`);
      });
    })
    .catch(err => {
      console.error(err);
    });
});