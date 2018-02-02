<template>
  <div>
    <div class="generate-song">
      <p id="msg">{{ msg }}</p>
      <div class="row params">
        <div class="col-md-4 col-sm-12">
          <div class="input-generic">
            <input id="listLength" type="number" number maxlength="3" v-model="listLength" min="0" pattern="\d{3}" max="300">
            <label>Track<label v-if="listLength > 1">s</label></label>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="input-generic">
            <input name="bpm" id="bpm" type="number" number maxlength="3" v-model="bpm" min="0" pattern="\d{3}" max="300">
            <label for="bpm">BPM</label>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="input-generic"><!-- 
            <input name="bpm" id="bpm" type="number" number maxlength="3" v-model="bpm" min="0" pattern="\d{3}" max="300">
            <label for="bpm">BPM</label> -->
            <h2>{{genre}}<label for="bpm">Genre</label></h2>
            <p>New features coming soon!</p>
          </div>
        </div>
      </div>
      <nav class="cl-effect-18 get-tracklist">
        <a @click="getTrackList"> {{generateMsg}} </a>
      </nav>
    </div>
    <div class="section">
      <table v-if="data.trackList.length != 0" id="song-feat">
        <tr>
          <th>Name</th>
          <th>Artist</th>
          <th class="no-display-mobile">Tempo</th>
          <th>Source</th>
        </tr>
        <tr v-for="track in data.trackList">
          <td>{{track.name}}</td>
          <td>{{track.artists.map(function(artist){return artist.name}).toString()}}</td>
          <td class="no-display-mobile">{{track.analysis.tempo}}</td>
          <td><a target="_blank" v-bind:href="track.external_urls.spotify">Get the Track</a></td>
        </tr>
      </table>
    </div>
    <nav v-if="data.trackList.length != 0" class="cl-effect-18 create-playlist">
      <a v-if="data.playlistURL === null" @click="createPlaylist"> {{exportMsg}}</a>
      <a v-if="data.playlistURL !== null" v-bind:href="data.playlistURL" target="_blank">Here's your playlist!</a>
    </nav>
    <loading-screen v-if="loading" ></loading-screen>
  </div>
</template>

<script>
import LoadingScreen from '../../components/LoadingScreen'
var apiURL = ''
// apiURL = 'http://localhost:5000'
export default {
  name: 'Generator',
  components: {
    LoadingScreen
  },
  data () {
    return {
      msg: 'Welcome to the heaven of freshly generated playlist.',
      exportMsg: 'Export Playlist!',
      generateMsg: 'Create a Playlist!',
      bpm: 120,
      listLength: 30,
      duration: 30,
      genre: 'ALL',
      loading: true,
      data: {
        trackList: [],
        playlistURL: null
      }
    }
  },
  mounted () {
    this.loading = false
    // document.getElementById('bpm').focus()
  },
  methods: {
    getTrackList () {
      console.log(bpm);
      if (this.bpm <= 0 || this.bpm > 300 || this.listLength < 0 || this.listLength > 300) {
        this.msg = 'Those values are not valid!\n'
        return;
      }
      this.loading = true
      this.$http.get(apiURL + '/api/v1/generate', {
        params: {
          bpm: this.bpm,
          duration: this.duration,
          genre: this.genre,
          listLength: this.listLength
        }
      }).then(response => {
        // get body data
        this.data.trackList = response.body
        console.log(response.body)
        this.data.playlistURL = null
        this.loading = false
        if (this.data.trackList.length !== 0) {
          setTimeout(function(){
            window.scroll({top: 800, left: 0, behavior: 'smooth'})
          }, 0)
          this.generateMsg = 'Create another one!'
          this.msg = 'Enjoy your playlist!'
        } else {
          this.generateMsg = 'Something went wrong! Try again.'
        }
      }, response => {
        // error callback
        this.loading = false
        this.generateMsg = 'Something went wrong! Try again.'
        console.log(response)
      })
    },
    createPlaylist () {
      this.loading = true
      this.$http.post(apiURL + '/api/v1/create-playlist', {
          name: 'HIPEASS ' + this.bpm + ' BPM ' + ' NEW ON SPOTIFY PLAYLIST',
          trackList: this.data.trackList
        }).then(response => {
        // get body data
        this.loading = false
        console.log(response.body)
        this.exportMsg = 'Export Playlist.'
        if (response.body === "well shit") {
          this.exportMsg = 'Something went wrong! Try again.'
          return; // error
        }
        this.data.playlistURL = response.body.external_urls.spotify
      }, response => {
        // error callback
        this.loading = false
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

.generate-song {
  width: 100%;
  text-align: center;
  margin-bottom: 60px;
}

#msg {
  margin-top: 50px;
  margin-bottom: 50px;
}

.params {
  margin-left: 50px;
  margin-right: 50px;
}

.input-generic {
  margin: 15px 25px;
}

.input-generic input {
  background: transparent !important;
  /*border: none !important;*/
  font-size: 150px;
  font-weight: 100;
  width: 260px;
  text-align: right;
  border: none;
}

.input-generic h2 {
  font-size: 120px;
  font-weight: 100;
  margin-top: 60px;
  cursor: not-allowed;
}
.input-generic p {
  margin-top: -30px;
  font-size: 20px;
}


.input-generic label {
  font-weight: 800;
  font-size: 40px;
  /*text-shadow: 4px 0 #707dc7;*/
}

#song-feat {
  width: 60%;
  margin: 120px auto;
  padding-left: 60px;
  padding-right: 60px;
  font-size: 25px;
}

#song-feat tr, th, a {
  text-align: left;
  font-size: 20px;
  padding-bottom: 20px;
}

#song-feat a:hover {
  color: #e0e0e0;
}

#song-feat th {
  /*text-shadow: 4px 0 #707dc7;*/
  font-size: 30px;
}

#song-feat td {
  font-weight: 300;
  width: 80px;
  padding-bottom: 10px;
}

.create-playlist {
  text-align: center;
  margin-top: 300px;
  margin-bottom: 400px;
}

.create-playlist a {
  font-size: 100px;
}

.generate-song a {
  font-size: 60px;
}

.section {
  width: 100%;
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
  #song-feat tr, #song-feat a {
    font-size: 15px;
  }
  #song-feat th {
    font-size: 20px;
  }
  .no-display-mobile {
    display: none;
  }
  .input-generic input, .input-generic h2 {
    font-size: 80px;
    text-align: center;
    margin-left: -15px;
  }
  .generate-song a, .create-playlist a {
    font-size: 20px;
  }
  .create-playlist {
    margin-top: 15px;
    margin-bottom: 60px;
  }
}

@media (max-width: 1281px) and (min-width:961px) { /* smartphones, iPhone, portrait 480x320 phones */ 

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
  color: #fff;
  font-weight: 800;
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


@media (min-width:481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */ }
@media (min-width:641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */ }
@media (min-width:961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
@media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
@media (min-width:1281px) { /* hi-res laptops and desktops */ }

/*input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}*/
</style>
