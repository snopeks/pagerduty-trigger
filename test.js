/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */

var demand = require('must'),
  request      = require('request'),
  triggerAlert = require('./main'),
  resolveAlert = triggerAlert.resolve;

describe('alertbot', function() {

  var savedKey;

  it('returns an error if it doesn\'t have its environment variable', function(done) {
    var saved = process.env.PAGER_DUTY_SERVICE;
    delete process.env.PAGER_DUTY_SERVICE;

    triggerAlert('description', function(err) {
      err.must.be.an.object();
      err.must.match(/environment variable PAGER_DUTY_SERVICE/);
      process.env.PAGER_DUTY_SERVICE = saved;
      done();
    });
  });

  it('returns an error if it doesn\'t have a pager duty API key', function(done) {
    var saved = process.env.PAGER_DUTY_API_KEY;
    delete process.env.PAGER_DUTY_API_KEY;

    triggerAlert('description', function(err) {
      err.must.be.an.object();
      err.must.match(/environment variable PAGER_DUTY_API_KEY/);
      process.env.PAGER_DUTY_API_KEY = saved;
      done();
    });
  });

  it('returns an error if it doesn\'t get a description', function(done) {
    triggerAlert({}, function(err) {
      err.must.be.an.object();
      err.must.match(/description/);
      done();
    });
  });

  it('returns an error if description isn\'t string', function(done) {
    triggerAlert(4, function(err) {
      err.must.be.a.object();
      err.must.match(/description/);
      done();
    });
  });

  it('responds with an error if the auth is incorrect', function(done) {
    process.env.PAGER_DUTY_SERVICE = 'deadbeef';
    var saved = process.env.PAGER_DUTY_API_KEY;
    process.env.PAGER_DUTY_API_KEY = 'deadbeef';
    triggerAlert('This is a test!', function(err, incident_key) {
      err.must.be.a.object();
      err.must.match(/Unexpected status code/);
      process.env.PAGER_DUTY_API_KEY = saved;
      done();
    });
  });

  it('successfully triggers pagerduty with string description', function(done) {
    process.env.PAGER_DUTY_SERVICE = 'e93facc04764012d7bfb002500d5d1a6';
    triggerAlert('This is a test!', function(err, incident_key) {
      incident_key.must.be.a.string();
      done();
    });
  });

  it('successfully triggers pagerduty with event object', function(done) {
    process.env.PAGER_DUTY_SERVICE = 'e93facc04764012d7bfb002500d5d1a6';
    var event = {
       'description': 'Testing event object',
       'context':[
        {
          'type': 'link',
          'href': 'http://acme.pagerduty.com'
        }],
        'details': {
          'ping time': '1500ms',
          'load avg': 0.75
        }
    };
    triggerAlert(event, function(err, incident_key) {
      demand(err).not.exist();
      incident_key.must.be.a.string();

      savedKey = incident_key;
      done();
    });
  });

  it('responds with an error when no incident key is passed', function(done) {
    process.env.PAGER_DUTY_SERVICE = 'e93facc04764012d7bfb002500d5d1a6';
    resolveAlert({}, function(err, incident_key) {
      err.must.exist();
      err.must.match(/incident_key/);
      done();
    });
  });

  it('successfully resolves alert with an id', function(done) {
    this.timeout = 4000;
    process.env.PAGER_DUTY_SERVICE = 'e93facc04764012d7bfb002500d5d1a6';
    resolveAlert(savedKey, function(err, response) {
      demand(err).not.exist();
      response.must.be.an.object();
      response.must.have.property('incident_key');
      savedKey.must.equal(response.incident_key);
      response.status.must.equal('success');
      done();
    });
  });

  it('successfully resolves an alert with a details object', function(done) {
    this.timeout = 4000;
    process.env.PAGER_DUTY_SERVICE = 'e93facc04764012d7bfb002500d5d1a6';
    resolveAlert({ incident_key: 'asdf', }, function(err, response) {
      demand(err).not.exist();
      response.must.be.an.object();
      response.must.have.property('incident_key');
      response.incident_key.must.equal('asdf');
      response.status.must.equal('success');
      done();
    });
  });
});
