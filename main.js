var os = require('os');
var request = require('request');

function triggerAlert(event, callback) {
    if (!process.env.PAGER_DUTY_SERVICE)
        return callback(new Error('environment variable PAGER_DUTY_SERVICE not defined'));

    if (!process.env.PAGER_DUTY_API_KEY)
        return callback(new Error('environment variable PAGER_DUTY_API_KEY not defined'));

    var payload = {
        event_type: 'trigger',
        client: os.hostname(),
        service_key: process.env.PAGER_DUTY_SERVICE
    };

    if (typeof event === 'string') {
        payload.description = event;
    }
    else if (typeof event === 'object') {

        payload.description = event.description;
        if (event.context && Array.isArray(event.context))
            payload.context = event.context;

        if (event.details && event.details === 'object')
            payload.details = event.details;
    }
    //make sure the payload has a description field and that description is a string
    if (!payload.description || typeof payload.description !== 'string') {
        return callback(new Error('Your alert needs a description'));
    }

    if (!payload.details)
        payload.details = { description: payload.description };

    var options = {
        uri:     'https://events.pagerduty.com/generic/2010-04-15/create_event.json',
        method:  'POST',
        json:    payload,
        headers: { Authorization: 'Token token=' + process.env.PAGER_DUTY_API_KEY }
    };

    request(options, function (err, response, body)
    {
        if (err) return callback(err);
        if (response.statusCode >= 400)
            return callback(new Error('Unexpected status code ' + response.statusCode));
        callback(err, response.body.incident_key);
    });
}

//node convention: check to see if something's wrong at the beginning, and if you don't have the required info then bail with error
//node convention: err response body. Err means something went horribly wrong communicating to server. if (err) return callback(err);
//cont'd.. http response. if (res.StatusCode === 200){happy path}. OR
//assert function:
//Need to get service_key from the env var!!!
//need to send payload to pagerduty
//handle response from pagerduty
//Write readme:
//Other tests?
//ask ceej how to setup env variable
module.exports = triggerAlert;
