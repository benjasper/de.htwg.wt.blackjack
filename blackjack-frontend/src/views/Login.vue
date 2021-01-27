<template>
	<div class=center>
		<h1>Login</h1>
		<form id="loginform">
			E-Mail-Adresse:
			<br />
			<input placeholder="max@mustermann.de" v-model="email" />
			<br /><br />
			Passwort:
			<br />
			<input type="password" v-model="password" />
			<br /><br />
			<button @click="login()">LOGIN</button>
		</form>
		<br>
		<button @click="googleLogin()">LOGIN MIT GOOGLE</button>
		<br>
		<br><br>
		Noch keinen Account? <br>
		<button @click="gotoSignup()">REGISTRIEREN!</button>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
	name: 'Login'
})
export default class Login extends Vue {
	email= ''
	password= ''
	// emailRules: [ (value) => !!value || "Required.", (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be valid" ]

	login() {
		const formData = new FormData()
		formData.append('email', this.email)
		formData.append('password', this.password)
		this.$store.dispatch('login', formData)
	}

	googleLogin() {
		location.replace('http://localhost:9000/authenticate/google')
	}

	gotoSignup() {
		this.$router.push('signup')
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
