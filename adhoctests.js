var main = require('./main');


var callback = function(error, ID){
  if (error){
    console.log(error)
    return
  }
  console.log(ID)
}

console.log("test event = string")
main("hello", callback)
var details = {
        "ping time": "1500ms",
        "load avg": 0.75
      }
var context = [
        {
          "type": "link",
          "href": "http://acme.pagerduty.com"
        },{
          "type": "link",
          "href": "http://acme.pagerduty.com",
          "text": "View the incident on PagerDuty"
        },{
          "type": "image",
          "src": "https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1"
        },{
          "type": "image",
          "src": "https://chart.googleapis.com/chart?chs=600x400&chd=t:6,2,9,5,2,5,7,4,8,2,1&cht=lc&chds=a&chxt=y&chm=D,0033FF,0,0,5,1",
          "href": "https://google.com"
        }
      ]
console.log("\n test event = object")
main({"description": "host is blowing up", "context": context, "details": details}, callback)
