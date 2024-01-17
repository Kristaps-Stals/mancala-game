<template>
  <div class="absolute w-full h-full fromup100" :class="{ todown100: downAnimation}">
    <div class="absolute w-full h-3/4 text-center" style="top:12.5%;">
        <h1 id="statistics-title" class="text-5xl text-center text-white select-none">Statistics</h1>
        <p id="statistics-main" class="text-white text-3xl py-20" style="line-height: 1.8;">Total time played: {{ formatTime }}<br>
          Wins against CPU when going first (11+ depth): {{ statisticsData.winsAgainstCPUp1 }}<br>
          Wins against CPU when going second (11+ depth): {{ statisticsData.winsAgainstCPUp2 }}<br>
          Games started: {{ statisticsData.gamesStarted }}<br>
          Games finished: {{ statisticsData.gamesFinished }}<br>
          Moves played: {{ statisticsData.movesMade }}<br>
          Bonus moves played: {{ statisticsData.bonusMovesMade }}<br>
          Captures played: {{ statisticsData.capturesMade }}<br>
        </p>
    </div>
    <div class="absolute flex" style="width:12.5%;height:25%;left:87.5%;animation-delay: 0s;">
      <button class="btn-red m-auto w-1/2 h-1/4 text-4xl exit-button" @click="backToMenu">EXIT</button>
    </div>
  </div>
</template>

<script>

export default {

  data (){
    return {
      downAnimation: false,
    }
  },

  props:['statisticsData'],

  methods: {
    backToMenu() {
      this.disappearAnimation()
      this.$emit('back')
    },

    disappearAnimation(){
      this.downAnimation = true
      setTimeout(() => { // fail safe for going too fast
        this.downAnimation = false
      }, 600)
    },
  },

  computed: {
    formatTime(){
      var text = ""
      if (this.statisticsData.timePlayed >= 3600){
        text = text.concat(Math.floor(this.statisticsData.timePlayed/3600).toString())
        text = text.concat(":")
        if((Math.floor(this.statisticsData.timePlayed/60)%60) < 10){
          text = text.concat("0")
        }
      }
      if (this.statisticsData.timePlayed >= 60){
        text = text.concat((Math.floor(this.statisticsData.timePlayed/60)%60).toString())
        text = text.concat(":")
        if((this.statisticsData.timePlayed%60) < 10){
          text = text.concat("0")
        }
      }
      text = text.concat((this.statisticsData.timePlayed%60).toString())
      return text
    },
  },

}
</script>

<style>

</style>