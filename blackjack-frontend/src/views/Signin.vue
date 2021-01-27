<template>
	<v-form>
		<v-container>
			<v-row>
				<v-col cols="4"></v-col>
				<v-col cols="4">
					<v-row>
						<h1 class="text-center m-auto">Register</h1>
					</v-row>
					<v-row>
						<v-col
							cols="6"
							md="6"
						>
							<v-text-field
								v-model="name"
								label="First name"
								required
							></v-text-field>
						</v-col>

						<v-col
							cols="6"
							md="6"
						>
							<v-text-field
								v-model="lastname"
								label="Last name"
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
						<v-col cols="6">
							<v-btn @click="register()" color="success">
								Register
							</v-btn>
						</v-col>
						<v-col cols="6">
							<v-btn to="/login">
								Login instead
							</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="4" class="m-auto">
							<v-btn to="/">
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
	name: 'Signin'
})
export default class Signin extends Vue {
	name = ''
	lastname = ''
	email = ''
	password = ''

	// emailRules: [ (value) => !!value || "Required.", (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "E-mail must be valid" ]

	register() {
		const formData = new FormData()
		formData.append('firstName', this.name)
		formData.append('lastName', this.lastname)
		formData.append('email', this.email)
		formData.append('password', this.password)
		store.dispatch('register', formData)
	}
}

</script>

<style scoped>
.center {
	position: absolute;
	top: 35%;
	left: 50%;
	transform: translate(-50%, -50%);
	white-space: nowrap
}
</style>
