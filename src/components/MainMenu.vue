<template>
  <div class="absolute w-1/2 h-3/4 fromup" :class="{ todown: downAnimation}" style="top:12.5%;left:25%">
    <h1 class="text-5xl text-center text-white">Mancala game</h1>
    <div class="absolute w-1/2 h-1/2 top-1/4 left-1/4 grid">
      <button class="btn-green main-menu-button" @click="buttonClicked('singleplayer')">1 Player</button>
      <button class="btn-green mt-6 main-menu-button" @click="buttonClicked('multiplayer')">2 Players</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('howto')">How-to</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('statistics')">Statistics</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('settings')">Settings</button>
    </div>
  </div>
  <div class="absolute flex" :class="{ todownfast: downAnimation}" style="height:10%;width:20%;top:90%;left:80%">
    <p class="m-auto text-white gameAnimRight" style="animation-delay: 1s; animation-fill-mode: backwards;">Kristaps Štāls, Rīgas Valsts 1. ģimnāzija</p>
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
    buttonClicked(button) {
      this.disappearAnimation()
      setTimeout(() => {
        this.$emit('buttonSelected', button)
      }, 400);
    },

    disappearAnimation(){
      this.downAnimation = true
    },


  }

}
</script>

<style>

</style>