const fs = require('fs').promises;
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

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

async function run() {
  try {
    // Check if destDir exists and remove it if it does
    const destExists = await fs.stat(destDir).then(() => true).catch(() => false);
    if (destExists) {
      console.log(`Removing ${destDir}`);
      await fs.rm(destDir, { recursive: true });
    }

    // Create a new destDir and copy the files
    console.log(`Copying ${srcDir} to ${destDir}`);
    await copyDir(srcDir, destDir);
    console.log('Copy completed successfully!');
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

run();