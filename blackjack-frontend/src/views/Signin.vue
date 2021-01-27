<template>
	<div class=center>
		<h1>Login</h1>
		<form id="loginform">
			Vorname:
			<br />
			<input placeholder="Bill" v-model="name" />
			Nachname:
			<br />
			<input placeholder="Gates" v-model="lastname" />
			E-Mail-Adresse:
			<br />
			<input placeholder="max@mustermann.de" v-model="email" />
			<br /><br />
			Passwort:
			<br />
			<input type="password" v-model="password" />
			<br /><br />
			<button @click="register()">SIGN UP</button>
		</form>
		<br><br>

	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
	name: 'Signin'
})
export default class Signin extends Vue {
	name= ''
	lastname= ''
	email= ''
	password= ''
	// emailRules: [ (value) => !!value || "Required.", (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be valid" ]

	register() {
		const formData = new FormData();
		formData.append("firstName", this.name);
		formData.append("lastName", this.lastname);
		formData.append("email", this.email);
		formData.append("password", this.password);
		this.$store.dispatch("register", formData);
	},

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
