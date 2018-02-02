<template>
  <div class="loading-screen">
    <div v-bind:style="styles" class="spinner"></div>
  </div>

</template>
<script>
export default {
  props: {
    size: {
      default: '50px'
    }
  },
  computed: {
    styles () {
      return {
        width: this.size,
        height: this.size
      }
    }
  }
}
</script>
<style scoped>
  .loading-screen {
    height: 100%;
    width:  100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color:rgba(255, 255, 255, 0.2);
    z-index: 100;
    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -ms-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
  }
  .spinner {
    transform: translate3d(0, 0, 0);
    position: relative;
    background: #bec8ff;
    border-radius: 50%;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .spinner:before, .spinner:after {
    content: '';
    position: absolute;
    top: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .spinner:before {
    animation: circle-5-spinner 1s infinite;
    transform-origin: 0 50%;
    left: 0;
    background: #c7efcf;
  }
  .spinner:after {
    animation: circle-5-spinner 1s 0.2s reverse infinite;
    transform-origin: 100% 50%;
    right: 0;
    background: #fff;
  }
  @keyframes circle-5-spinner {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>