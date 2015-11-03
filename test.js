var demand = require("must");
var triggerAlert = require("./main");

describe ("alertbot", function(){

  it("returns an error if it doesn't have it's environment variable", function(done){
      var saved = process.env.PAGER_DUTY_SERVICE
      delete process.env.PAGER_DUTY_SERVICE

      triggerAlert({}, function(err){
        err.must.be.an.object();
        err.must.match(/environment variable PAGER_DUTY_SERVICE/);
        process.env.PAGER_DUTY_SERVICE = saved;
        done()
      });

  })

})
