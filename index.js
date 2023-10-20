// index.js
// where your node app starts

// init project
var database_uri = 'mongodb+srv://Caliphus:Calphius18@urlshortener.puux4pg.mongodb.net/?retryWrites=true&w=majority';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var shortid = require('shortid');
var port = process.env.PORT || 3000;

mongoose.connect(database_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
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

app.get("/urlShortenerMicroservice", function (req, res) {
  res.sendFile(__dirname + '/views/urlShortenerMicroservice.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  console.log({greeting: 'hello API'});
  res.json({greeting: 'hello API'});
});


var ShortURL = mongoose.model('ShortURL', new mongoose.Schema({
  short_url: String,
  original_url: String,
  suffix: String
}));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.post("/api/shorturl", (req, res) => {
  let client_requested_url = req.body.url

  let suffix = shortid.generate();
  let newShortURL = suffix

  let newURL = new ShortURL({
    short_url: __dirname + "/api/shorturl/" + suffix,
    original_url: client_requested_url,
    suffix: suffix
  })

  newURL.save().then(() => {
    res.json({
      "saved": true,
      "short_url": newURL.short_url,
      "orignal_url": newURL.original_url,
      "suffix": newURL.suffix
    });
  });

});

app.get("/api/shorturl/:suffix", (req, res) => {
  let userGeneratedSuffix = req.params.suffix;
  ShortURL.find({suffix: userGeneratedSuffix}).then(foundUrls => {
    let urlForRedirect = foundUrls[0];
    res.redirect(urlForRedirect.original_url);
  });
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
