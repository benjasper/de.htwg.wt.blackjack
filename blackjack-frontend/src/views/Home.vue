<template>
	<div class="playing-table">
		<div id="heading">
			<h1 style="text-align: center">
				Game Menu
			</h1>
		</div>
		<div style="text-align: center">
			<h2>Hello {{ name }}}</h2>
			<v-btn to="/rules" role="button">Rules</v-btn>
			<br>
			<br>
			<v-btn to="/game" role="button">Start Game</v-btn>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import store from '@/store'
import axios from 'axios'

@Component({})
export default class Home extends Vue {
	public name = 'Player'
	constructor() {
		super()
		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)

		const userId = urlParams.get('userId')
		if (urlParams.get('userId') === '' || userId === null || store.getters.isLoggedIn) {
			console.log('No login needed, because' + userId)
			if (store.getters.isLoggedIn) {
				axios.get('/user?player=' + userId).then(response => {
					const data = response.data
					if ('success' in data && data.success === false) {
						console.error(data.msg)
						return
					}

					this.name = data.name
				})
			}
			return
		}
		console.log('Now logging in' + userId)
		store.dispatch('setLoggedIn', urlParams.get('userId'))
		location.reload()
	}
}
</script>
