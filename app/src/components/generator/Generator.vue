<template>
  <div>
    <div class="btn-find">
      <p>{{ msg }}</p>
      <p class="input-bpm">
        <input name="bpm" id="bpm" v-model="bpm" min="0" max="300">
        <label for="bpm">BPM</label>
      </p>
      <nav class="cl-effect-18">
        <a @click="gettrackList"> Gimme some love. </a>
      </nav>
      <table id="song-feat">
        <tr>
          <th>Name</th>
          <th>Artist</th>
          <th>Tempo</th>
        </tr>
        <tr v-for="track in data.trackList">
<!--           <span v-for="value in song">
            {{ value }}
          </span> -->
          <td>{{track.name}}</td>
          <td>{{track.artists.map(function(artist){return artist.name}).toString()}}</td>
          <td>{{track.analysis.tempo}}</td>
        </tr>

      </table>
    </div>
  </div>
</template>

<script>
let apiURLDev = 'http://localhost:8000'
let apiURL = 'https://tmtproj.herokuapp.com'

export default {
  name: 'Generator',
  data () {
    return {
      msg: 'Sup bitches.',
      bpm: 120,
      duration: 30,
      genre: 'Funk',
      data: {
        trackList: []
      }
    }
  },
  methods: {
    gettrackList () {
      console.log(this.bpm);
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
      }, response => {
        // error callback
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>

.btn-find {
  width: 100%;
  text-align: center;
}

#song-feat {
  width: 100%;
  text-align: center;
  padding-left: 25%;
  padding-right: 25%;
  margin-bottom: 60px;
}

#song-feat tr {
  margin: 15px 0px;
}

#song-feat td {
  font-weight: 300;
  width: 80px;
}


.input-bpm {
  margin: 15px 25px;
}

.input-bpm input {
  background: transparent !important;
  border: none !important;
  font-size: 100px;
  font-weight: 100;
  width: 200px;
  text-align: right;
}

.input-bpm label {
  font-weight: 800;
}

nav a {
  position: relative;
  display: inline-block;
  margin: 30px;
  outline: none;
  color: #fff;
  text-decoration: none;
  letter-spacing: 1px;
  font-size: 1.35em;
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

</style>
