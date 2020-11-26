class GameController {

    cardController = new CardController();

    error(error) {
        alert(error);
    }

    newGame(event) {
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
            });

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

            if (response.gamestates[response.gameStates.length - 1] === "WAITING_FOR_INPUT") {
                $('#hitGame').attr("disabled", false);
                $('#standGame').attr("disabled", false);

                return;
            }

            //TODO: reveal dealer cards

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
        });
    }

}