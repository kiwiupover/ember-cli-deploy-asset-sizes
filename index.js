/* jshint node: true */
'use strict';

var Promise = require('ember-cli/lib/ext/promise');

var sendDeployData = function(assets, config) {
  var keen = require('keen.io');

  var keen = keen.configure({
    projectId: config.KEEN_PROJECT_ID,
    writeKey: config.KEEN_WRITE_KEY
  });

  var pushedAsset = assets.map(function(asset){
    asset.name = asset.name.split(/-[a-f0-9]{32}/ig).join('');
    return asset;
  })

  return new Promise(function(resolve, reject) {

    let keenPayload = JSON.stringify({ deploy: pushedAsset });

    keen.addEvents(keenPayload, function(err, res) {
      console.log('keen-data', err, res);
      if(err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = {
  name: 'ember-cli-deploy-assets-sizes',

  createDeployPlugin: function(options) {
    return {
      name: options.name,

      willUpload: function(context) {
        var AssetSizePrinter = require('ember-cli/lib/models/asset-size-printer');
        var sizePrinter = new AssetSizePrinter({
          ui: this.ui,
          outputPath: context.project.root + '/' + context.distDir
        });

        var emberCliDeployAssetsSizesConfig = context.config.emberCliDeployAssetsSizes;

        // TODO add fall back if makeAssetSizesObject is not a function
        return sizePrinter.makeAssetSizesObject().then(function(assets){
          return sendDeployData(assets, emberCliDeployAssetsSizesConfig);
        });
      }
    };

    return new DeployPlugin();
  }
};
