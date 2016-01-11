# pagerduty-trigger

`npm install pagerduty-trigger`

A small module that allows you to [trigger](https://developer.pagerduty.com/documentation/integration/events/trigger) and resolve a [PagerDuty](https://www.pagerduty.com/) alerts.

## Usage

Set two environment variables:

```bash
export PAGER_DUTY_SERVICE=your-service-id
export PAGER_DUTY_API_KEY=an-api-key-with-write-perms
```

You can then trigger an alert like this:

```js
var trigger = require('pagerduty-trigger');
trigger('Trouble at mill!', function(err, incidentID) {
    console.log('incident created with id ' + incidentID);
});
```

Resolve the same incident like this:

```js
var resolve = require('pagerduty-trigger').resolve;
resolve(incidentID, function(err, response) {
    console.log('we have now resolved ' + incidentID);
});
```

## API

`pagerduty-trigger` takes a string as the first argument, representing the description.

```js
  triggerAlert("Your description!", function(err, incident_key) {
  //your code here
  });
```

`pagerduty-trigger` can also take an object as the first argument.

```js
var event = {
   "description": "Your description",
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
  //your code here
});
```

The `resolve()` function requires either a string incident_key argument or an object with an `incident_key` field. See [PagerDuty's documentation](https://developer.pagerduty.com/documentation/integration/events/resolve) for other fields you might pass.

## command-line tool

You can create an event using the handy command-line tool `pd-trigger`. Usage:

`pd-trigger "One of t'flayrods has gone out of skew on treadle!"`

It will respond with the ID of the incident created. You can then feed that ID to the resolve script: `pd-resolve incident-id`.

## License

ISC.
