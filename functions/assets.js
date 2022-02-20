exports.handler = function (context, event, callback) {
  const recorders = require(Runtime.getAssets()['/recorders.js'].path);
  callback(null, recorders);
};
