<template>
  <div id="app" class="wrapper">
    <div class="playing-table">
      <section class="dealer">
        <div class="col"></div>
        <div id="hand-dealer" class="col hand-dealer">
          <ul class="cards">
            <li class="placeholder">
              <img class="playing-card" src="/images/cards/5D.png" alt="Card">
            </li>
          </ul>
          <div class="info-stats">
            <span id="dealerCardValue">Card Value: {{ dealerCardsValue }}</span>
          </div>
        </div>
        <div class="col stack">
          <img class="playing-card" src="/images/cards/blue_back.png" alt="Card">
        </div>
      </section>

      <section class="players">
        <div id="player-stack-player-1" class="player-stack player-1">
          <ul class="cards">
            <li class="placeholder">
              <img class="playing-card" src="/images/cards/5D.png" alt="Card">
            </li>
          </ul>
          <div class="info-stats">
            <span>Cards Value: {{ p1cardsValue }}</span>
            <span>{{ p1Name }}</span>
          </div>
        </div>
        <div id="player-stack-player-2" class="player-stack player-2">
          <ul class="cards">
            <li class="placeholder">
              <img class="playing-card" style="visibility: hidden" src="/images/cards/5D.png" alt="Card">
            </li>
          </ul>
          <div class="info-stats">
            <span id="playerCardValue-2">Cards Value: {{ p2cardsValue }}</span>
            <span>{{ p2Name }}</span>
          </div>
        </div>
        <div id="player-stack-player-3" class="player-stack player-3">
          <ul class="cards">
            <li class="placeholder">
              <img class="playing-card" src="/images/cards/5D.png" alt="Card">
            </li>
          </ul>
          <div class="info-stats">
            <span id="playerCardValue-3">Cards Value: {{ p3cardsValue }}</span>
            <span>{{ p3Name }}</span>
          </div>
        </div>
      </section>
    </div>
    <div class="modal fade" id="setBetModalBox" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Set Your Bet!</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Set your bet for the next game:</p>
            <label>
              Bet value
              <input type="number" max="">
            </label>
          </div>
          <div class="modal-footer">
            <v-btn v-on:click="playAction" id="start-game" type="button">PLAY!</v-btn>
            <v-btn type="button" data-dismiss="modal">Close</v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid control-bar">
      <div class="row">
        <div class="col-md-3 menu control-child">
          <div class="row h-100 m-auto">
            <v-btn to="/">Back</v-btn>
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
                  <v-btn v-on:click="playAction" id="start-game" type="button" @click="dialog = false">PLAY!</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <div class="col-md-6 actions control-child">
          <div class="row h-100">
            <div class="m-auto">
              <v-btn v-on:click="hitAction" type="button" id="hitGame" disabled value="HIT"></v-btn>
              <v-btn v-on:click="standAction" type="button" id="standGame" disabled value="STAND"></v-btn>
            </div>
          </div>
        </div>
        <div class="col-md-3 stats control-child">
          <span>Balance: 1000$</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>
