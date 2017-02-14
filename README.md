# ember-cli-deploy-asset-sizes

[![Build Status](https://travis-ci.org/kiwiupover/ember-cli-deploy-asset-sizes.svg?branch=master)](https://travis-ci.org/kiwiupover/ember-cli-deploy-asset-sizes)

Keep track of your Ember.js apps asset sizes over time. Each deploy the addon will push your apps assets sizes to [keen.io](https://keen.io).

Use [ember-dashboard](https://github.com/kiwiupover/ember-dashboard) to display your deloy data.

## Installation

```sh
ember install ember-cli-deploy-asset-sizes
```

### Add you keen.io keys
Add your keen.io key to `config/deploy.js`.

```js
ENV['asset-sizes'] = {
  KEEN_PROJECT_ID: <your-keen-project-id>,
  KEEN_WRITE_KEY: <your-keen-write-key>
};
```
## Deploy

```sh
ember deploy
```

## Running Tests

* `npm test`


For more information on using ember-cli-deploy, visit [ember-cli-deploy.com](http://ember-cli-deploy.com/).
