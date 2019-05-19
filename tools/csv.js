const fs = require('fs');
const csvSync = require('csv-parse/lib/sync');

module.exports = (file, opts) => {
  const input = fs.readFileSync(file);
  return csvSync(input, { columns: true, ...opts });
};
