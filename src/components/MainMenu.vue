<template>
  <div class="absolute w-1/2 h-3/4 fromup" :class="{ todown: downAnimation}" style="top:12.5%;left:25%">
    <h1 class="text-5xl text-center text-white select-none">Mancala</h1>
    <div class="absolute w-1/2 left-1/4 grid" style="height:60%;top:20%">
      <button class="btn-green main-menu-button" @click="buttonClicked('singleplayer')">1 player</button>
      <button class="btn-green mt-6 main-menu-button" @click="buttonClicked('singleplayerp2')">1 player (cpu starts)</button>
      <button class="btn-green mt-6 main-menu-button" @click="buttonClicked('multiplayer')">2 Players</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('howto')">How-to</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('statistics')">Statistics</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('settings')">Settings</button>
    </div>
  </div>
  <div class="absolute flex" :class="{ todownfast: downAnimation}" style="height:10%;width:20%;top:90%;left:80%">
    <p class="m-auto text-white gameAnimRight select-none" style="animation-delay: 1s; animation-fill-mode: backwards;">Kristaps Štāls, Rīgas Valsts 1. ģimnāzija</p>
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
      this.$emit('buttonSelected', button)
    },

    disappearAnimation(){
      this.downAnimation = true
    },
  }

}
</script>

<style>

</style>