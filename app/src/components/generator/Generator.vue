<template>
  <div>
    <div class="btn-find">
      <p>{{ msg }}</p>
      <nav class="cl-effect-18">
        <a @click="getSongList"> Gimme some love. </a>
      </nav>
      <div id="song-feat">
        <p v-for="song in data.songList">
          <span v-for="value in song">
            {{ value }}
          </span>
        </p>

      </div>
    </div>
  </div>
</template>

<script>
let apiURL = 'http://localhost:8000'

export default {
  name: 'Index',
  data () {
    return {
      msg: 'Sup bitches.',
      data: {
        songList: []
      }
    }
  },
  methods: {
    getSongList () {
      this.$http.get(apiURL + '/api/v1/songs').then(response => {
        // get body data
        this.someData = response.body
        console.log(this.someData)
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
  height: 10000px;
}

.song-feat {
  margin: 15px, 25px;
}

nav a {
  position: relative;
  display: inline-block;
  margin: 15px 25px;
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
  color: #9d9d9d;
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
  background: #9d9d9d;
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
}

.cl-effect-18 a:hover::after,
.cl-effect-18 a:focus::after {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

</style>
