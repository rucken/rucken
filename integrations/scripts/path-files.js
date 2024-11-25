const { readFile, writeFile, existsSync } = require('fs');
const { join } = require('path');

const packageJson = join(__dirname, '..', 'app', 'package.json');
readFile(packageJson, function (err, content) {
  if (err) throw err;
  var json = JSON.parse(content);
  json.scripts = json.scripts || {};
  json.scripts.nx = 'nx';
  json.scripts.rucken = 'rucken';
  writeFile(packageJson, JSON.stringify(json, null, 2), function (err) {
    if (err) throw err;
  });
});

const browserslistrc = join(
  __dirname,
  '..',
  'app',
  'apps',
  'client',
  '.browserslistrc'
);
if (existsSync(browserslistrc)) {
  readFile(browserslistrc, function (err, content) {
    if (err) throw err;
    const browserslistrcLines = content.toString().split('\n');
    browserslistrcLines.push(`not ios_saf 15.2-15.3`);
    browserslistrcLines.push(`not safari 15.2-15.3`);
    writeFile(browserslistrc, browserslistrcLines.join('\n'), function (err) {
      if (err) throw err;
    });
  });
}
