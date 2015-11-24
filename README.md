# pagerduty-trigger
`npm install pagerduty-trigger`.<br>
A small module that allows you to [trigger](https://developer.pagerduty.com/documentation/integration/events/trigger) a [PagerDuty](https://www.pagerduty.com/) alert and returns an `incident key`.

You must set a service key environment variable called `PAGER_DUTY_SERVICE`.  

#### Usage
    var triggerAlert = require("pagerduty-trigger");
#### Examples
Set environment variable for your pager duty service key:

    process.env.PAGER_DUTY_SERVICE = 'Your service key here';

`pagerduty-trigger` takes a string as the first argument, representing the description.

    triggerAlert("Your description!", function(err, incident_key) {
    //your code here
    });

`pagerduty-trigger` can also take an object as the first argument.

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
