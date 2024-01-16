<template>
  <div class="absolute text-white w-full h-full" :class="{ todown100: close }">
    <!-- Main game board -->
    <div class="absolute w-3/4 h-1/2" style="top:25%;left:12.5%">
      <!-- Player 1 clickable pockets -->
      <div class="absolute w-4/6 h-1/2 bg-blue-500 border-2 gameAnimDown grid grid-cols-6 p-5 gap-5 pocket-holder" style="left:16.66666%;top:50%">
        <!-- Pockets from 1 to 6 (1, 2, 3, 4, 5, 6) -->
        <Pocket v-for="index1 in 6" :key="index1" :Value="currentGameState[index1-1]" :id="index1-1" :isSelected="pocketSelected" @buttonPressed="handlePress"/>
      </div>
      <!-- Player 1 base pocket -->
      <div class="absolute w-1/6 h-full bg-blue-500 border-2 gameAnimRight p-5 pocket-holder" style="left:83.33333%">
        <Pocket :Value="currentGameState[6]" :id="6" :isSelected="pocketSelected" @buttonPressed="handlePress"/>
      </div>
      <!-- Player 2 clickable pockets -->
      <div class="absolute w-4/6 h-1/2 bg-red-500 border-2 gameAnimUp grid grid-cols-6 p-5 gap-5 pocket-holder" style="left:16.66666%"> 
        <!-- Pockets from 12 to 7 (12, 11, 10, 9, 8, 7) -->
        <Pocket v-for="index2 in 6" :key="index2" :Value="currentGameState[13-index2]" :id="13-index2" :isSelected="pocketSelected" @buttonPressed="handlePress"/>
      </div>
      <!-- Player 2 base pocket -->
      <div class="absolute w-1/6 h-full bg-red-500 border-2 gameAnimLeft p-5 pocket-holder">
        <Pocket :Value="currentGameState[13]" :id="13" :isSelected="pocketSelected" @buttonPressed="handlePress"/>
      </div>
    </div>
    <!-- Player 2 name tag -->
    <div class="absolute flex gameAnimNameUp select-none" style="width:12.5%;height:25%">
      <p class="m-auto text-4xl text-red-500 mobile-text-lg">{{ p2Name }}</p>
    </div>
    <div class="absolute flex gameAnimNameUp select-none" style="width:12.5%;height:25%;left:12.5%">
      <p v-if="aiThinking" class="m-auto text-xl mobile-text-lg">Thinking...</p>
    </div>
    <!-- Player 1 name tag -->
    <div class="absolute flex gameAnimNameDown select-none" style="width:12.5%;height:25%;top:75%;left:87.5%">
      <p class="m-auto text-4xl text-blue-500 mobile-text-lg">{{ p1Name }}</p>
    </div>
    <!-- Exit button -->
    <div class="absolute flex gameAnimCloseButton" style="width:12.5%;height:25%;left:87.5%">
      <button class="btn-red m-auto w-1/2 h-1/4 text-4xl exit-button" @click="backToMenu">EXIT</button>
    </div>
    <!-- Current turn display -->
    <div v-if="!gameEnded" class="absolute flex gameAnimNameDown select-none" style="width:25%;height:25%;top:75%;left:37.5%;animation-delay: 1.33s;">
      <p v-if="p1turn" class="m-auto text-6xl mobile-text-lg">{{ p1Name }}'s turn</p>
      <p v-else class="m-auto text-6xl mobile-text-lg">{{ p2Name }}'s turn</p>
    </div>
    <div v-if="gameEnded" class="absolute flex select-none" style="width:25%;height:25%;top:75%;left:37.5%;">
      <p class="m-auto text-6xl mobile-text-lg"> Winner: {{ winner }}</p>
    </div>
    <!-- Turn/round counter -->
    <div v-if="round>=2" class="absolute flex gameAnimNameUp select-none" style="width:25%;height:25%;left:37.5%;animation-delay: 0s;">
      <p class="m-auto text-4xl mobile-text-lg">Turn {{ Math.floor(round) }}</p>
    </div>
    <!-- Timer -->
    <div v-if="timePassed>60" class="absolute flex gameAnimNameDown select-none" style="width:12.5%;height:25%;top:75%;animation-delay: 0s;">
      <p class="m-auto text-4xl mobile-text-lg">{{ formatTime }}</p>
    </div>
    <!-- Eval bar -->
    <div v-if="settingsData.evalBar" class="absolute flex gameAnimLeft select-none" style="width:12.5%;height:50%;top:25%;animation-delay:1.5s;animation-fill-mode: both;">
      <div class="m-auto relative h-full w-1/4 bg-blue-500 rounded-xl overflow-hidden border-2">
        <div class=" bg-red-500 border-b-2 transition-all duration-1000 flex" :style="{ 'height': evalHeight + '%'}" style="transition-timing-function: cubic-bezier(.23,.46,.2,1);">
          <p v-if="latestEval<0" class="text-xl mt-auto mx-auto mobile-text-xs">{{ evalMessage }}</p>
        </div>
        <p v-if="latestEval>=0" class="text-xl text-center mobile-text-xs">{{ evalMessage }}</p>
      </div>
    </div>
    <!-- Game end popup -->
    <div v-if="gameEnded" class="absolute w-1/2 h-1/2 fromup500 border-2" style="top:25%; left:25%; background-image: linear-gradient(to right, #ef4444 , #3b82f6);">
      <h1 id="game-finished-title" class=" text-6xl text-center absolute anchor-center left-1/2 mobile-text-lg top-1/3">Game finished!</h1>
      <button class="btn-red absolute text-2xl border-2 mobile-text-xs" style="width:20%;height:20%;left:60%; top:60%" @click="backToMenu">EXIT</button>
      <button class="btn-green absolute text-2xl border-2 mobile-text-xs" style="width:20%;height:20%;left:20%; top:60%" @click="playAgain">PLAY AGAIN</button>
    </div>
    <popup v-if="popup" :message="popupMessage" :player1="popupTurnP1"/>
  </div>
</template>

<script>
import AI from '../AI'
import Pocket from './Pocket.vue'
import Popup from './Popup.vue'


export default {

  components: {
    Pocket,
    Popup,
  },

  props: ['gameVars', 'settingsData'], // gameVar = singleplayer or multiplayer
  
  data(){
    return {
      close: false, // Play close animation
      currentGameState: [4,4,4,4,4,4,0,4,4,4,4,4,4,0], // Current game state; for game [4,4,4,4,4,4,0,4,4,4,4,4,4,0] for testing: [1,0,0,0,0,0,0,0,0,0,0,0,0,0]
      p1turn: true, // Whose turn it is - true means player or player1 and false means cpu or player2
      round: 1, // How many rounds has the game been ongoing for
      timeCreated: 0, // When the game was created in miliseconds (initialized in mounted)
      timePassed: 0, // How long the game has been ongoing
      timeInterval: null, // setInterval object. Defined so it can be stopped on unmount
      moveInProgress: false, // True if move in progress to prevent multi moves
      gameEnded: false, // True when game has ended
      p1Name: null, // Player 1 name
      p2Name: null, // Player 2 name
      aiThinking: false, // true - AI is thinking; false - AI is not thinking
      popup: false, // Play popup animation
      popupMessage: null, // Popup message
      popupTurnP1: true, // Popup blue or red
      pocketSelected: null, // This pocket will be highlighted (0-13)
      winner: null,
      latestEval: 10, // The higher, the better for player 1
    }
  },


  // When game starts
  mounted(){

    this.$emit('statInc', 'gamesStarted', 1)

    // Assign player names
    if(this.gameVars.CPU == 1){
      this.p1Name = "Player"
      this.p2Name = "CPU"
    } else {
      this.p1Name = "Player 1"
      this.p2Name = "Player 2"
    }
    // Assign turn start
    if(this.gameVars.P1Start == false){
      this.p1turn = false
      this.round = 0.5
      this.latestEval = -4
    }

    // Setup time
    var date = new Date()
    this.timeCreated = date.getTime()

    this.timeInterval = setInterval(() => {
      this.updateTime()
      if(this.p2Name == "CPU" && this.p1turn == false && !this.gameEnded && !this.moveInProgress && !this.aiThinking){
        this.makeAiMove()
      }
    }, 100)
  },

  // When game ends
  unmounted(){
    clearInterval(this.timeInterval)
  },

  methods: {
    // When one of the pockets are pressed
    handlePress(id){
      if(this.isMoveLegal(id, true)){
        this.makeMove(id)
      }
    },

    // Do a move on the board. id - the pocket; player1 - true means player1 is making the move, false means player2 is making the move.
    makeMove(id){

      this.$emit('statInc', 'movesMade', 1)

      // Variables
      var TIME_INTERVAL = this.settingsData.animationDelay// time between each tick in ms
      var gemCount = this.currentGameState[id] // gem count in clicked pocket
      var currentPocket = id
      var i = 0
      this.moveInProgress = true
      this.pocketSelected = id


      // Redistributes gems
      for(i = 0; i < gemCount; i++){
        setTimeout(() => {
          // Empties clicked pocket
          this.currentGameState[id] -= 1
          currentPocket = this.getNextPocket(currentPocket)
          this.currentGameState[currentPocket]++
        }, TIME_INTERVAL*(i+1));
      }

      // Waits for for loop to be done
      setTimeout(() => {

        // Check for capture
        this.checkCapture(currentPocket, this.p1turn)

        // Check for end of game
        this.checkEndOfGame()

        // Check for bonus move
        if(!this.checkBonusTurn(currentPocket)){
          this.p1turn = !this.p1turn
          setTimeout(() => {
            if (this.gameVars.CPU == 0 && this.settingsData.evalBar){
              var temp
              var tempEval
              if(this.p1turn == true) {
                [temp, tempEval] = AI.bestMove(this.flipBoard(this.currentGameState), Math.max(this.settingsData.baseDepth-1, 2))
                this.latestEval = -tempEval
              } else {
                [temp, this.latestEval] = AI.bestMove(this.currentGameState, Math.max(this.settingsData.baseDepth-1, 2))
              }
            }
          }, 20);
          
        } else {
          this.$emit('statInc', 'bonusMovesMade', 1)
          this.showPopup("BONUS TURN", this.p1turn)
        }

        // End of move
        this.moveInProgress = false
        this.pocketSelected = null
      }, TIME_INTERVAL*(gemCount+1));
    },

    // Gets next legal pocket
    getNextPocket(currentPocket){
      currentPocket++
      if(this.p1turn){
          if(currentPocket == 13){
            currentPocket = 0
          }
        } else {
          if(currentPocket == 6){
            currentPocket = 7
          }
        }
        currentPocket = currentPocket%14
      return currentPocket
    },

    // Checks for a capture and if found, executes it
    checkCapture(currentPocket, p1){
      var capturedPocket = 12-currentPocket
      if(this.currentGameState[currentPocket] == 1 && this.currentGameState[capturedPocket] != 0){
        if(p1){
          if(currentPocket < 6){
            this.performCapture(currentPocket)
            this.showPopup("CAPTURE", p1)
          }
        } else {
          if(currentPocket > 6 && currentPocket < 13){
            this.performCapture(currentPocket)
            this.showPopup("CAPTURE", p1)
          }
        }
      }
    },

    // Executes a capture
    performCapture(currentPocket){
        this.$emit('statInc', 'capturesMade', 1)
        var capturedPocket = 12-currentPocket
        var amount = this.currentGameState[capturedPocket] + 1
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
      if (this.currentGameState[6] > this.currentGameState[13]){
        this.winner = this.p1Name
        if(this.gameVars.CPU == 1 && this.gameVars.P1Start == true && this.settingsData.baseDepth >= 11){
          this.$emit('statInc', 'winsAgainstCPUp1', 1)
        } else if(this.gameVars.CPU == 1 && this.gameVars.P1Start == false && this.settingsData.baseDepth >= 11){
          this.$emit('statInc', 'winsAgainstCPUp2', 1)
        }
      } else if (this.currentGameState[6] < this.currentGameState[13]) {
        this.winner = this.p2Name
      } else {
        this.winner = "Draw"
      }

      this.gameEnded = true
      this.$emit('statInc', 'gamesFinished', 1)
    },

    makeAiMove(){
      if (!this.moveInProgress){
        this.aiThinking = true
        setTimeout(() => {
          var isLegalMove = false
        var move = 0
        while (!isLegalMove){
          [move, this.latestEval] = AI.bestMove(this.currentGameState, this.settingsData.baseDepth)
          move = move + 7
          if (this.isMoveLegal(move, false)){
            isLegalMove = true
          }
        }
        this.makeMove(move)
        this.aiThinking = false
        }, 20);
      }
    },

    flipBoard(currentGameState){
      var flippedGameState = []
      for (let i = 0; i < 14; i++){
        flippedGameState.push(currentGameState[(i+7)%14])
      }
      return flippedGameState
    },

    isMoveLegal(id, player){
      if(this.currentGameState[id] != 0 && !this.moveInProgress){ // If the pocket isn't empty and if there isn't already a move in progress
        if(this.p1turn){ // If it's player 1's turn
          if(id < 6){ // And if the clicked pocket falls into player 1's territory
            return true
          }
        } else { // If it's not player 1's turn (aka it is player 2's turn)
          if(id > 6 && id < 13 && (this.gameVars.CPU == false || !player)){ // And if the clicked pocket falls into player 2's territory AND it is a 2 player game
            return true
          }
        }
      }
      return false
    },

    // Shows a popup for 1 second
    showPopup(message, p1){
      this.popupMessage = message
      this.popupTurnP1 = p1
      this.popup = true
      setTimeout(() => {
        this.popup = false
      }, 800);
    },

    // Counts the total number of gems in a given position
    countTotal(currentGameState){
      var count = 0
      for(let i = 0; i < currentGameState.length; i++){
        count += currentGameState[i]
      }
      return count
    },

    copyToNewArray(array){
      var newArray = []
      for (let i = 0; i < array.length; i++){
        newArray.push(array[i])
      }
      return newArray
    },

    // Returns to menu
    backToMenu(){
      setTimeout(() => { // because otherwise it can break if the cpu is going first and the user clicks the exit button before it finishes making its very first move
        this.close = true
        this.$emit("back")
      }, 1);
    },

    playAgain(){
      this.close = true
      this.$emit("playAgain")
    },

    // Updates time passed
    updateTime(){
      var date = new Date()
      this.timePassed = Math.round((date.getTime() - this.timeCreated)/1000)
    },
  },

  watch:{
    // Watches for the change of turn
    p1turn(newVal, oldVal){
      // Incrementes round counter
      this.round += 0.5
    }
  },

  computed: {
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

    // in %
    evalHeight(){
      var totalGems = this.countTotal(this.currentGameState)
      var shiftedEval = this.latestEval + (totalGems/2)
      var unitSize = 1/totalGems
      return Math.max(Math.min(100 - (shiftedEval * unitSize * 100), 100), 0)
    },

    evalMessage(){
      var message = ''
      if (this.latestEval > 0) {
        message = '+' + this.latestEval
      } else if (this.latestEval < 0){
        message = this.latestEval
      } else {
        message = '0'
      }
      return message
    }
  }

}
</script>

<style>

</style>