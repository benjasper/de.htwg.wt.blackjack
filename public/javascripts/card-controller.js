class CardController {
    cardback = "red_back";

    addCardToDealer(cardKey) {
        $("#hand-dealer").append(this.newImageElement(cardKey));
    }

    addFlippedCardToDealer() {
        $("#hand-dealer").append(this.newImageElement("", true));
    }

    clearDealerCards(position) {

    }

    newImageElement(cardKey, flipped = false) {
        if (flipped) {
            cardKey = this.cardback;
        }
        return $(`<img class="playing-card" src='/assets/images/cards/${cardKey}.png' alt="${cardKey}">`);
    }
}