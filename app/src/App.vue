<template>
  <div id="app">
    <div id="bg"></div>
    <h1 class="title unselectable">TMT Spotify Playlist Generator</h1>
    <div id="overlay"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Josefin+Sans:100,300,400');

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
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: url('assets/record.jpg') no-repeat center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.title {
  font-weight: 800;
  text-align: center;
  font-size: 60px;
  margin-top: 15vh;
}

h1, h2, h3, p, a, span, button {
  font-weight: 300;
  color: #fff;
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
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(to top, #808080 0%, #b0b0b0 100%);
  opacity: 0.6;
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

</style>
