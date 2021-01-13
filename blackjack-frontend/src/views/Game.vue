<template>
  <div id="app" class="wrapper">
    <div class="playing-table">
      <section class="dealer">
        <div class="col"></div>
        <div id="hand-dealer" class="col hand-dealer">
          <ul class="cards">
            <li class="placeholder" v-if="dealerCards.length === 0">
              <img class="playing-card" src="/images/cards/5D.png" alt="Card">
            </li>
            <li v-for="(card, index) in dealerCards" :key="'dealer-' + card.cardKey + '-' + index">
              <CardComponent :cardKey="card.cardKey" :isHidden="card.hidden"></CardComponent>
            </li>
          </ul>
          <div class="info-stats">
            <span id="dealerCardValue">Card Value: {{ dealerCardsValue }}</span>
          </div>
        </div>
        <div class="col stack">
          <CardComponent :cardKey="'5H'" :isHidden="true"></CardComponent>
        </div>
      </section>

      <section class="players">
        <div v-for="(name, index) in playerNames" :key="'player-' + name + '-' + index">
          <PlayerComponent :name="name" :number="index" :cards="playerCardStacks[index]"
                           :cardsValue="playerCardStackValues[index]"></PlayerComponent>
        </div>
      </section>
    </div>
    <div class="container-fluid control-bar">
      <div class="row">
        <div class="col-md-3 menu control-child">
          <div class="row h-100 m-auto">
            <v-btn :disabled="gameInProgress" to="/">Back</v-btn>
            <v-dialog
              v-model="dialog"
              max-width="290"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  class="ml-1"
                  :disabled="gameInProgress"
                >
                  NEW GAME
                </v-btn>
              </template>
              <v-card>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-card-title class="headline">Start Game</v-card-title>
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col>
                        Let's kick off your game!
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="Bet amount($)" value="100"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn type="button" text @click="dialog = false">Close</v-btn>
                  <v-btn @click="dialog = false; newGame()" id="start-game" type="button">PLAY!</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <div class="col-md-6 actions control-child">
          <div class="row h-100">
            <div class="m-auto">
              <v-btn @click="hitGame()" type="button" id="hitGame" :disabled="!actionsEnabled">HIT</v-btn>
              <v-btn @click="gameStand()" type="button" id="standGame" :disabled="!actionsEnabled">STAND</v-btn>
            </div>
          </div>
        </div>
        <div class="col-md-3 stats control-child">
          <span>Balance: 1000$</span>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="endDialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Game ended
        </v-card-title>
        <v-card-text>{{ endText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="endDialog = false; dialog = true"
          >
            New game
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="endDialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlayerComponent from '@/components/Player.vue'
import CardComponent from '@/components/Card.vue'
import Component from 'vue-class-component'

class Card {
  public cardKey = ''
  public hidden = false

  constructor(cardKey: string, hidden = false) {
    this.cardKey = cardKey
    this.hidden = hidden
  }
}

class Player {
  playerId = ''
  name = ''

  constructor(playerId: string, name: string) {
    this.playerId = playerId
    this.name = name
  }
}

function getLoggedInPlayer(): Player {
  if (localStorage.getItem('player') != null) {
    return JSON.parse(localStorage.getItem('player') ?? '')
  }
  return new Player('5fa3ba4f800df34886c43d15', 'Benni')
  // return new Player('', '')
}

@Component({
  components: {
    PlayerComponent,
    CardComponent
  },
  name: 'Game'
})
export default class Game extends Vue {
  public playerNumber = 1
  public dialog = false
  public gameInProgress = false
  public actionsEnabled = false
  public playerCardStacks = [[], [], []] as Card[][]
  public playerCardStackValues = [0, 0, 0] as number[]
  public playerNames = ['', '', ''] as string[]
  public dealerCards: Card[] = []
  public dealerCardsValue = 0 as number
  public endDialog = false
  public endText = ''

  socket: WebSocket

  constructor() {
    super()

    this.socket = this.initializeSocket()
  }

  private initializeSocket(): WebSocket {
    const socket = new WebSocket('ws://localhost:9000/websocket')

    // Connection opened
    socket.addEventListener('open', (event) => {
      console.log(event)
    })

    socket.addEventListener('close', (event) => {
      this.socket = this.initializeSocket()
      console.log(event)
    })

    // Listen for messages
    socket.addEventListener('message', this.responseAction)

    return socket
  }

  private responseAction(event: any) {
    console.log('Message from server ', event.data)
    const response = JSON.parse(event.data)
    switch (response.action) {
      case 'NEWGAME':
        this.dealerCards = []
        this.playerCardStacks.forEach((stack: Card[], index: number) => {
          Vue.set(this.playerCardStacks, index, [])
        })

        this.gameInProgress = true

        this.actionsEnabled = true

        if ('success' in response.game && response.game.success === false) {
          this.error(response.game.msg)
          return
        }

        this.dealerCards.push(new Card('5H', true))

        response.game.playerCards.forEach((card: any) => {
          this.playerCardStacks[this.playerNumber].push(new Card(card.card))
          Vue.set(this.playerCardStacks, this.playerNumber, this.playerCardStacks[this.playerNumber])
        })

        this.dealerCards.push(new Card('5H', true))

        Vue.set(this.playerCardStackValues, this.playerNumber, response.game.playerCardsValue)
        Vue.set(this.playerNames, this.playerNumber, getLoggedInPlayer().name)

        break
      case 'GAMEHIT':
        if ('success' in response.game && response.game.success === false) {
          this.error(response.game.msg)
          return
        }

        this.playerCardStacks[this.playerNumber].push(new Card(response.game.hitCard))
        console.log(response.game)
        this.playerCardStackValues[this.playerNumber] = response.game.playerCardsValue

        if (response.game.gameStates[response.game.gameStates.length - 1].gameState === 'WAITING_FOR_INPUT') {
          // TODO: Allow hit stand

          return
        }

        this.actionsEnabled = false
        this.revealDealerCards(response.game.dealerCards)
        this.gameInProgress = false
        this.dealerCardsValue = response.game.dealerCardsValue

        this.finishGame(response.game.gameStates)

        break
      case 'GAMESTAND':
        if ('success' in response.game && response.game.success === false) {
          this.error(response.game.msg)
          return
        }

        this.actionsEnabled = false
        this.revealDealerCards(response.game.dealerCards)
        this.gameInProgress = false
        Vue.set(this.playerCardStackValues, this.playerNumber, response.game.playerCardsValue)

        this.dealerCardsValue = response.game.dealerCardsValue
        this.finishGame(response.game.gameStates)

        break
    }
  }

  private finishGame(gamestates: any[]) {
    const playerName = this.playerNames[this.playerNumber]
    gamestates.forEach(gamestate => {
      console.log(gamestate)
      switch (gamestate.gameState) {
        case 'PLAYER_BUST':
          this.endText = `${playerName} busted and lost the game.`
          break
        case 'DEALER_BUST':
          this.endText = `${playerName} the dealer busted.`
          break
        case 'PLAYER_LOOSE':
          this.endText = `${playerName} loses this game.`
          break
        case 'PLAYER_WINS':
          this.endText = `${playerName} wins this game!`
          break
      }
    })
    this.endDialog = true
  }

  private revealDealerCards(dealerCards: any) {
    this.dealerCards = []
    dealerCards.forEach((element: any) => {
      this.dealerCards.push(new Card(element.card))
    })
  }

  public error(error: string) {
    alert(error)
  }

  public newGame() {
    this.endDialog = false
    this.dealerCardsValue = 0
    this.playerCardStackValues.forEach((value, index) => {
      Vue.set(this.playerCardStackValues, index, 0)
    })
    const request = {
      action: 'newGame',
      playerId: getLoggedInPlayer().playerId
    }

    this.socket.send(JSON.stringify(request))
  }

  public hitGame() {
    const request = {
      action: 'gameHit',
      playerId: getLoggedInPlayer().playerId
    }

    this.socket.send(JSON.stringify(request))
  }

  public gameStand() {
    const request = {
      action: 'gameStand',
      playerId: getLoggedInPlayer().playerId
    }

    this.socket.send(JSON.stringify(request))
  }
}

</script>
