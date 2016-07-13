var Promise = require('ember-cli/lib/ext/promise');
var path = require('path');

var makeFileGlob = function (outputPath) {
  var glob = require('glob');
  var outputPath = outputPath;
  var globOptions = {nodir: true};

  return glob.sync(outputPath + '/**/*.{css,js}', globOptions);
};

var makeAssetSizesObject = function (outputPath) {
  var fs = require('fs');
  var zlib = require('zlib');
  var gzip = Promise.denodeify(zlib.gzip);
  var files = makeFileGlob(outputPath);
  var testFileRegex = /(test-(loader|support))|(testem)/i;

  var assets = files
    // Skip test files
    .filter(function (file) {
      var filename = path.basename(file);
      return !testFileRegex.test(filename);
    })
    // Print human-readable file sizes (including gzipped)
    .map(function (file) {
      var filename = path.basename(file);
      var contentsBuffer = fs.readFileSync(file);
      return gzip(contentsBuffer).then(function (buffer) {
        return {
          name: filename,
          size: contentsBuffer.length,
          gzipSize: buffer.length,
          showGzipped: contentsBuffer.length > 0
        };
      });
    });

  return Promise.all(assets);
};

module.exports = makeAssetSizesObject;
