const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

let adage = '';

readStream.on('data', chunk => { adage += chunk });
readStream.on('end', () => { console.log(adage) });
readStream.on('error', err => { console.error(err) });