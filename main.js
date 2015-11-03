var os = require('os');
var request = require('request');

function triggerAlert(event, callback) {
  if (!process.env.PAGER_DUTY_SERVICE) {
    callback(new Error("Do not have environment variable PAGER_DUTY_SERVICE"))
    return
  }



  var payload = {
    'event_type': 'trigger',
    'client': os.hostname(),
    'service_key': 'PAGER_DUTY_SERVICE'
  }
  /*
  payload.event_type = 'trigger'
  payload.client = os.hostname()
  payload.service_key = 'PAGER_DUTY_SERVICE'
  */

  var options = {
    uri: 'https://events.pagerduty.com/generic/2010-04-15/create_event.json',
    method: 'POST',
    json: {'service_key': 'e93facc04764012d7bfb002500d5d1a6',
      'event_type': 'trigger',
      'description': 'FAILURE for production/HTTP on machine srv01.acme.com',
      'client': 'Sample Monitoring Service'}
  }
  //event must be an object OR string
  //check if event is a string
  if(typeof event === 'string'){
    payload.description = event
  }
  //check if event is an object
  else if (typeof event === 'object'){
      payload.description = event.description
      if(event.context && Array.isArray(event.context)) {
        payload.context = event.context
      }
      if(event.details && event.details === 'object'){
        payload.details = event.details
      }
  }
  //if event is not string or object throw an error
  else {
    console.log('Error: event type')
  }
  console.log(payload)
  callback(null, "ID")

  request(options, function(error, response){
    callback(error, response.body.incident_key);
    console.log(response.body)
  })
};

//node convention: check to see if something's wrong at the beginning, and if you don't have the required info then bail with error
//assert function:
//Need to get service_key from the env var!!!
//need to send payload to pagerduty
//handle response from pagerduty

module.exports = triggerAlert;
