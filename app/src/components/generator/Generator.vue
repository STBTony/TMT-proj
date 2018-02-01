<template>
  <div>
    <div class="btn-find">
      <p>{{ msg }}</p>
      <p class="input-bpm">
        <input name="bpm" id="bpm" v-model="bpm" min="0" max="300">
        <label for="bpm">BPM</label>
      </p>
      <nav class="cl-effect-18 get-tracklist">
        <a @click="getTrackList"> Gimme some love. </a>
      </nav>
      <div class="section">
        <table v-if="data.trackList.length != 0" id="song-feat">
          <tr>
            <th>Name</th>
            <th>Artist</th>
            <th class="no-display-mobile">Tempo</th>
          </tr>
          <tr v-for="track in data.trackList">
            <td>{{track.name}}</td>
            <td>{{track.artists.map(function(artist){return artist.name}).toString()}}</td>
            <td class="no-display-mobile">{{track.analysis.tempo}}</td>
          </tr>
        </table>
      </div>
      <nav v-if="data.trackList.length != 0" class="cl-effect-18 create-playlist">
        <a v-if="data.playlistURL === null" @click="createPlaylist"> Export playlist.</a>
        <a v-if="data.playlistURL !== null" v-bind:href="data.playlistURL" target="_blank">Here's your playlist!</a>
      </nav>
    </div>
  </div>
</template>

<script>
var apiURL = ''
apiURL = 'http://localhost:5000'

export default {
  name: 'Generator',
  data () {
    return {
      msg: 'Sup bitches.',
      bpm: 120,
      duration: 30,
      genre: 'Funk',
      data: {
        trackList: [],
        playlistURL: null
      }
    }
  },
  methods: {
    getTrackList () {
      this.$http.get(apiURL + '/api/v1/generate', {
        params: {
          bpm: this.bpm,
          duration: this.duration,
          genre: this.genre
        }
      }).then(response => {
        // get body data
        this.data.trackList = response.body
        console.log(response.body)
        this.data.playlistURL = null
      }, response => {
        // error callback
        console.log(response)
      })
    },
    createPlaylist () {
      this.$http.post(apiURL + '/api/v1/create-playlist', {
          name: 'HIPEASS ' + this.bpm + ' BPM ' + ' NEW ON SPOTIFY PLAYLIST',
          trackList: this.data.trackList
        }).then(response => {
        // get body data
        this.data.playlistURL = response.body.external_urls.spotify
        console.log(this.data.playlistURL)
      }, response => {
        // error callback
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>

p, a {
  font-size: 25px;
}

.btn-find {
  width: 100%;
  text-align: center;
}

.input-bpm {
  margin: 15px 25px;
}

.input-bpm input {
  background: transparent !important;
  border: none !important;
  font-size: 120px;
  font-weight: 100;
  width: 220px;
  text-align: right;
}

.input-bpm label {
  font-weight: 800;
}

#song-feat {
  width: 100%;
  text-align: center;
  padding-left: 25%;
  padding-right: 25%;
  margin-top: 60px;
  margin-bottom: 60px;
  font-size: 25px;
}

#song-feat tr {
  margin: 15px 0px;
  font-size: 20px;
}

#song-feat td {
  font-weight: 300;
  width: 80px;
}

.create-playlist {
  margin-bottom: 120px;
}

nav a {
  position: relative;
  display: inline-block;
  margin: 30px;
  outline: none;
  color: #fff;
  text-decoration: none;
  letter-spacing: 1px;
  font-size: 25px;
}

nav a:hover,
nav a:focus {
  outline: none;
}

.cl-effect-18 {
  position: relative;
  z-index: 1;
}

.cl-effect-18 a {
  padding: 0 5px;
  color: #c0c0c0;
  font-weight: 700;
  -webkit-transition: color 0.3s;
  -moz-transition: color 0.3s;
  transition: color 0.3s;
}

.cl-effect-18 a::before,
.cl-effect-18 a::after {
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
  background: #e6e6e6;
  content: '';
  z-index: -1;
  -webkit-transition: -webkit-transform 0.3s, opacity 0.3s;
  -moz-transition: -moz-transform 0.3s, opacity 0.3s;
  transition: transform 0.3s, opacity 0.3s;
  pointer-events: none;
}

.cl-effect-18 a::before {
  -webkit-transform: translateY(-20px);
  -moz-transform: translateY(-20px);
  transform: translateY(-20px);
}

.cl-effect-18 a::after {
  -webkit-transform: translateY(20px);
  -moz-transform: translateY(20px);
  transform: translateY(20px);
}

.cl-effect-18 a:hover,
.cl-effect-18 a:focus {
  color: #fff;
}

.cl-effect-18 a:hover::before,
.cl-effect-18 a:hover::after,
.cl-effect-18 a:focus::before,
.cl-effect-18 a:focus::after {
  opacity: 0.7;
}

.cl-effect-18 a:hover::before,
.cl-effect-18 a:focus::before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
  background: #c0c0c0;
}

.cl-effect-18 a:hover::after,
.cl-effect-18 a:focus::after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  transform: rotate(-45deg);
  background: #c0c0c0;
}


@media (max-width: 961px) and (min-width:320px) { /* smartphones, iPhone, portrait 480x320 phones */ 
  #song-feat {
    width: 200px;
    padding: 0;
    text-align: center;
    margin: 0 auto;
  }
  .section {
    width: 100%;
    text-align: center;
  }
  #song-feat tr {
    font-size: 15px;
  }
  .no-display-mobile {
    display: none;
  }
}
@media (min-width:481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */ }
@media (min-width:641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */ }
@media (min-width:961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
@media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
@media (min-width:1281px) { /* hi-res laptops and desktops */ }


</style>
