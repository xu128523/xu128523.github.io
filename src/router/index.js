import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    { path: '/', redirect: '/shedule'},
    {
      path: '/shedule',
      component: resolve => require(['@/views/shedule/index.vue'], resolve),
    }
  ],
})

export default router
