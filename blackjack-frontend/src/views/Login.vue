<template>
  <div class="playing-table">
    <div id="heading">
      <h1 style="text-align: center">
        Login
      </h1>
    </div>
    @helper.form(action = routes.HomeController.loginPost()) {
    @helper.inputText(loginForm("name"))
    <input type="submit" value="Login">
    }
  </div>
</template>
