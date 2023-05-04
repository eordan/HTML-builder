const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Unable to read directory: ${err}`);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Unable to retrieve file stats: ${err}`);
        return;
      }

      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = Math.round(fileSizeInBytes / 1024 * 100) / 100;
        const fileExtension = path.extname(file);
        const fileNameWithoutExtension = path.basename(file, fileExtension);
        console.log(`${fileNameWithoutExtension} - ${fileExtension.slice(1)} - ${fileSizeInKB}kb`);
      }
    });
  });
});