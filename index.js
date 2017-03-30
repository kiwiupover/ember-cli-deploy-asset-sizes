/* jshint node: true */
'use strict';

var RSVP = require ('rsvp');
var DeployPluginBase = require('ember-cli-deploy-plugin');
var path = require('path');

var sendDeployData = function(assets, options, keen) {
  keen = keen.configure({
    projectId: options.KEEN_PROJECT_ID,
    writeKey: options.KEEN_WRITE_KEY
  });

  var pushedAssets = assets.map(function(asset) {
    // Get rid of the fingerprint
    asset.name = asset.name.split(/-[a-f0-9]{32}/ig).join('');
    // And only keep filename
    asset.name = path.basename(asset.name);
    return asset;
  })

  return new RSVP.Promise(function(resolve, reject) {
    var keenPayload = JSON.stringify({ deploy: pushedAssets });

    keen.addEvents(keenPayload, function(err, res) {
      if(err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = {
  name: 'ember-cli-deploy-asset-sizes',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      requiredConfig: ['KEEN_PROJECT_ID', 'KEEN_WRITE_KEY'],
      defaultConfig: {
        projectRoot: function(context) {
          return context.project.root;
        },
        distDir: function(context) {
          return context.distDir || 'tmp/deploy-dist';
        },
        keen: function(context) {
          return context.keen;
        }
      },

      willUpload: function(context) {
        var root = this.readConfig('projectRoot');
        var distDir = this.readConfig('distDir');
        var keen = this.readConfig('keen') || require('keen.io');
        var outputPath = root + '/' + distDir;
        var options = {
          KEEN_PROJECT_ID: this.readConfig('KEEN_PROJECT_ID'),
          KEEN_WRITE_KEY: this.readConfig('KEEN_WRITE_KEY')
        };

        var AssetSizePrinter = require('ember-cli/lib/models/asset-size-printer');
        var sizePrinter = new AssetSizePrinter({
          ui: this.ui,
          outputPath: outputPath
        });
        var makeAssetSizesObject = sizePrinter.makeAssetSizesObject();

        return makeAssetSizesObject.then(function(assets) {
          return sendDeployData(assets, options, keen);
        });
      }
    });

    return new DeployPlugin();
  }
};
