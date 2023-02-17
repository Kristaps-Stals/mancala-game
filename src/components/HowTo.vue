<template>
  <div class="absolute w-full h-full fromup100" :class="{ todown100: downAnimation}">
    <div class="absolute w-full h-3/4 text-center" style="top:12.5%;">
        <h1 class="text-5xl text-center text-white select-none">How-to</h1>
        <p class="text-white text-3xl py-20" style="line-height: 1.8;">Objective:<br>
          Collect as many pieces as possible into your mancala (big pocket)<br>
          <br>
          Gameplay:<br>
          1) Each turn the player must pick up the pieces from 1 of their pocket and deposit them one by one into pockets moving clockwise<br>
          (If you run into the opponents mancala, instead of depositing a piece into it, skip it instead)<br>
          2) If the last piece you deposit is into your mancala, take another turn<br>
          3) If the last piece you deposit is into an empty pocket on your side, capture all the pieces in this and the opposing pocket<br>
          4) If there is no legal move, the game ends and the pieces left on ether side of the board are collected into that sides mancala<br>
        </p>
    </div>
    <div class="absolute flex" style="width:12.5%;height:25%;left:87.5%;animation-delay: 0s;">
      <button class="btn-red m-auto w-1/2 h-1/4 text-4xl" @click="backToMenu">EXIT</button>
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

  methods: {
    backToMenu() {
      this.disappearAnimation()
      this.$emit('back')
    },

    disappearAnimation(){
      this.downAnimation = true
    },
  }

}
</script>

<style>

</style>