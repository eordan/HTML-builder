const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

fs.open(path.join(__dirname, 'text.txt'), 'w', (err, fd) => {
  if (err) throw err;
  stdout.write('Waiting for input\n');

  stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
      fs.close(fd, (err) => {
        if (err) throw err;
        stdout.write('\nHave a good day!\n');
        process.exit();
      });
    } else {
      fs.write(fd, data, (err) => {
        if (err) throw err;
        console.log('Press `Ctrl + C` to exit.');
      });
    }
  });

  // Add a listener for the SIGINT signal
  process.on('SIGINT', () => {
    fs.close(fd, (err) => {
      if (err) throw err;
      stdout.write('\nHave a good day!\n');
      process.exit();
    });
  });
});