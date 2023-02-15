<template>
  <div class="absolute flex h-full w-full popupAnim select-none">
    <p class="m-auto text-9xl" :class="{ player1popup: player1, player2popup: !player1 }"> {{ message }} </p>
  </div>
</template>

<script>
export default {

  props: ['message', 'player1'],

}
</script>

<style>

</style>