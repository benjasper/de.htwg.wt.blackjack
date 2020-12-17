p1cardsValue = 0
p2cardsValue = 0
p3cardsValue = 0
p1Name = "Player 1"
p2Name = "Player 2"
p3Name = "Player 3"
dealerCardsValue = 0

let app;

class GameController {

    cardController = new CardController();
    socket = new WebSocket('ws://localhost:9000/websocket');// Create WebSocket connection.


    constructor() {

        const self = this;

        // Connection opened
        this.socket.addEventListener('open', function (event) {
            console.log("Connected.");
            console.log(event);
        });

        this.socket.addEventListener('close', function (event) {
            console.log("Closed");
            console.log(event);
        });

        // Listen for messages
        this.socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
            const response = JSON.parse(event.data);
            switch (response.action) {
                case "NEWGAME":
                    self.cardController.clearDealerCards();
                    self.cardController.clearPlayerCards(0);
                    self.cardController.clearPlayerCards(1);
                    self.cardController.clearPlayerCards(2);

                    $('#hitGame').attr("disabled", false);
                    $('#standGame').attr("disabled", false);

                    if ('success' in response.game && response.game.success === false) {
                        self.error(response.game.msg);
                        return;
                    }

                    $('#newGame').attr("disabled", true);

                    self.cardController.addFlippedCardToDealer()

                    response.game.playerCards.forEach((card) => {
                        self.cardController.addCardToPlayer(card.card, 1)
                    });

                    self.cardController.addFlippedCardToDealer()

                    app.$data.p2cardsValue = response.game.playerCardsValue
                    app.$data.p2Name = getLoggedInPlayer().name

                    break;
                case "GAMEHIT":
                    if ('success' in response.game && response.game.success === false) {
                        self.error(response.game.msg);
                        return;
                    }

                    self.cardController.addCardToPlayer(response.game.hitCard, 1)
                    console.log(response.game);

                    if (response.game.gameStates[response.game.gameStates.length - 1].gameState === "WAITING_FOR_INPUT") {
                        $('#hitGame').attr("disabled", false);
                        $('#standGame').attr("disabled", false);

                        return;
                    }

                    self.cardController.revealDealerCards(response.game.dealerCards);
                    $("#newGame").attr("disabled", false);

                    app.$data.p2cardsValue = response.game.playerCardsValue

                    break;
                case "GAMESTAND":
                    if ('success' in response.game && response.game.success === false) {
                        self.error(response.game.msg);
                        return;
                    }
                    self.cardController.revealDealerCards(response.game.dealerCards);
                    $("#newGame").attr("disabled", false);
                    app.$data.p2cardsValue = response.game.playerCardsValue

                    app.$data.dealerCardsValue = response.game.dealerCardsValue

                    break;
            }
        });
    }

    error(error) {
        alert(error);
    }

    newGame(event) {
        $('#setBetModalBox').modal('hide');
        const request = {
            "action": "newGame",
            "playerId": getLoggedInPlayer().playerId
        };

        this.socket.send(JSON.stringify(request));
    }

    hitGame(event) {
        $('#hitGame').attr("disabled", true);
        $('#standGame').attr("disabled", true);

        const request = {
            "action": "gameHit",
            "playerId": getLoggedInPlayer().playerId
        };

        this.socket.send(JSON.stringify(request));
    }

    gameStand(event) {
        $('#hitGame').attr("disabled", true);
        $('#standGame').attr("disabled", true);

        const request = {
            "action": "gameStand",
            "playerId": getLoggedInPlayer().playerId
        };

        this.socket.send(JSON.stringify(request));
    }
}

$(document).ready(function () {
    app = new Vue({
        el: '#app',
        data: {
            p1cardsValue: p1cardsValue,
            p2cardsValue: p2cardsValue,
            p3cardsValue: p3cardsValue,
            p1Name: p1Name,
            p2Name: p2Name,
            p3Name: p3Name,
            dealerCardsValue: dealerCardsValue
        },
        methods: {
            playAction: function () {gameController.newGame(undefined)},
            hitAction: function() {gameController.hitGame(undefined)},
            standAction: function() {gameController.gameStand(undefined)},
        }
    })
})
