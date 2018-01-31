var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let MAX_REP = 10;
let LIMIT = 50;
let COUNTRY = 'CA';
let BPM_THRESHOLD = 5;
let SONG_PER_ALBUM = 5;
let TOT_REP = 1;

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
        }, 8000);
      })(TOT_REP);
    }, function(err) {
          console.log('Something went wrong when retrieving an access token', err);
    });
}

function init(rep) {
  console.log('curernt track list: ' + trackList.length);
  console.log('get new release!');
  getNewReleases(rep);
}

// store new releases into newReleases
function getNewReleases(rep) {
  var fullInfo = [];
  var songList = [];
  spotifyApi.getNewReleases({ limit : LIMIT, offset: LIMIT * rep, country: COUNTRY })
  .then(function(data) {
    fullInfo = data.body.albums.items;
    console.log('got ' + fullInfo.length + ' new releases');
    // if (rep != 0) {
    //   setTimeout(function() {
    //     getNewReleases(rep - 1);
    //   }, 2000);
    // }
    return fullInfo.map(function(t) { return t.id; });
  })
  .then(function(data) {
    return data.map(function(t, index) {
      spotifyApi.getAlbumTracks(t, { limit : SONG_PER_ALBUM, offset : 0 })
      .then(function(data) {
        fullInfo[index].tracks = data.body;
        songList = songList.concat(data.body.items);
        if (index === fullInfo.length - 1) {
          console.log('got ' + songList.length + ' new tracks');
          newReleases = newReleases.concat(fullInfo);
          getTrackFeatures(songList);
        }
      })
    });
  })
  .catch(function(error) {
    console.log('error getting new releases ');
    console.error(error);
  });
}

// get track features and store the track info and analysis into trackList
function getTrackFeatures(songList) {
  var trackIds = songList.map(function(song) {
    return song.id;
  });
  var tempSongList = songList;
  spotifyApi.getAudioFeaturesForTracks(trackIds)
  .then(function(data) {
    console.log('got audio features');
    songList.map(function(song, index) {
      tempSongList[index].analysis = data.body.audio_features[index];
    });
    trackList = trackList.concat(tempSongList);
  }, function(err) {
    console.log('error getting audio features ');
    console.error(err);
  });
}

function generate(param) {
  var generated = [];
  for (var i = trackList.length - 1; i >= 0; i--) {
    if (Math.abs(parseInt(trackList[i].analysis.tempo) - parseInt(param.bpm)) < BPM_THRESHOLD) {
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

app.use(express.static(__dirname + '/dist'));
// app.get('/', function (req, res) {
//   res.send('dist/index.html');
//   console.log('Shit we are discovered!');
// });

app.post('/api/v1/get-access', function (req, res) {
  res.json(getToken());
  console.log('access!!');
});

app.post('/api/v1/add-more-to-server', function (req, res) {
  getNewReleases(req.query.offset);
  console.log('add more!!');
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

var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('listening on port ' + port);
});
