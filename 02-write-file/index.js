const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;
stdout.write('Ожидается ввод текста\n');

stdin.on('data', data => {
  fs.writeFile(
    path.join(__dirname, 'newfile.txt'),
    data,
    (err) => {
      if (err) throw err;
      console.log('Запись сделана. Нажмите `Ctrl` + `C` чтобы выйти.');
    }
  );
});

process.on('SIGINT', () => {
  stdout.write('\nВсего хорошего!\n');
  process.exit();
});