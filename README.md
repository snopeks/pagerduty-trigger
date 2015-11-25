# pagerduty-trigger

`npm install pagerduty-trigger`

A small module that allows you to [trigger](https://developer.pagerduty.com/documentation/integration/events/trigger) a [PagerDuty](https://www.pagerduty.com/) alert and returns an `incident key`.

## Usage

Set two environment variables:

```bash
export PAGER_DUTY_SERVICE=your-service-id
export PAGER_DUTY_API_KEY=an-api-key-with-write-perms
```

You can then trigger an alert like this:

```js
var triggerAlert = require('pagerduty-trigger');
triggerAlert('One of the flayrods has gone out of skew on treadle!', function(err, incidentID) {
    console.log('incident created with id ' + incidentID);
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

## command-line tool

You can create an event using the handy command-line tool `pd-trigger`. Usage:

`pd-trigger "One of the flayrods has gone out of skew on treadle!"`

It will respond with the ID of the incident created.
