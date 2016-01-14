var os = require('os');
var request = require('request');

function postToPagerduty(payload, callback) {
    if (!process.env.PAGER_DUTY_SERVICE)
        return callback(new Error('environment variable PAGER_DUTY_SERVICE not defined'));

    if (!process.env.PAGER_DUTY_API_KEY)
        return callback(new Error('environment variable PAGER_DUTY_API_KEY not defined'));

    var options = {
        uri:     'https://events.pagerduty.com/generic/2010-04-15/create_event.json',
        method:  'POST',
        json:    payload,
        headers: { Authorization: 'Token token=' + process.env.PAGER_DUTY_API_KEY }
    };

    request(options, function (err, response, body) {
        if (err) return callback(err);
        if (response.statusCode >= 400)
            return callback(new Error('Unexpected status code ' + response.statusCode));
        callback(err, response.body);
    });
}

function triggerAlert(event, callback) {
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

        if (event.details && typeof event.details === 'object')
            payload.details = event.details;
    }
    //make sure the payload has a description field and that description is a string
    if (!payload.description || typeof payload.description !== 'string') {
        return callback(new Error('Your alert needs a description'));
    }

    if (!payload.details)
        payload.details = { description: payload.description };

    postToPagerduty(payload, function(err, response)
    {
        if (err) return callback(err);
        callback(null, response.incident_key);
    });
}

function resolveAlert(event, callback) {
    var payload = {
        event_type: 'resolve',
        client: os.hostname(),
        service_key: process.env.PAGER_DUTY_SERVICE
    };

    if (typeof event === 'string') {
        payload.incident_key = event;
    }
    else if (typeof event === 'object') {
        payload.incident_key = event.incident_key;
        if (event.description) payload.description = event.description;
        if (event.details) payload.details = event.details;
    }

    if (!payload.incident_key)
        return callback(new Error('you need to provide an `incident_key` to resolve'));

    postToPagerduty(payload, callback);
}

module.exports = triggerAlert;
triggerAlert.resolve = resolveAlert;
triggerAlert.postToPagerduty = postToPagerduty;
