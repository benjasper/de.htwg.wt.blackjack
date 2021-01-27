import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'

Vue.use(Vuex)

const server = ''
const axiosConfig = {
	withCredentials: true,
	headers: {
		'X-Requested-With': 'vue',
		'Content-Type': 'application/json',
		Accept: 'application/json'
	},
	crossdomain: true
}

class Player {
	public id = ''
	public name = ''

	constructor(playerId: string, name: string) {
		this.id = playerId
		this.name = name
	}
}

const store = new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('token') || '',
		user: {},
		signedIn: false,
		playerPromise: undefined as unknown as Promise<Player>
	},
	actions: {
		setLoggedIn({ commit }, userId) {
			localStorage.setItem('userId', userId)
			const promise = new Promise<Player>((resolve, reject) => {
				axios.get('/user?player=' + userId).then(response => {
					const data = response.data
					if ('success' in data && data.success === false) {
						console.error(response)
						reject(response)
						return
					}

					resolve(new Player(userId, data.name))
				})
			})
			promise.then(player => {
				localStorage.setItem('player', JSON.stringify(player))
			})

			localStorage.setItem('userId', userId)
			commit('SET_LOGIN', true)
			router.push('/')
		},
		login({ commit }, user) {
			console.log(user)
			const loginConf = axiosConfig
			loginConf.headers = {'X-Requested-With': 'vue', 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json'}
			axios.post('/signIn', user, loginConf)
				.then((response) => {
					console.log(response.data)
					const userId = response.data.userId
					localStorage.setItem('userId', userId)
					commit('SET_LOGIN', true)
					localStorage.setItem('userId', userId)
					const promise = new Promise<Player>((resolve, reject) => {
						axios.get('/user?player=' + userId).then(response => {
							const data = response.data
							if ('success' in data && data.success === false) {
								console.error(response)
								reject(response)
								return
							}

							resolve(new Player(userId, data.name))
						})
					})
					promise.then(player => {
						localStorage.setItem('player', JSON.stringify(player))
					})

					router.push('/')
				})
				.catch(function (response) {
					console.error(response)
					console.log('Da ist etwas schief gelaufen.')
				})
		},

		logout({ commit }) {
			localStorage.clear()
			axios.get('/signOut', axiosConfig)
				.then(() => {
					router.push('/login')
					commit('SET_LOGIN', false)
				})
				.catch(() => {
					router.push('/login')
					commit('SET_LOGIN', false)
					console.log('Something went wrong')
				})
		},

		register({ commit }, user) {
			const loginConf = axiosConfig
			loginConf.headers = {'X-Requested-With': 'vue', 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json'}
			axios.post('/signUp', user, loginConf)
				.then(function () {
					router.push('/login')
				}.bind(this))
				.catch(() => {
					router.push('/login')
					console.log('Something went wrong')
				})
		}
	},
	mutations: {
		SET_LOGIN(state, value) {
			state.signedIn = value
		}
	},
	getters: {
		isLoggedIn() {
			const userId = localStorage.getItem('userId')
			return userId !== '' && userId !== undefined && userId !== null
		},
		getPlayerId(): string {
			const result = localStorage.getItem('userId')
			if (result === null) {
				return ''
			}
			return result.toString()
		}
	}
})

export default store
