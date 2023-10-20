// index.js
// where your node app starts

// init project
var database_uri = 'mongodb+srv://Caliphus:Calphius18@urlshortener.puux4pg.mongodb.net/?retryWrites=true&w=majority';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var { MongoClient } = require('mongodb');
var mongoose = require('mongoose');
const dns = require('dns')
const urlparser = require('url')

const client = new MongoClient(database_uri)
const db = client.db("urlshortner")
const urls = db.collection("urls")


var port = process.env.PORT || 3000;

mongoose.connect(database_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

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


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.post('/api/shorturl', function(req, res) {
  
  const url = req.body.url
  const dnslookup = dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
    if (!address){
      res.json({error: "Invalid URL"})
    } else {

      const urlCount = await urls.countDocuments({})
      const urlDoc = {
        url,
        short_url: urlCount
      }

      const result = await urls.insertOne(urlDoc)
      res.json({ original_url: url, short_url: urlCount })
      
    }
  })
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const shorturl = req.params.short_url
  const urlDoc = await urls.findOne({ short_url: +shorturl })
  res.redirect(urlDoc.url)
})


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
