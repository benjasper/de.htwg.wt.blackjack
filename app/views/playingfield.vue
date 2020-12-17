<template>
  <div class="playing-table">
    <section class="dealer">
      <div class="col"></div>
      <div id="hand-dealer" class="col hand-dealer">
        <ul class="cards">
          <li class="placeholder">
            <img class="playing-card" src="/assets/images/cards/5D.png" alt="Card">
          </li>
        </ul>
      </div>
      <div class="col stack">
        <img class="playing-card" src="/assets/images/cards/blue_back.png" alt="Card">
      </div>
    </section>

    <section class="players">
      <div id="player-stack-player-1" class="player-stack player-1" >
        <ul class="cards">
          <li class="placeholder">
            <img class="playing-card" src="/assets/images/cards/5D.png" alt="Card">
          </li>
        </ul>
        <div class="info">
          <span>Cards Value: 5</span>
          <span>Player 1</span>
        </div>
      </div>
      <div id="player-stack-player-2" class="player-stack player-2">
        <ul class="cards">
          <li class="placeholder">
            <img class="playing-card" style="visibility: hidden" src="/assets/images/cards/5D.png" alt="Card">
          </li>
        </ul>
        <div class="info">
          <span>Cards Value: 5</span>
          <span>Player 2</span>
        </div>
      </div>
      <div id="player-stack-player-3" class="player-stack player-3">
        <ul class="cards">
          <li class="placeholder">
            <img class="playing-card" src="/assets/images/cards/5D.png" alt="Card">
          </li>
        </ul>
        <div class="info">
          <span>Cards Value: 5</span>
          <span>Player 3</span>
        </div>
      </div>
    </section>
  </div>
  <div class="modal fade" id="setBetModalBox" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Set Your Bet!</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Set your bet for the next game:</p>
          <label>
            Bet value
            <input type="number" max="">
          </label>
        </div>
        <div class="modal-footer">
          <button id="start-game" type="button" class="btn btn-primary">PLAY!</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid control-bar">
    <div class="row">
      <div class="col-md-3 menu control-child">
        <div class="row h-100 m-auto">
          <a class="btn btn-secondary btn-lg" href="@controllers.routes.HomeController.menu()">
            Back</a>
          <input type="button" class="btn btn-light btn-lg ml-1" id="newGame" value="NEW GAME"/>
        </div>
      </div>
      <div class="col-md-6 actions control-child">
        <div class="row h-100">
          <div class="m-auto">
            <input type="button" class="btn btn-light btn-lg" id="hitGame" disabled value="HIT">
            <input type="button" class="btn btn-light btn-lg" id="standGame" disabled value="STAND">
          </div>
        </div>
      </div>
      <div class="col-md-3 stats control-child">
        <span>Balance: 1000$</span>
      </div>
    </div>
  </div>
</template>

<script>
$(document).ready(function () {

  // Attach Button click event listener
  $("#newGame").click(function () {

    // show Modal
    $('#setBetModalBox').modal('show');
  });
});
</script>

<style>
/*CSS goes here*/
</style>