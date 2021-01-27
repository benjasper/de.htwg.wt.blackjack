import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'

Vue.use(Vuex)

const server = ''
const axiosConfig = {
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	},
	crossdomain: true
}

const store = new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('token') || '',
		user: {},
		signedIn: false
	},
	actions: {
		setLoggedIn({ commit }, userId) {
			localStorage.setItem('userId', userId)
			commit('SET_LOGIN', true)
		},
		login({ commit }, user) {
			const loginConf = axiosConfig
			loginConf.headers = {'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json'}
			axios.post('https://' + server + '/signIn', user, loginConf)
				.then((response) => {
					console.log(response)
					commit('SET_LOGIN', true)
					router.push('/')
				})
				.catch(function (response) {
					console.error(response)
					console.log('Da ist etwas schief gelaufen.')
				})
		},

		logout({ commit }) {
			axios.get('https://' + server + '/signOut', axiosConfig)
				.then(() => {
					router.push('/login')
					commit('SET_LOGIN', false)
				})
				.catch(() => {
					console.log('Something went wrong')
				})
		},

		register({ commit }, user) {
			const loginConf = axiosConfig
			loginConf.headers = {'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json'}
			axios.post('https://' + server + '/signUp', user, loginConf)
				.then(function () {
					router.push('/login')
				}.bind(this))
				.catch(() => {
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
		}
	}
})

export default store
