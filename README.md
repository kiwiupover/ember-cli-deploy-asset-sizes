# ember-cli-deploy-asset-sizes

[WIP]

Keep track of your ember apps asset sizes over time. Each deploy the addon will push your apps assets sizes to [keen.io](https://keen.io).

Use [ember-dashboard](https://github.com/kiwiupover/ember-dashboard) to display your deloy data.

## Installation

```sh
ember install ember-cli-deploy-asset-sizes

```

### Add you keen.io keys
Add your keen.io key to deploy.js

```js
module.exports = function(deployTarget) {
  var ENV = {
    // truncated for brevity
    emberCliDeployAssetSizes: {
      KEEN_PROJECT_ID: <your-keen-project-id>,
      KEEN_WRITE_KEY: <your-keen-write-key>
    }
  };

  // ttruncated for brevity
  return ENV;
};


```
## Deploy

```sh
ember deploy production
```

## Running Tests

* `npm test` Comming soon! :(


For more information on using ember-cli-deploy, visit [ember-cli-deploy.com](http://ember-cli-deploy.com/).
