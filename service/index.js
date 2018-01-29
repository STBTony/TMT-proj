var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let MAX_REP = 10;
let LIMIT = 50;
let COUNTRY = 'CA';

var newReleases = [];

var trackList = [];

console.log('++++++++++++ Server Starts ++++++++++++');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '0d84ec941055454db69a02b84e2089aa',
  clientSecret : '76d22bbf58314aee932165dff0ca16e5'
});

getToken();

// authenticate and get token
function getToken() {
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);

      (function theLoop (i) {
        setTimeout(function () {
          init(i);
          if (--i) {          // If i > 0, keep going
            theLoop(i);       // Call the loop again, and pass it the current value of i
          }
        }, 5000);
      })(6);
    }, function(err) {
          console.log('Something went wrong when retrieving an access token', err);
    });
}

function init(rep) {
  setTimeout(function() {
    getNewReleases(rep);
    console.log('yay');
    console.log(rep);
  }, 5000);
}

// store new releases into newReleases
function getNewReleases(rep) {
  var fullInfo = [];
  var songList = [];
  spotifyApi.getNewReleases({ limit : LIMIT, offset: LIMIT * rep, country: COUNTRY })
  .then(function(data) {
    console.log('got new releases');
    fullInfo = data.body.albums.items;
    // if (rep != 0) {
    //   setTimeout(function() {
    //     getNewReleases(rep - 1);
    //   }, 2000);
    // }
    return fullInfo.map(function(t) { return t.id; });
  })
  .then(function(data) {
    return data.map(function(t, index) {
      spotifyApi.getAlbumTracks(t, { limit : 1, offset : 0 })
      .then(function(data) {
        fullInfo[index].tracks = data.body;
        songList = songList.concat(data.body.items);
        if (index === fullInfo.length - 1) {
          console.log('got new tracks');
          newReleases = newReleases.concat(fullInfo);
          getTrackFeatures(songList);
        }
      })
    });
  })
  .catch(function(error) {
    console.log('get new releases error');
    console.error(error);
  });
}

// get track features and store the track info and analysis into trackList
function getTrackFeatures(songList) {
  var trackIds = songList.map(function(song) {
    return song.id;
  });
  var tempSongList = songList;
  console.log(trackIds.length);
  spotifyApi.getAudioFeaturesForTracks(trackIds)
  .then(function(data) {
    console.log('got audio features');
    console.log(data.body.audio_features);
    songList.map(function(song, index) {
      tempSongList[index].analysis = data.body.audio_features[index];
    });
    trackList = trackList.concat(tempSongList);
  }, function(err) {
    console.log('get track features error');
    console.error(err);
  });
}

function generate(param) {
  var generated = [];
  for (var i = trackList.length - 1; i >= 0; i--) {
    if (Math.abs(parseInt(trackList[i].analysis.tempo) - parseInt(param.bpm)) < 5) {
      // console.log(trackList[i].analysis.tempo - param.bpm);
      generated.push(trackList[i]);
    }
  }
  return generated;
}

// fix dev env local host header
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

app.post('/api/v1/get-access', function (req, res) {
  res.json(getToken());
  console.log('access!!');
});

app.post('/api/v1/add-more-to-server', function (req, res) {
  getNewReleases(req.query.offset);
});

app.get('/api/v1/new-releases', function (req, res) {
  res.json(newReleases);
  console.log(req.query);
  console.log('newReleases!');
});

app.get('/api/v1/generate', function (req, res) {
  // generate(newReleases, request.query);
  res.json(generate(req.query));
  console.log(req.query);
  console.log('generate!');
});

// Listen to port 5000
app.listen(8000, function () {
  console.log('Dev app listening on port 8000!');
});
