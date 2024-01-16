<template>
  <div class="absolute w-full h-full fromup100" :class="{ todown100: downAnimation}">
    <div class="absolute w-full h-3/4 text-center" style="top:12.5%;">
      <h1 id="settings-title" class="text-5xl text-center text-white select-none">Settings</h1>
      <form id="settings-form" class="text-white text-3xl py-20" onsubmit="return false">
        <div>
          <label class="select-none">Base CPU depth (1-12): </label>
          <input class="text-black rounded-xl text-center" min="1" max="12" style="width:75px" type="number" required v-model="settingsData.baseDepth">
        </div>
        <br>
        <div>
          <label class="select-none">Time between animations: </label>
          <input class="text-black rounded-xl text-center" min="0" style="width:90px" type="number" required v-model="settingsData.animationDelay">
          <label class="select-none"> ms</label>
        </div>
        <br>
        <div>
          <label class="select-none">Evaluation bar: </label>
          <input type="checkbox" style="width:27px;height:27px;transform: translate(2px, 3px);" required v-model="settingsData.evalBar">
        </div>
      </form>
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

  props: ['settingsData'],

  methods: {
    backToMenu() {
      this.disappearAnimation()
      this.$emit('back')
    },

    disappearAnimation(){
      this.downAnimation = true
      setTimeout(() => { // fail safe for going too fast
        this.downAnimation = false
      }, 500)
    },
  },

  

}
</script>

<style>

</style>