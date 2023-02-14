<template>
  <MainMenu v-if="state=='menu'" @buttonSelected="handleSelect"></MainMenu>
  <Game v-if="state == 'singleplayer' || state == 'multiplayer'" :gameVar="state" @back="setTabMenu"></Game>
</template>

<script>
import MainMenu from './components/MainMenu.vue'
import Game from './components/Game.vue'

export default {

  name: 'App',

  components: {
    MainMenu,
    Game,
  },

  data() {
    return {
      state: "menu",

    }
  },

  methods: {
    handleSelect(button){
      this.state = button
    },

    setTabMenu(){
      this.state = "menu"
    },

  },

}
</script>

<style>
</style>
