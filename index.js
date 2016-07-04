/* jshint node: true */
'use strict';

var Keen = require('keen-io');

module.exports = {
  name: 'ember-cli-deploy-assets-sizes',

  createDeployPlugin: function(options) {
    return {
      name: options.name,

      didBuild: function(context) {
        console.log('outputPath', context.distDir);
        var AssetSizePrinter = require('ember-cli/lib/models/asset-size-printer');
        var sizePrinter = new AssetSizePrinter({
          ui: this.ui,
          outputPath: context.config.distDir
        });

        // TODO add fall back if makeAssetSizesObject is not a function
        return sizePrinter.makeAssetSizesObject().then(function(assets){
          console.log('assets', assets);
          return;
        });
      }
    };

    return new DeployPlugin();
  }

};
