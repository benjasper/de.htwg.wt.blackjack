<template>
  <div class="playing-table">
    <div id="heading">
      <h1 style="text-align: center">
        Game Menu
      </h1>
    </div>
    <div style="text-align: center">
      <h2>Hello Benni</h2>
      <v-btn to="/rules" role="button">Rules</v-btn>
      <br>
      <br>
      <v-btn to="/game" role="button">Start Game</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
})
export default class Home extends Vue {}
</script>
