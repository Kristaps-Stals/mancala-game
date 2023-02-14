<template>
  <div class="absolute text-white w-full h-full" :class="{ todown100: close }">
    <div class="absolute w-3/4 h-1/2" style="top:25%;left:12.5%">
      <div class="absolute w-4/6 h-1/2 bg-blue-500 border-2 gameAnimDown grid grid-cols-6 p-5 gap-5" style="left:16.66666%;top:50%">
        <Pocket :Value="currentGameState[0]" :id="0" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[1]" :id="1" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[2]" :id="2" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[3]" :id="3" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[4]" :id="4" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[5]" :id="5" @buttonPressed="handlePress"/>
      </div>
      <div class="absolute w-1/6 h-full bg-blue-500 border-2 gameAnimRight p-5" style="left:83.33333%">
        <Pocket :Value="currentGameState[6]" :id="6" @buttonPressed="handlePress"/>
      </div>
      <div class="absolute w-4/6 h-1/2 bg-red-500 border-2 gameAnimUp grid grid-cols-6 p-5 gap-5" style="left:16.66666%"> 
        <Pocket :Value="currentGameState[12]" :id="12" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[11]" :id="11" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[10]" :id="10" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[9]" :id="9" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[8]" :id="8" @buttonPressed="handlePress"/>
        <Pocket :Value="currentGameState[7]" :id="7" @buttonPressed="handlePress"/>
      </div>
      <div class="absolute w-1/6 h-full bg-red-500 border-2 gameAnimLeft p-5">
        <Pocket :Value="currentGameState[13]" :id="13" @buttonPressed="handlePress"/>
      </div>
    </div>
    <div class="absolute flex gameAnimNameUp" style="width:12.5%;height:25%">
      <p class="m-auto text-4xl text-red-500">{{ player2Name  }}</p>
    </div>
    <div class="absolute flex gameAnimNameDown" style="width:12.5%;height:25%;top:75%;left:87.5%">
      <p class="m-auto text-4xl text-blue-500">{{ player1Name }}</p>
    </div>
    <div class="absolute flex gameAnimCloseButton" style="width:12.5%;height:25%;left:87.5%">
      <button class="btn-red m-auto w-1/2 h-1/4 text-4xl" @click="backToMenu">EXIT</button>
    </div>
    <div v-if="!gameEnded" class="absolute flex gameAnimNameDown" style="width:25%;height:25%;top:75%;left:37.5%;animation-delay: 1.33s;">
      <p v-if="p1turn" class="m-auto text-6xl">{{ player1Name }}'s turn</p>
      <p v-else class="m-auto text-6xl">{{ player2Name }}'s turn</p>
    </div>
    <div v-if="round>1" class="absolute flex gameAnimNameUp" style="width:25%;height:25%;left:37.5%;animation-delay: 0s;">
      <p class="m-auto text-4xl">Turn {{ round }}</p>
    </div>
    <div v-if="timePassed>60" class="absolute flex gameAnimNameDown" style="width:12.5%;height:25%;top:75%;animation-delay: 0s;">
      <p class="m-auto text-4xl">{{ formatTime }}</p>
    </div>
  </div>
</template>

<script>
import { thisTypeAnnotation } from '@babel/types'
import Pocket from './Pocket.vue'

export default {

  components: {
    Pocket,
  },

  props: ['gameVar'], // singleplayer or multiplayer
  
  data(){
    return {
      close: false, // Play close animation
      currentGameState: [4,4,4,4,4,4,0,4,4,4,4,4,4,0], // Current game state
      p1turn: true, // Whose turn it is - true means player or player1 and false means cpu or player2
      round: 1, // How many rounds has the game been ongoing for
      timeCreated: 0, // When the game was created in miliseconds (initialized in mounted)
      timePassed: 0, // How long the game has been ongoing
      timeInterval: null, // setInterval object. Defined so it can be stopped on unmount
      moveInProgress: false, // True if move in progress to prevent multi moves
      gameEnded: false, // True when game has ended
    }
  },

  // When game starts
  mounted(){
    var date = new Date()
    this.timeCreated = date.getTime()
    this.timeInterval = setInterval(() => {
      this.updateTime()
    }, 100)
  },

  unmounted(){
    clearInterval(this.timeInterval)
  },

  methods: {
    // When one of the buttons is pressed
    handlePress(id){
      if(this.currentGameState[id] != 0 && !this.moveInProgress){
        if(this.p1turn){
          if(id < 6){
            this.makeMove(id)
          }
        } else {
          if(id > 6 && id < 13){
            this.makeMove(id)
          }
        }
      }
    },

    // Do a move on the board. id - the pocket; player1 - true means player1 is making the move, false means player2 is making the move.
    makeMove(id){

      // Variables
      const TIME_INTERVAL = 150 // in ms
      var gemCount = this.currentGameState[id]
      var currentPocket = id
      var i = 0
      this.moveInProgress = true

      // Empties clicked pocket
      this.currentGameState[currentPocket] = 0

      // Redistributes gems
      for(i = 0; i < gemCount; i++){
        setTimeout(() => {
          currentPocket = this.getNextPocket(currentPocket)
          this.currentGameState[currentPocket]++
        }, TIME_INTERVAL*i);
      }
      // Waits for for loop to be done
      setTimeout(() => {
        // Check for capture
        this.checkCapture(currentPocket)

        // Check for end of game
        this.checkEndOfGame()

        // Check for bonus move
        if(!this.checkBonusTurn(currentPocket)){
          this.p1turn = !this.p1turn
        } else {
          console.log("BONUS TURN")
        }

        // End of move
        this.moveInProgress = false
      }, TIME_INTERVAL*(gemCount+1));// +1 Add an extra tick for a nicer game feel
    },

    // Gets next legal pocket
    getNextPocket(currentPocket){
      currentPocket++
      if(this.p1turn){
          if(currentPocket == 13){
            currentPocket = 0
          }
        } else {
          if(currentPocket == 7){
            currentPocket = 8
          }
        }
        currentPocket = currentPocket%14
      return currentPocket
    },

    // Checks for a capture and if found, executes it
    checkCapture(currentPocket){
      var capturedPocket = 12-currentPocket
      if(this.currentGameState[currentPocket] == 1 && this.currentGameState[capturedPocket] != 0){
        if(this.p1turn){
          if(currentPocket < 6){
            this.performCapture(currentPocket)
          }
        } else {
          if(currentPocket > 6 && currentPocket < 13){
            this.performCapture(currentPocket)
          }
        }
      }
    },

    // Executes a capture
    performCapture(currentPocket){
      console.log("CAPTURE")
        var capturedPocket = 12-currentPocket
        var amount = this.currentGameState[capturedPocket] + 1
        console.log(amount)
        if(this.p1turn){
          this.currentGameState[6]+=amount
        } else {
          this.currentGameState[13]+=amount
        }
        this.currentGameState[currentPocket] = 0
        this.currentGameState[capturedPocket] = 0
    },

    // Check for bonus move
    checkBonusTurn(currentPocket){
      if ((this.p1turn && currentPocket == 6) || (!this.p1turn && currentPocket == 13)){
        return true
      }
      return false
    },
    
    // Checks if game has ended
    checkEndOfGame(){
      var i = 0
      var count = 0
      for (i = 0; i < 6; i++){
        count += this.currentGameState[i]
      }
      if(count == 0) {
        this.endGame()
      } else {
        count = 0
        for (i = 7; i < 13; i++){
        count += this.currentGameState[i]
        }
        if(count == 0) {
          this.endGame()
        }
      }
    },

    // Ends game
    endGame(){
      var i = 0
      var count = 0
      for (i = 0; i < 6; i++){
        count += this.currentGameState[i]
        this.currentGameState[i] = 0
      }
      this.currentGameState[6] += count
      count = 0
      for (i = 7; i < 13; i++){
        count += this.currentGameState[i]
        this.currentGameState[i] = 0
      }
      this.currentGameState[13] += count
      this.gameEnded = true

    },

    // Returns to menu
    backToMenu(){
      this.close = true
      setTimeout(() => {
        this.$emit("back")
      }, 400);
    },

    updateTime(){
      var date = new Date()
      this.timePassed = Math.round((date.getTime() - this.timeCreated)/1000)
    },
  },

  watch:{
    p1turn(newVal, oldVal){
      if (newVal == true && oldVal == false){
        this.round++
      }
    }
  },


  computed: {
    player1Name(){
      if(this.gameVar == "singleplayer"){
        return "Player"
      } else {
        return "Player 1"
      }
    },

    player2Name(){
      if(this.gameVar == "singleplayer"){
        return "CPU"
      } else {
        return "Player 2"
      }
    },

    // Formats time for the display
    formatTime(){
      var text = ""
      if (this.timePassed >= 3600){
        text = text.concat(Math.floor(this.timePassed/3600).toString())
        text = text.concat(":")
        if((Math.floor(this.timePassed/60)%60) < 10){
          text = text.concat("0")
        }
      }
      if (this.timePassed >= 60){
        text = text.concat((Math.floor(this.timePassed/60)%60).toString())
        text = text.concat(":")
        if((this.timePassed%60) < 10){
          text = text.concat("0")
        }
      }
      text = text.concat((this.timePassed%60).toString())
      return text
    },
  }

}
</script>

<style>

</style>