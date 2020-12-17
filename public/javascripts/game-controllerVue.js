console.log("Yes I'm here!")

socket = new WebSocket('ws://localhost:9000/websocket');// Create WebSocket connection.

function constructor() {

    cardController = new CardController();

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
                break;
            case "GAMESTAND":
                if ('success' in response.game && response.game.success === false) {
                    self.error(response.game.msg);
                    return;
                }
                self.cardController.revealDealerCards(response.game.dealerCards);
                $("#newGame").attr("disabled", false);
                break;
        }
    });
}

function error(error) {
    alert(error);
}

function newGame(event) {
    const request = {
        "action": "newGame",
        "playerId": getLoggedInPlayer().playerId
    };

    this.socket.send(JSON.stringify(request));
}

function hitGame(event) {
    $('#hitGame').attr("disabled", true);
    $('#standGame').attr("disabled", true);

    const request = {
        "action": "gameHit",
        "playerId": getLoggedInPlayer().playerId
    };

    this.socket.send(JSON.stringify(request));
}

function gameStand(event) {
    $('#hitGame').attr("disabled", true);
    $('#standGame').attr("disabled", true);

    const request = {
        "action": "gameStand",
        "playerId": getLoggedInPlayer().playerId
    };

    this.socket.send(JSON.stringify(request));
}