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

            $(event.target).attr("disabled", true);

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
}