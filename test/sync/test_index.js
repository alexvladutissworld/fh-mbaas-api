var assert = require('assert');
var sync = require('../../lib/sync/index.js')
var sinon = require('sinon');

module.exports = {
  'test invoke arg validation' : function() {
    assert.throws(function() {
      sync.api.invoke();
    }, function(err) {
      assert.equal(err.message, 'invoke requires 3 arguments');
      return true;
    });

    assert.throws(function() {
      sync.api.invoke('test_dataset_id');
    }, function(err) {
      assert.equal(err.message, 'invoke requires 3 arguments');
      return true;
    });

    assert.throws(function() {
      sync.api.invoke('test_dataset_id', {});
    }, function(err) {
      assert.equal(err.message, 'invoke requires 3 arguments');
      return true;
    });
  },

  'test invoke with missing fn': function(finish) {
    sync.api.invoke('test_dataset_id', {}, function(err) {
      assert.equal(err, 'no fn parameter provided in params "{}"');
      return finish();
    });
  },

  'test invoke with invalid fn': function(finish) {
    var params = {
      fn: 'some_invalid_fn'
    };

    sync.api.invoke('test_dataset_id', params, function(err) {
      assert.equal(err, 'invalid fn parameter provided in params "some_invalid_fn"');
      return finish();
    });
  },

  'test invoke with valid fn': function(finish) {
    // stub the syncRecords function so we can make sure its called
    var syncRecords = sinon.stub(sync, "syncRecords");
    syncRecords.callsArgWithAsync(2, null, {});
    var params = {
      fn: 'syncRecords'
    };
    sync.api.invoke('test_dataset_id', params, function(err, data) {
      assert.ok(!err, err);
      sinon.assert.calledOnce(syncRecords);
      sinon.assert.calledWith(syncRecords, 'test_dataset_id', params);
      syncRecords.restore();
      return finish();
    });
  }
};