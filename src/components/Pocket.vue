<template>
  <div class="h-full" :class="{ player1pocketbg: p1, player2pocketbg: !p1 }">
    <button class="w-full h-full enlarge" @click="buttonClick">
      <span class="text-4xl">{{ Value }}</span>
    </button>
  </div>
</template>

<script>

export default {

  props:["Value", "id"],

  methods: {
    buttonClick(){
      this.$emit("buttonPressed", this.id)
    }
  },

  computed: {
    // Checks if the tile belongs to player 1 - true if it does, false if it doesn't
    p1(){
      if (this.id >= 7){
        return false
      }
      return true
    }
  }

}
</script>

<style>

</style>