var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const app = express()

let MAX_REP = 10;
let LIMIT = 50;

console.log('++++++++++++ Server Starts ++++++++++++');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '0d84ec941055454db69a02b84e2089aa',
  clientSecret : '76d22bbf58314aee932165dff0ca16e5'
});

getToken();

var songs = [];

function getToken() {
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      
      getNewReleases(10);
      return data.body['expires_in'];
    }, function(err) {
          console.log('Something went wrong when retrieving an access token', err);
    });
}

function getNewReleases(rep) {
  spotifyApi.getNewReleases({ limit : LIMIT, offset: LIMIT * rep, country: 'SE' })
    .then(function(data) {
      songs = songs.concat(data.body.albums.items);
      if(rep != 0) {
        getNewReleases(rep - 1);
      }
      console.log(songs);
      }, function(err) {
         console.log("Something went wrong!", err);
      });
}





var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
      res.sendStatus(200);
  } else {
      next();
  }
};
app.use(allowCrossDomain);


app.get('/api/v1/get-access', function (req, res) {
  // res.jsonp(getToken());
  console.log('access!!');
});

app.get('/api/v1/songs', function (req, res) {
  res.json(songs);
  console.log(songs);
  console.log('songs!');
  // res.jsonp({"foo": "bar"});
});

// Listen to port 5000
app.listen(8000, function () {
  console.log('Dev app listening on port 8000!');
});
