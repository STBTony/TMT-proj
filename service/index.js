var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express')
var app = express()
var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

let LIMIT = 50;
let COUNTRY = 'CA';
let BPM_THRESHOLD = 3;
let SONG_PER_ALBUM = 50;
let TOT_REP = 10;
let API_SIZE_LIMIT = 100;

var redirectUri = 'https://stbtony.github.io/TMT-proj';
// var redirectUri = 'http://localhost:5000/api/v1/callback';

var newReleases = [];

var trackList = [];

var userSpotify = {};

console.log('++++++++++++ Server Starts ++++++++++++');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '0d84ec941055454db69a02b84e2089aa',
  clientSecret : '76d22bbf58314aee932165dff0ca16e5'
});

var userSpotifyApi = new SpotifyWebApi({
  clientId : '0d84ec941055454db69a02b84e2089aa',
  clientSecret : '76d22bbf58314aee932165dff0ca16e5',
  redirectUri : redirectUri
});

getToken(true);
setInterval(function() {
  console.log("refershing token automatically");
  refreshUserAccess();
  getToken(false);
}, 1800000);

// authenticate and get token
function getToken(onStart) {
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      if (onStart === true) {
        (function theLoop (i) {
          setTimeout(function () {
            init(i);
            if (--i) {          // If i > 0, keep going
              theLoop(i);       // Call the loop again, and pass it the current value of i
            }
          }, 10000);
        })(TOT_REP);
      }
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
        // if (data.body.items.length + songList.length <= API_SIZE_LIMIT) {
        // }
        if (index === fullInfo.length - 1) {
          console.log('got ' + songList.length + ' new tracks');
          newReleases = newReleases.concat(fullInfo);

          while (songList.length > 0) {
            var songListChunk = songList.splice(0, API_SIZE_LIMIT);
            getTrackFeatures(songListChunk);
          }
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function generate(param) {
  trackList = shuffle(trackList);
  var generated = [];
  var count = 0;
  for (var i = trackList.length - 1; i >= 0; i--) {
    if (Math.abs(parseInt(trackList[i].analysis.tempo) - parseInt(param.bpm)) < BPM_THRESHOLD) {
      count ++;
      // console.log(trackList[i].analysis.tempo - param.bpm);
      generated.push(trackList[i]);
      if (count === parseInt(param.listLength)) {
        return generated;
      }
    }
  }
  return generated;
}

// function createPlaylist(param) {
//     // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
//     var playlist;
//     var userId = '22hmgfkwzzikpio72fafb2tla';
//     userSpotifyApi.createPlaylist(userId, param.name, { 'public' : true })
//     .then(function(data) {
//       console.log('Created playlist: ' + data.body.id)
//       var tempStr = 'spotify:track:';
//       var parsedTrackList = [];
//       for (var i = 0; i < param.trackList.length; i++) {
//         parsedTrackList.push(tempStr + param.trackList[i].id);
//       }
//       playlist = data.body;
//       spotifyApi.addTracksToPlaylist(userId, playlist.id, parsedTrackList)
//         .then(function(data) {
//           console.log('Added tracks to playlist!');
//           return playlist;
//         }, function(err) {
//           console.log('Error add tracks to playlist!', err);
//           return playlist;
//         });
//     }, function(err) {
//       console.log('Error Create Playlist!', err);
//     });
// }

function userAuthenticate() {
  var scopes = ['playlist-modify-public', 'playlist-modify-private'],
      redirectUri = redirectUri,
      state = 'some-state-of-my-choice';
  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.

  // Create the authorization URL
  var authorizeURL = userSpotifyApi.createAuthorizeURL(scopes, state);
  return authorizeURL;
}

function refreshUserAccess() {
  userSpotifyApi.refreshAccessToken()
  .then(function(data) {
    console.log('The access token has been refreshed!');

    // Save the access token so that it's used in future calls
    userSpotifyApi.setAccessToken(data.body['access_token']);
    return 'success';
  }, function(err) {
    console.log('Could not refresh access token', err);
    return 'shit';
  });
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

app.post('/api/v1/get client token', function (req, res) {
  console.log('get client token');
  res.json(getToken());
});

app.post('/api/v1/refresh-user-access', function (req, res) {
  console.log('refresh user access');
  res.json(refreshUserAccess());
});

app.get('/api/v1/refresh-user-access', function (req, res) {
  console.log('local testing refresh user access');
  res.json(refreshUserAccess());
});

app.post('/api/v1/add-more-to-server', function (req, res) {
  getNewReleases(req.body.offset);
  console.log('add more!!');
});

app.get('/api/v1/new-releases', function (req, res) {
  res.json(newReleases);
  console.log(req.query);
  console.log('newReleases!');
});

app.get('/api/v1/generate', function (req, res) {
  res.json(generate(req.query));
  console.log(req.query);
  console.log('generate!');
});

app.get('/api/v1/user-permission', function (req, res) {
  res.json(userAuthenticate(req.query));
  console.log(req.query);
  console.log('get user permission!');
});

app.post('/api/v1/create-playlist', function (req, res) {
  // res.json(createPlaylist(req.query));
  var param = req.body;
  console.log('create playlist!');
  var playlist;
  var userId = userSpotify.id || '22hmgfkwzzikpio72fafb2tla';
  userSpotifyApi.createPlaylist(userId, param.name, { 'public' : true })
  .then(function(data) {
    playlist = data.body;
    console.log('Created playlist');
    var parsedTrackList = [];
    var tempStr = 'spotify:track:';
    var parsedTrackList = [];
    for (var i = 0; i < param.trackList.length; i++) {
      parsedTrackList.push(tempStr + param.trackList[i].id);
    }
    while (parsedTrackList.length > 0) {
      var parsedChunk = parsedTrackList.splice(0, API_SIZE_LIMIT);
      userSpotifyApi.addTracksToPlaylist(userId, playlist.id, parsedChunk)
        .then(function(data) {
          console.log('Added tracks to playlist!');
          if (parsedTrackList.length === 0) {
            res.json(playlist);
          }
        }, function(err) {
          console.log('Error add tracks to playlist!', err);
          if (parsedTrackList.length === 0) {
            res.json(playlist);
          }
        });
    }

  }, function(err) {
    console.log('Error Create Playlist!', err);
    res.json('well shit');
  });
});

app.post('/api/v1/callback', (req, res) => {
  console.log('uer permission authorizing');
  const code = req.body.code;
  const state = req.body.state;
  console.log('code: ' + code);
  console.log('state: ' + state);
  userSpotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);
    // Set the access token on the API object to use it in later calls
    userSpotifyApi.setAccessToken(data.body['access_token']);
    userSpotifyApi.setRefreshToken(data.body['refresh_token']);
    userSpotifyApi.getMe()
      .then(function(data) {
        console.log('authorized user id:', data.body.id);
        userSpotify.id = data.body.id;
        res.redirect('/#/user/' + data.body.id);
      }, function(err) {
        console.log('Error getting myself!', err);
      });

  }, function(err) {
    console.log('Error authenticating from callback!', err);
    res.redirect('/#/error/invalid token');
  });
});

app.get('/api/v1/callback', (req, res) => {
  console.log('localhost testing callback');
  const { code, state } = req.query;
  console.log('code: ' + code);
  console.log('state: ' + state);
  userSpotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);
    // Set the access token on the API object to use it in later calls
    userSpotifyApi.setAccessToken(data.body['access_token']);
    userSpotifyApi.setRefreshToken(data.body['refresh_token']);
    userSpotifyApi.getMe()
      .then(function(data) {
        console.log('authorized user id:', data.body.id);
        userSpotify.id = data.body.id;
        res.redirect('/#/user/' + data.body.id);
      }, function(err) {
        console.log('Error getting myself!', err);
      });

  }, function(err) {
    console.log('Error authenticating from callback!', err);
    res.redirect('/#/error/invalid token');
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('listening on port ' + port);
});
