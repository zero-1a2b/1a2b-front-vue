import Vue from 'vue'
import Router from 'vue-router'
import GameStart from '@/components/GameStart'
import GameUI from '@/components/GameUI'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'game_start',
      component: GameStart
    },
    {
      path: '/game/:id',
      name: 'game_ui',
      component: GameUI
    }
  ]
})
