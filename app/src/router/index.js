import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/generator/Generator'
import VueResource from 'vue-resource'
Vue.use(VueResource);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    }
  ]
})
