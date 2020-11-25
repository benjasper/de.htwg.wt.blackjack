class GameController {

    cardController = new CardController();

    error(error) {
        alert(error);
    }

    newGame() {
        const request = $.ajax("/game/new", {
            method: "POST"
        });

        var self = this;
        request.done(function (response) {
            if (response.success && response.success === false) {
                self.error(response.msg);
                return;
            }

            self.cardController.addFlippedCardToDealer()

        });

        request.fail(function (response, textStatus) {
            self.error("Request failed: " + textStatus)
        });
    }
}