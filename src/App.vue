<template>
  <MainMenu v-if="state=='menu' || lingerState=='menu'" @buttonSelected="handleSelect"/>
  <HowTo v-if="state=='howto' || lingerState=='howto'" @back="setTabMenu"/>
  <Game v-if="state=='game' || lingerState=='game'" :gameVars="gameVars" :settingsData="settingsData" @statInc="statisticsIncrement" @playAgain="playAgain" @back="setTabMenu"/>
  <statistics v-if="state=='statistics' || lingerState=='statistics'" :statisticsData="statisticsData" @back="setTabMenu"/>
  <Settings v-if="state=='settings' || lingerState=='settings'" :settingsData="settingsData" @back="setTabMenu"/>
</template>

<script>
import MainMenu from './components/MainMenu.vue'
import Game from './components/Game.vue'
import HowTo from './components/HowTo.vue'
import Statistics from './components/Statistics.vue'
import Settings from './components/Settings.vue'
import { toNumber } from '@vue/shared'

export default {

  name: 'App',

  components: {
    MainMenu,
    Game,
    HowTo,
    Statistics,
    Settings,
  },

  data() {
    return {
      state: "menu", // State of the app. menu - MainMenu; game - Game; howto - HowTo; statistics - Statistics; settings - Settings;
      lingerState: null, // The old state of the app. stays for
      settingsData: {
        animationDelay: 300, // in ms
        baseDepth: 11, // base depth of AI
        evalBar: false, // Display eval bar?
      },
      gameVars: {}, // Game config
      statisticsData: {
        timePlayed: 0,
        winsAgainstCPUp1: 0,
        winsAgainstCPUp2: 0,
        gamesStarted: 0,
        gamesFinished: 0,
        movesMade: 0,
        bonusMovesMade: 0,
        capturesMade: 0,
      },
      intervals: {},
    }
  },

  mounted(){
    // Fetch all of the statistics from localdata
    for (const stat in this.statisticsData){
      let value = localStorage.getItem(stat)
      if (value){
        this.statisticsData[stat] = value
        // console.log(this.statisticsData[stat])
      }
    }

    // Update localdata with current statistics every second
    setInterval(() => {
      this.statisticsData.timePlayed++
      for (let i in this.statisticsData){
        localStorage.setItem(i, this.statisticsData[i]);
      }
    }, 1000);
  },

  methods: {
    handleSelect(button){
      switch(button){
        case "singleplayer":
          this.gameVars = {
            P1Start: true,
            CPU: 1,
          }
          this.state = "game"
          break
        case "singleplayerp2":
          this.gameVars = {
            P1Start: false,
            CPU: 1,
          }
          this.state = "game"
          break
        case "multiplayer":
          this.gameVars = {
            P1Start: true,
            CPU: 0,
          }
          this.state = "game"
          break
        default:
          this.state = button
      }
      
    },

    playAgain(){
      // console.log(1)
      this.state = "rand"
      setTimeout(() => {
        this.state = "rand1"
        setTimeout(() => {
          this.state = "game"
        }, 1);
      }, 400);
    },
    
    statisticsIncrement(name, value){
      this.statisticsData[name] = value + toNumber(this.statisticsData[name])
    },
    
    setTabMenu(){
      this.state = "menu"
    },

  },

  watch:{
    state(newVal, oldVal){
      // Allows the tab to live for a second after being closed
      // (IF TABS ARE BEING SWITCHED BACK AND FORWARD TOO QUICKLY THEY WILL BREAK BUT IT SHOULD BE IMPOSSIBLE TO GO THAT FAST :) )

      //linger the tab
      this.lingerState = oldVal
      setTimeout(() => {
        this.lingerState = null
      }, 500);
    },

    'settingsData.baseDepth': function(newVal, oldVal){
      if(this.intervals.baseDepth){
        clearTimeout(this.intervals.baseDepth)
      }
      this.intervals.baseDepth = setTimeout(() => {
        if(this.settingsData.baseDepth < 1){
          this.settingsData.baseDepth = 1
        }
        if(this.settingsData.baseDepth > 12){
          this.settingsData.baseDepth = 12
        }
      }, 750);
    },

    'settingsData.animationDelay': function(newVal, oldVal){
      if(this.intervals.animationDelay){
        clearTimeout(this.intervals.animationDelay)
      }
      this.intervals.animationDelay = setTimeout(() => {
        if(this.settingsData.animationDelay < 0){
          this.settingsData.animationDelay = 0
        }
      }, 750);
    },

  }

}
</script>

<style>
</style>
