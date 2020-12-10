class GameController {

    cardController = new CardController();
    playerController = new PlayerController();

    error(error) {
        alert(error);
    }

    newGame(event) {
        this.cardController.clearDealerCards();
        this.cardController.clearPlayerCards(0);
        this.cardController.clearPlayerCards(1);
        this.cardController.clearPlayerCards(2);

        $('#hitGame').attr("disabled", false);
        $('#standGame').attr("disabled", false);

        const request = $.ajax("/game/new", {
            method: "POST"
        });

        var self = this;
        request.done(function (response) {
            if ('success' in response && response.success === false) {
                self.error(response.msg);
                return;
            }

            $('#newGame').attr("disabled", true);

            self.cardController.addFlippedCardToDealer()

            response.playerCards.forEach((card) => {
                self.cardController.addCardToPlayer(card.card, 1)
                console.log(response)
            });
            let cardValue = response.playerCardsValue
            console.log(cardValue)
            self.playerController.updatePlayerCardValue(cardValue)
            self.cardController.addFlippedCardToDealer()

        });

        request.fail(function (response, textStatus) {
            self.error("Request failed: " + textStatus)
        });
    }

    hitGame(event) {
        $('#hitGame').attr("disabled", true);
        $('#standGame').attr("disabled", true);

        const request = $.ajax("/game/hit", {
            method: "POST"
        });

        var self = this;
        request.done(function (response) {
            if ('success' in response && response.success === false) {
                self.error(response.msg);
                return;
            }

            self.cardController.addCardToPlayer(response.hitCard, 1)
            console.log(response);
            let cardValue = response.playerCardsValue
            console.log(cardValue)
            self.playerController.updatePlayerCardValue(cardValue)

            if (response.gameStates[response.gameStates.length - 1].gameState === "WAITING_FOR_INPUT") {
                $('#hitGame').attr("disabled", false);
                $('#standGame').attr("disabled", false);

                return;
            }

            self.cardController.revealDealerCards(response.dealerCards);
            $("#newGame").attr("disabled", false);

        });
    }

    gameStand(event) {
        $('#hitGame').attr("disabled", true);
        $('#standGame').attr("disabled", true);

        const request = $.ajax("/game/stand", {
            method: "POST"
        });

        var self = this;
        request.done(function (response) {
            if ('success' in response && response.success === false) {
                self.error(response.msg);
                return;
            }
            self.cardController.revealDealerCards(response.dealerCards);
            $("#newGame").attr("disabled", false);
        });
    }

}