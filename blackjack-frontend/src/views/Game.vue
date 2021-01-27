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
					<div v-if="false" class="info-stats">
						<span id="dealerCardValue">Card Value: {{ dealerCardsValue }}</span>
					</div>
				</div>
				<div class="col stack">
					<CardComponent :cardKey="'5H'" :isHidden="true"></CardComponent>
				</div>
			</section>

			<section class="players">
				<div v-for="(player, index) in players" :key="'player-' + player.name + '-' + index">
					<PlayerComponent :name="player.name" :number="index" :cards="player.hand"
									 :cardsValue="player.handValue"></PlayerComponent>
				</div>
			</section>
		</div>
		<div class="container-fluid control-bar">
			<v-row>
				<v-col class="menu control-child m-auto">
					<v-row class="m-auto">
						<v-btn class="ml-auto" :disabled="gameInProgress" to="/">Back</v-btn>
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
									class="m-auto ml-1"
									:disabled="gameInProgress || !connected"
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
									<v-btn @click="dialog = false; newGame()" id="start-game" type="button">PLAY!
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</v-col>
				<v-col class="actions control-child">
					<v-row class="m-auto">
						<div class="m-auto">
							<v-btn @click="hitGame()" type="button" id="hitGame" :disabled="!actionsEnabled">HIT</v-btn>
							<v-btn class="ml-1" @click="gameStand()" type="button" id="standGame"
								   :disabled="!actionsEnabled">STAND
							</v-btn>
						</div>
					</v-row>
					<v-row class="m-auto text-center d-block mt-2">
						<span v-if="actionsEnabled">Your turn</span>
						<span v-if="!actionsEnabled && playerTurn">{{ playerTurn }}s turn</span>
						<span v-if="!actionsEnabled && playerTurn === ''">-</span>
					</v-row>
				</v-col>
				<v-col class="stats control-child">
					<span>Balance: {{ playerBalance }}$</span>
				</v-col>
			</v-row>
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
		<v-dialog
			v-model="matchmakingDialog"
			persistent
			max-width="290"
		>
			<v-card>
				<v-card-title class="headline">
					Matchmaking
				</v-card-title>
				<v-card-text>Waiting for other players</v-card-text>
				<div class="text-center">
					<v-progress-circular
						:size="70"
						:width="7"
						color="purple"
						indeterminate
					></v-progress-circular>
				</div>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="green darken-1"
						text
						@click="forceStart()"
					>
						Start now
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
import axios from 'axios'
import store from '@/store'

class Card {
	public cardKey = ''
	public hidden = false

	constructor(cardKey: string, hidden = false) {
		this.cardKey = cardKey
		this.hidden = hidden
	}
}

class Player {
	public id = ''
	public name = ''
	public hand = [] as Card[]
	public handValue = 0 as number

	constructor(playerId: string, name: string) {
		this.id = playerId
		this.name = name
	}
}

function getLoggedInPlayer(): Player {
	if (localStorage.getItem('player') != null) {
		return JSON.parse(localStorage.getItem('player') ?? '')
	}
	return new Player(store.getters.getPlayerId, 'Player')
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
	public players: Player[] = []
	public dealerCards: Card[] = []
	public dealerCardsValue = 0 as number
	public endDialog = false
	public endText = ''
	public playerBalance = 0
	public matchmakingDialog = false
	public connected = false

	public playerTurn = ''

	disableProd = false

	isProd = false

	socket: WebSocket

	constructor() {
		super()
		if (process.env.NODE_ENV === 'production' && !this.disableProd) {
			this.isProd = true
		}

		let socket: WebSocket
		console.log(this.isProd)

		if (!this.isProd) {
			socket = new WebSocket('ws://localhost:9000/websocket')
		} else {
			socket = new WebSocket('wss://htwg-blackjack.herokuapp.com/websocket')
		}

		// Connection opened
		socket.addEventListener('open', this.socketOpen)

		socket.addEventListener('close', this.socketClose)

		// Listen for messages
		socket.addEventListener('message', this.responseAction)

		this.socket = socket

		this.updateUser()
	}

	private socketClose() {
		this.connected = false
		alert('Connection closed!')
	}

	private socketOpen(event: any) {
		window.setInterval(() => {
			this.socket.send(JSON.stringify(
				{
					action: 'ping', playerId: store.getters.getPlayerId
				}))
		}, 5000)
		this.connected = true
		console.log(event)
	}

	private responseAction(event: any) {
		console.log('Message from server ', event.data)
		const response = JSON.parse(event.data)
		switch (response.action) {
			case 'MATCHMAKING':
				this.matchmakingAction(response)
				break
			case 'NEWGAME':
				this.newGameAction(response)
				break
			case 'GAMEHIT':
				this.hitAction(response)
				break
			case 'GAMESTAND':
				this.standAction(response)
				break
			case 'JOIN':
				this.players.push(new Player(response.player, response.game.name))
				break
			case 'PONG':
				break
			default:
				console.error(response)
		}
	}

	private matchmakingAction(response: any) {
		this.matchmakingDialog = true
		this.playerNumber = response.game.playerIndex
		this.playerTurn = ''
		if (response.game.playerIndex !== 0) {
			response.game.players.forEach((id: string, index: number) => {
				if (index === response.game.players.length - 1) {
					return
				}

				this.players.push(new Player(id, ''))
			})
		}
	}

	private newGameAction(response: any) {
		console.log(response)
		if ('success' in response.game && response.game.success === false) {
			this.error(response.game.msg)
			return
		}

		let playerIndex = this.playerNumber
		let isWatching = false

		if (response.player !== store.getters.getPlayerId) {
			playerIndex = this.players.findIndex(player => player.id === response.player)
			console.log(playerIndex)
			isWatching = true
		}

		this.matchmakingDialog = false
		if (response.nextTurn === store.getters.getPlayerId) {
			this.actionsEnabled = true
		}

		if (response.nextTurn) {
			const player = this.players.find(player => player.id === response.nextTurn)
			if (player) {
				this.playerTurn = player?.name
			}
		}

		if (!isWatching) {
			this.dealerCards.push(new Card('5H', true))
		}

		response.game.playerCards.forEach((card: any) => {
			this.players[playerIndex].hand.push(new Card(card.card))

			Vue.set(this.players, playerIndex, this.players[playerIndex])
		})

		if (!isWatching) {
			this.dealerCards.push(new Card('5H', true))
		}

		this.players[playerIndex].handValue = response.game.playerCardsValue
		this.players[playerIndex].name = getLoggedInPlayer().name
		Vue.set(this.players, playerIndex, this.players[playerIndex])

		if (response.nextTurn === '') {
			this.dealerCardsValue = response.game.dealerCardsValue
			this.finishGame(response.game.gameStates[playerIndex])
		}
	}

	private hitAction(response: any) {
		if ('success' in response.game && response.game.success === false) {
			this.error(response.game.msg)
			return
		}

		let playerIndex = this.playerNumber

		if (response.player !== store.getters.getPlayerId) {
			playerIndex = this.players.findIndex(player => player.id === response.player)
		}

		this.players[playerIndex].hand.push(new Card(response.game.hitCard))
		console.log(response.game)
		this.players[playerIndex].handValue = response.game.playerCardsValue
		Vue.set(this.players, playerIndex, this.players[playerIndex])

		if (response.nextTurn === store.getters.getPlayerId) {
			this.actionsEnabled = true
		}

		if (response.nextTurn) {
			const player = this.players.find(player => player.id === response.nextTurn)
			if (player) {
				this.playerTurn = player?.name
			}
		}

		if (response.game.gameStates[playerIndex][response.game.gameStates[playerIndex].length - 1].gameState === 'WAITING_FOR_INPUT') {
			// TODO: Allow hit stand

			return
		}

		if (response.nextTurn === '') {
			this.actionsEnabled = false
			this.revealDealerCards(response.game.dealerCards)
			this.gameInProgress = false
			this.dealerCardsValue = response.game.dealerCardsValue
			this.playerTurn = ''

			this.finishGame(response.game.gameStates[playerIndex])
		}
	}

	private standAction(response: any) {
		if ('success' in response.game && response.game.success === false) {
			this.error(response.game.msg)
			return
		}

		let playerIndex = this.playerNumber

		if (response.player !== store.getters.getPlayerId) {
			playerIndex = this.players.findIndex(player => player.id === response.player)
			this.actionsEnabled = false
		}

		if (response.nextTurn === store.getters.getPlayerId) {
			this.actionsEnabled = true
			return
		}

		if (response.nextTurn) {
			const player = this.players.find(player => player.id === response.nextTurn)
			if (player) {
				this.playerTurn = player?.name
			}
		}

		if (response.nextTurn === '') {
			this.revealDealerCards(response.game.dealerCards)
			this.gameInProgress = false
			this.players[playerIndex].handValue = response.game.playerCardsValue
			Vue.set(this.players, playerIndex, this.players[playerIndex])
			this.playerTurn = ''

			this.dealerCardsValue = response.game.dealerCardsValue
			this.finishGame(response.game.gameStates[playerIndex])
		}
	}

	private updateUser() {
		axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*'

		const playerId = store.getters.getPlayerId
		axios.get('/user?player=' + playerId).then(response => {
			const data = response.data
			if ('success' in data && data.success === false) {
				this.error(data.msg)
				return
			}
			const player = this.players.find(player => player.id === playerId)
			this.playerBalance = data.balance
			if (player === undefined) {
				return
			}
			player.name = data.name
		})
	}

	private finishGame(gamestates: any[]) {
		const playerName = this.players[this.playerNumber].name
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
		this.updateUser()
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
		this.players = []
		this.dealerCards = []

		this.gameInProgress = true

		this.actionsEnabled = false

		const request = {
			action: 'matchmaking',
			playerId: store.getters.getPlayerId
		}

		this.socket.send(JSON.stringify(request))
	}

	public forceStart() {
		const request = {
			action: 'forcestart',
			playerId: store.getters.getPlayerId
		}

		this.socket.send(JSON.stringify(request))
	}

	public hitGame() {
		const request = {
			action: 'gameHit',
			playerId: store.getters.getPlayerId
		}

		this.actionsEnabled = false
		this.socket.send(JSON.stringify(request))
	}

	public gameStand() {
		const request = {
			action: 'gameStand',
			playerId: store.getters.getPlayerId
		}

		this.actionsEnabled = false
		this.socket.send(JSON.stringify(request))
	}
}

</script>
