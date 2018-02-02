<template>
  <div id="app">
    <div v-if="!preloading">
      <div id="bg" v-bind:style="{ backgroundImage: 'url(' + image + ')' }"></div>
      <h1 class="title unselectable">TMT Music Playlist Generator</h1>
      <div id="overlay"></div>
      <router-view/>
    </div>
    <loading-screen v-if="preloading"></loading-screen>
    <div class="credit">
      <span id="left">A TMT Project.</span>
      <span id="right">Built with passion and pain by <a target="_blank" href="https://tontytont.github.io">Tontytont</a>.</span>
    </div>
  </div>
</template>

<script>
import LoadingScreen from './components/LoadingScreen'

let bg = ['girl', 'guitar', 'piano', 'record']

export default {
  name: 'App',
  components: {
    LoadingScreen
  },
  data() {
    return {
      preloading: false,
      image: 'static/img/' + bg[Math.floor(Math.random() * 4)] + '-min.jpg'
    }
  },
  mounted() {
    setTimeout(function() {
      this.preloading = false
    }, 1000)
  }
}
</script>

<style>
/*@import url('https://fonts.googleapis.com/css?family=Josefin+Sans:100,300,400');*/

html {
  overflow: -moz-scrollbars-none;
}
html::-webkit-scrollbar { width: 0 !important }

::selection {
  background: #bec8ff; /* WebKit/Blink Browsers */
}

::-moz-selection {
  background: #bec8ff; /* Gecko Browsers */
}

#bg {
  z-index: -100;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  /*background: url('assets/girl.jpg') no-repeat center fixed;*/
  background: url('assets/record-min.jpg');
  background: url('assets/piano-min.jpg');
  background: url('assets/girl-min.jpg');
  background: url('assets/guitar-min.jpg');
  background: no-repeat center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.title {
  font-weight: 800;
  text-align: center;
  font-size: 150px;
  margin-top: 100px;
  margin-bottom: 0px;
  text-decoration: none;
  letter-spacing: 10px;
  /*text-shadow: 5px 0 #707dc7;*/
}

h1, h2, h3, p, a, span, button, input, table, label {
  font-weight: 300;
  color: #fff;
  font-family: 'Josefin Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a:hover {
 cursor: pointer;
}
button {
  border: none;
  background: none;
}


#app {
  font-family: 'Josefin Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#overlay {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(to top, #000 0%, #000 100%);
  opacity: 0.4;
  z-index: -1;
}

.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.credit {
  position: fixed;
  bottom: 5px;
  left: 0px;
  width: 100%;
  font-size: 15px
}

.credit #right {
  float: right;
  margin-right: 5px; 
}
.credit #left {
  margin-left: 5px; 
}

@media (min-width:320px) and (max-width: 961px) { /* smartphones, iPhone, portrait 480x320 phones */ 

  .title {
    font-size: 60px;
    letter-spacing: 2px;
  }

  .credit {
    position: relative;
  }

}
@media (max-width: 1281px) and (min-width:961px) { /* smartphones, iPhone, portrait 480x320 phones */ 
  .title {
    font-size: 140px;
  }
}
@media (min-width:481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */ }
@media (min-width:641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */ }
@media (min-width:961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
@media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
@media (min-width:1281px) { /* hi-res laptops and desktops */ }


</style>
