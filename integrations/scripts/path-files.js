const { readFile, writeFile } = require('fs');
const { join } = require('path');

const packageJson = join(__dirname, '..', 'app', 'package.json');
readFile(packageJson, function (err, content) {
  if (err) throw err;
  var json = JSON.parse(content);
  json.scripts.nx = 'nx';
  json.scripts.rucken = 'rucken';
  writeFile(packageJson, JSON.stringify(json, null, 2), function (err) {
    if (err) throw err;
  });
});
