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
				<v-col class="menu control-child">
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
	public players: Player[] = []
	public dealerCards: Card[] = []
	public dealerCardsValue = 0 as number
	public endDialog = false
	public endText = ''
	public playerBalance = 0
	public matchmakingDialog = false
	public connected = false

	socket: WebSocket

	constructor() {
		super()

		this.socket = this.initializeSocket()
		this.updateUser()
	}

	private initializeSocket(): WebSocket {
		const socket = new WebSocket('ws://localhost:9000/websocket')

		// Connection opened
		socket.addEventListener('open', (event) => {
			window.setInterval(() => {
				socket.send(JSON.stringify(
					{
						action: 'ping', playerId: getLoggedInPlayer().id
					}))
			}, 5000)
			this.connected = true
			console.log(event)
		})

		socket.addEventListener('close', () => {
			this.connected = false
			alert('Connection closed!')
		})

		// Listen for messages
		socket.addEventListener('message', this.responseAction)

		return socket
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

		if (response.player !== getLoggedInPlayer().id) {
			playerIndex = this.players.findIndex(player => player.id === response.player)
			console.log(playerIndex)
			isWatching = true
		}

		this.matchmakingDialog = false
		if (response.nextTurn === getLoggedInPlayer().id) {
			this.actionsEnabled = true
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

		if (response.player !== getLoggedInPlayer().id) {
			playerIndex = this.players.findIndex(player => player.id === response.player)
		}

		this.players[playerIndex].hand.push(new Card(response.game.hitCard))
		console.log(response.game)
		this.players[playerIndex].handValue = response.game.playerCardsValue
		Vue.set(this.players, playerIndex, this.players[playerIndex])

		if (response.nextTurn === getLoggedInPlayer().id) {
			this.actionsEnabled = true
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

			this.finishGame(response.game.gameStates[playerIndex])
		}
	}

	private standAction(response: any) {
		if ('success' in response.game && response.game.success === false) {
			this.error(response.game.msg)
			return
		}

		let playerIndex = this.playerNumber

		if (response.player !== getLoggedInPlayer().id) {
			playerIndex = this.players.findIndex(player => player.id === response.player)
			this.actionsEnabled = false
		}

		if (response.nextTurn === getLoggedInPlayer().id) {
			this.actionsEnabled = true
			return
		}

		if (response.nextTurn === '') {
			this.revealDealerCards(response.game.dealerCards)
			this.gameInProgress = false
			this.players[playerIndex].handValue = response.game.playerCardsValue
			Vue.set(this.players, playerIndex, this.players[playerIndex])

			this.dealerCardsValue = response.game.dealerCardsValue
			this.finishGame(response.game.gameStates[playerIndex])
		}
	}

	private updateUser() {
		axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*'
		axios.get('http://localhost:9000/user?player=' + getLoggedInPlayer().id).then(response => {
			const data = response.data
			if ('success' in data && data.success === false) {
				this.error(data.msg)
				return
			}

			this.playerBalance = data.balance
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
			playerId: getLoggedInPlayer().id
		}

		this.socket.send(JSON.stringify(request))
	}

	public forceStart() {
		const request = {
			action: 'forcestart',
			playerId: getLoggedInPlayer().id
		}

		this.socket.send(JSON.stringify(request))
	}

	public hitGame() {
		const request = {
			action: 'gameHit',
			playerId: getLoggedInPlayer().id
		}

		this.actionsEnabled = false
		this.socket.send(JSON.stringify(request))
	}

	public gameStand() {
		const request = {
			action: 'gameStand',
			playerId: getLoggedInPlayer().id
		}

		this.actionsEnabled = false
		this.socket.send(JSON.stringify(request))
	}
}

</script>
