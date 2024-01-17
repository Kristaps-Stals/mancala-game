<template>
  <div id="main-menu-main" class="fromup" :class="{ todown: downAnimation}">
    <h1 class="text-5xl text-center text-white select-none">Mancala</h1>
    <div id="main-menu-grid">
      <button class="btn-green main-menu-button" @click="buttonClicked('singleplayer')">1 player</button>
      <button class="btn-green mt-6 main-menu-button" @click="buttonClicked('singleplayerp2')">1 player (cpu starts)</button>
      <button class="btn-green mt-6 main-menu-button" @click="buttonClicked('multiplayer')">2 Players</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('howto')">How-to</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('statistics')">Statistics</button>
      <button class="btn-blue mt-6 main-menu-button" @click="buttonClicked('settings')">Settings</button>
    </div>
  </div>
  <div id="author-name" class="absolute flex" :class="{ todownfast: downAnimation}" >
    <p class="m-auto text-white gameAnimRight select-none" style="animation-delay: 1s; animation-fill-mode: backwards;">Kristaps Štāls ks23121, Latvijas Universitāte</p>
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
      this.disappearAnimation();
      this.$emit('buttonSelected', button)
    },

    disappearAnimation(){
      this.downAnimation = true;
      setTimeout(() => { // fail safe for going too fast
        this.downAnimation = false
      }, 600)
    },
  }

}
</script>

<style>

</style>