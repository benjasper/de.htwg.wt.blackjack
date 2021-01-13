<template>
  <div class="playing-table">
    <div id="heading">
      <h1 style="text-align: center">
        Game Menu
      </h1>
    </div>
    <div style="text-align: center">
      <h2>Name</h2>
      <a class="btn btn-dark btn-lg" role="button">Rules</a>
      <br>
      <br>
      <a class="btn btn-dark btn-lg" role="button">Start Game</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
})
export default class Home extends Vue {}
</script>
