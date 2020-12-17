<template>
  <div class="playing-table">
    <div id="heading">
      <h1 style="text-align: center">
        Game Menu
      </h1>
    </div>
    <div style="text-align: center">
      @if(name != "") {
      <h2>Hello, @name</h2>
      }
      <a class="btn btn-dark btn-lg" role="button" href="@controllers.routes.HomeController.rules()">Rules</a>
      <br>
      <br>
      <a class="btn btn-dark btn-lg" role="button" href="@controllers.routes.HomeController.playingfield()">Start Game</a>
    </div>
  </div>
</template>

<script>
loggedIn = isLoggedIn();
if ("@playerId" === "" && loggedIn === false) {
  window.location.href = "/login";
}
if (loggedIn === false) {
  logIn("@playerId", "@name")
}
</script>

<style>
/*CSS goes here*/
</style>