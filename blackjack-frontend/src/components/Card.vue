<template>
  <img class="playing-card" :src=src :alt="cardKey">
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class CardComponent extends Vue.extend({
  name: 'CardComponent'

}) {
  @Prop({required: true, default: '5H'}) readonly cardKey?: string
  @Prop({required: true, default: false}) readonly isHidden?: boolean

  src = `/images/cards/${this.cardKey}.png`
}
</script>
