'use strict';

var path = require('path');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var assert = chai.assert;

describe('deploy-asset-sizes plugin', function() {
  var subject;
  var mockUi;
  var context;
  var fakeRoot;
  var distDir;

  before(function() {
    subject = require('../../index');
    fakeRoot = process.cwd() + '/tests/fixtures';
    distDir = 'dist';
  });

  beforeEach(function() {
    mockUi = {
      messages: [],
      write: function() {
      },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };

    context = {
      ui: mockUi,
      config: {
        'asset-sizes': {
          KEEN_PROJECT_ID: 'aaaa',
          KEEN_WRITE_KEY: 'bbbb',
          projectRoot: function() {
            return fakeRoot;
          },
          distDir: function() {
            return distDir;
          }
        }
      }
    };
  });

  it('has a name', function() {
    var plugin = subject.createDeployPlugin({
      name: 'asset-sizes'
    });

    assert.equal(plugin.name, 'asset-sizes');
  });

  it('implements the correct hooks', function() {
    var plugin = subject.createDeployPlugin({
      name: 'asset-sizes'
    });

    assert.typeOf(plugin.willUpload, 'function');
  });

  describe('configure hook', function() {
    it('does not throw if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 'asset-sizes'
      });
      plugin.beforeHook(context);
      plugin.configure(context);
      assert.ok(true); // it didn't throw
    });

    it('throws if config is not valid', function() {
      var plugin = subject.createDeployPlugin({
        name: 'asset-sizes'
      });

      context.config['asset-sizes'] = {};

      plugin.beforeHook(context);
      assert.throws(function() {
        plugin.configure(context);
      });
    });

    describe('required config', function() {
      it('warns about missing KEEN_PROJECT_ID', function() {
        delete context.config['asset-sizes'].KEEN_PROJECT_ID;

        var plugin = subject.createDeployPlugin({
          name: 'asset-sizes'
        });
        plugin.beforeHook(context);
        assert.throws(function() {
          plugin.configure(context);
        });
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing required config: `KEEN_PROJECT_ID`/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 1);
      });

      it('warns about missing KEEN_WRITE_KEY', function() {
        delete context.config['asset-sizes'].KEEN_WRITE_KEY;

        var plugin = subject.createDeployPlugin({
          name: 'asset-sizes'
        });
        plugin.beforeHook(context);
        assert.throws(function() {
          plugin.configure(context);
        });
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing required config: `KEEN_WRITE_KEY`/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 1);
      });
    });
  });

  describe('#willUpload hook', function() {
    it('configures and uploads to Keen', function(done) {
      context.config['asset-sizes'].keen = {
        configure: function(credentials) {
          assert.equal(credentials.projectId, "aaaa");
          assert.equal(credentials.writeKey, "bbbb");

          return this;
        },
        addEvents: function(payload, callback) {
          assert.equal(
            payload,
            JSON.stringify({
              deploy: [
                {
                  name: 'frontend.js',
                  size: 18,
                  gzipSize: 38,
                  showGzipped: true
                },
                {
                  name: 'vendor.js',
                  size: 18,
                  gzipSize: 38,
                  showGzipped: true
                }
              ]
            })
          );

          callback(null);
        }
      };

      var plugin = subject.createDeployPlugin({
        name: 'asset-sizes'
      });

      plugin.beforeHook(context);
      assert.isFulfilled(plugin.willUpload(context))
        .then(function() {
          done();
        });
    });

    it('returns an error message if the upload errors', function() {
      context.config['asset-sizes'].keen = {
        configure: function() {
          return this;
        },
        addEvents: function(payload, callback) {
          callback('the error');
        }
      };

      var plugin = subject.createDeployPlugin({
        name: 'asset-sizes'
      });

      plugin.beforeHook(context);
      return assert.isRejected(plugin.willUpload(context));
    });

    it('allows overwriting of sendDeployData function', function(done) {
      context.config['asset-sizes'].sendDeployData = function(assets) {
        const frontend = assets[0];
        assert.notEqual(
          frontend.name.indexOf('/ember-cli-deploy-asset-sizes/tests/fixtures/dist/frontend-f8762e8292688aff9187bf2f37595888.js'),
          -1
        );
        assert.equal(frontend.showGzipped, true);
        assert.equal(frontend.size, 18);
        assert.equal(frontend.gzipSize, 38);

        const vendor = assets[1];
        assert.notEqual(
          vendor.name.indexOf('/ember-cli-deploy-asset-sizes/tests/fixtures/dist/vendor.js'),
          -1
        );
        assert.equal(vendor.showGzipped, true);
        assert.equal(vendor.size, 18);
        assert.equal(vendor.gzipSize, 38);
      };

      var plugin = subject.createDeployPlugin({
        name: 'asset-sizes'
      });

      plugin.beforeHook(context);
      assert.isFulfilled(plugin.willUpload(context))
        .then(function() {
          done();
        });
    });
  });
});
