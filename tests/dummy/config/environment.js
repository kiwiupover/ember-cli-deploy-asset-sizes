/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    KEEN_PROJECT_ID: '5702ff5ae0855707f784b1e1',
    KEEN_WRITE_KEY: '7cf8cb0f9a5d38bae16503fc490a17ea399242cbe40e2097c3613784ddb0d0811a9977cbeff5b3e8b15d5a57fe20cb5a7bd706afd45f4ac8213c5c5b7502f778f8af42943c8cfb2533994f5d638f112ff44f21308d7ade487f61f97c1d3af54a',
    KEEN_READ_KEY: 'b4884962ba2f6022ef84df329196509807936e4439094919088c7c29abac1771e91c62dd5e3c51f0a45fe41e87997f9358ffe5bced060430b7ebbd47f6e228b4d4c4b3737a8679724190fa39d5d6c960ed2636578c3367977978abc670bb679c',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
