<template>
  <div id="pocket-container" class="h-full rounded-3xl" :class="{ player1pocketbg: p1, player2pocketbg: !p1, highlightPocket: highlight, bumpAnim: bumpAnim}">
    <button class="w-full h-full enlarge" @click="buttonClick">
      <span class="text-4xl mobile-text-lg">{{ Value }}</span>
    </button>
  </div>
</template>

<script>

export default {

  data (){
    return{
      bumpAnim: false,
    }
  },

  props:["Value", "id", "isSelected"],

  methods: {
    buttonClick(){
      this.$emit("buttonPressed", this.id)
    }
  },

  watch: {
    Value(newVal, oldVal){
      if(this.bumpAnim == false){
        this.bumpAnim = true
        setTimeout(() => {
          this.bumpAnim = false
        }, 100);
      }
    }
  },

  computed: {
    // Checks if the tile belongs to player 1 - true if it does, false if it doesn't
    p1(){
      if (this.id >= 7){
        return false
      }
      return true
    },

    highlight(){
      if(this.id == this.isSelected){
        return true
      }
      return false
    }
  }

}
</script>

<style>

</style>