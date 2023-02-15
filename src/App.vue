<template>
  <MainMenu v-if="(state=='menu' || lingerState=='menu')" @buttonSelected="handleSelect"></MainMenu>
  <Game v-if="(state == 'singleplayer' || state == 'singleplayerp2' || state == 'multiplayer' || lingerState=='singleplayer' || lingerState=='singleplayerp2' || lingerState=='multiplayer')" :gameVar="state" @back="setTabMenu"></Game>
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
      state: "menu", // State of the app. menu - MainMenu; singleplayer/multiplayer - Game; howto - HowTo; statistics - Statistics; settings - Settings;
      lingerState: null, // The old state of the app. stays for
      settingsData: [],
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

  watch:{
    state(newVal, oldVal){
      // Allows the tab to live for a second after being closed (IF TABS ARE BEING SWITCHED BACK AND FORWARD TOO QUICKLY THEY WILL BREAK BUT IT SHOULD BE IMPOSSIBLE TO GO THAT FAST)
      //linger the tab
      this.lingerState = oldVal
      setTimeout(() => {
      this.lingerState = null
      }, 500);

    }
  }

}
</script>

<style>
</style>
