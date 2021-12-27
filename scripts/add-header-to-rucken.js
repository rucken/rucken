#!/usr/bin/env node
const fs = require('fs');

const filePath = 'dist/libs/rucken/src/index.js';
const data = fs.readFileSync(filePath).toString().split('\n');

fs.writeFile(
  filePath,
  ['#!/usr/bin/env node', ...data].join('\n'),
  function (err) {
    if (err) return console.log(err);
  }
);
