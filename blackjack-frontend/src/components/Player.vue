<template>
  <div id="player-stack-player" class="player-stack">
    <ul class="cards">
      <li v-if="cards.length === 0" class="placeholder">
        <img class="playing-card" src="/images/cards/5D.png" alt="Card">
      </li>
      <li v-for="(card, index) in cards" :key="name + '-' + card.cardKey + '-' + index">
        <CardComponent :cardKey="card.cardKey" :isHidden="card.hidden"></CardComponent>
      </li>
    </ul>
    <div class="info-stats">
      <span>Cards Value: {{ cardsValue }}</span>
      <span v-if="name === ''">Player {{ number }}</span>
      <span v-if="name !== ''">{{ name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import CardComponent from '@/components/Card.vue'

class Card {
  public cardKey = ''
  public hidden = false

  constructor(cardKey: string, hidden = false) {
    this.cardKey = cardKey
    this.hidden = hidden
  }
}

@Component
export default class Player extends Vue.extend({
  name: 'Player',
  components: {
    CardComponent
  }
}) {
  @Prop({required: true, default: 0}) readonly number?: number
  @Prop({required: true, default: ''}) readonly name?: string
  @Prop({required: true, default: 0}) readonly cardsValue?: number
  @Prop({required: true, default: []}) readonly cards?: Card[]
}
</script>
