// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;



var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + '/views/timestamp.html');
});

app.get("/requestHeaderParser", function (req, res) {
  res.sendFile(__dirname + '/views/requestHeaderParser.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  console.log({greeting: 'hello API'});
  res.json({greeting: 'hello API'});
});

app.get("/api/whoami", function(req, res){
  res.json({
    "ipaddress": req.connection.remoteAddress,
    "language": req.headers["accept-language"],
    "software": req.headers["user-agent"]
  });
});

app.get("/api", function(req, res) {
  var today = new Date()
  res.json({
   "unix": today.getTime(), 
   "utc": today.toUTCString()
  });
});

app.get("/api/:date_string", function (req, res) {
let dateString = req.params.date_string;

if (parseInt(dateString) > 10000) {
  let unixTime = new Date(parseInt(dateString));
  res.json({
    "unix": unixTime.getTime(),
    "utc": unixTime.toUTCString()
  });
}

let inputtedValue = new Date(dateString);

if (inputtedValue == "Invalid Date") {
  res.json({"error" : "Invalid Date"});
} else {
res.json({
  "unix": inputtedValue.getTime(),
  "utc": inputtedValue.toUTCString()
})
}
});



// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
