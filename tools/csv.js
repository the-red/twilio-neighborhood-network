const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const BOM = '\ufeff';

exports.input = (path, opts) => {
  const inputBuffer = fs.readFileSync(path);
  return parse(inputBuffer, { columns: true, ...opts });
};

exports.output = (path, records, opts) => {
  const outputString = stringify(records, { header: true, ...opts });
  return fs.writeFileSync(path, BOM + outputString);
};
