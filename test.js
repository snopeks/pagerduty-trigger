var demand = require("must");
var triggerAlert = require("./main");

describe("alertbot", function() {
  console.log(process.env.PAGER_DUTY_SERVICE);
  it("returns an error if it doesn't have it's environment variable", function(done) {
    var saved = process.env.PAGER_DUTY_SERVICE;
    delete process.env.PAGER_DUTY_SERVICE;

    triggerAlert({}, function(err) {
      err.must.be.an.object();
      err.must.match(/environment variable PAGER_DUTY_SERVICE/);
      process.env.PAGER_DUTY_SERVICE = saved;
      done();
    });

  });

  it("returns an error if it doesn't get a description", function(done) {
    triggerAlert({}, function(err) {
      err.must.be.an.object();
      err.must.match(/description/);
      done();
    });
  });

  it("returns an error if description isn't string", function(done) {
    triggerAlert(4, function(err) {
      err.must.be.a.object();
      err.must.match(/description/);
      done();
    });
  });

  it("successfully triggers pagerduty with string description", function(done) {
    process.env.PAGER_DUTY_SERVICE = 'e93facc04764012d7bfb002500d5d1a6';
    triggerAlert("This is a test!", function(err, incident_key) {
      incident_key.must.be.a.string();
      done();
    });
  });
  it("successfully triggers pagerduty with event object", function(done) {
    process.env.PAGER_DUTY_SERVICE = 'e93facc04764012d7bfb002500d5d1a6';
    var event = {
       "description": "Testing event object",
       "contexts":[
        {
          "type": "link",
          "href": "http://acme.pagerduty.com"
        }],
        "details": {
          "ping time": "1500ms",
          "load avg": 0.75
        }
    };
    triggerAlert(event, function(err, incident_key) {
      incident_key.must.be.a.string();
      done();
    });
  });

});
