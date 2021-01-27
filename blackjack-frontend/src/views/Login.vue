<template>
	<v-form>
		<v-container>
			<v-row>
				<v-col cols="4"></v-col>
				<v-col cols="4">
					<v-row>
						<h1 class="text-center m-auto">Login</h1>
					</v-row>
					<v-row>
						<v-col
							cols="12"
							md="12"
						>
							<v-text-field
								v-model="email"
								label="E-mail"
								required
							></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col
							cols="12"
							md="12"
						>
							<v-text-field
								v-model="password"
								type="password"
								label="Password"
								required
							></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="4">
							<v-btn
								color="success"
								@click="login"
							>
								Log in
							</v-btn>
						</v-col>
						<v-col cols="4">
							<v-btn
								color="error"
								@click="googleLogin"
							>
								Google Log in
							</v-btn>
						</v-col
						>
						<v-col cols="4">
							<v-btn to="/signin">
								Register here
							</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" class="m-auto text-center">
							<v-btn to="/" >
								Main menu
							</v-btn>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="4"></v-col>
			</v-row>
		</v-container>
	</v-form>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import store from '@/store'

@Component({
	name: 'Login'
})
export default class Login extends Vue {
	email = ''
	password = ''

	// emailRules: [ (value) => !!value || "Required.", (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be valid" ]

	login() {
		const formData = new FormData()
		formData.append('email', this.email)
		formData.append('password', this.password)
		store.dispatch('login', formData)
	}

	googleLogin() {
		location.replace('http://localhost:9000/authenticate/google')
	}
}

</script>

<style scoped>
.center {
	position: absolute;
	top: 35%;
	left: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap;
}
</style>
