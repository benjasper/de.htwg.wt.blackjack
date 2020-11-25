class CardController {

    addCardToDealer(cardKey) {
        $("#hand-dealer").append(this.newImageElement(cardKey));
    }

    clearDealerCards(position) {

    }

    newImageElement(cardKey) {
        return $(`<img class="playing-card" src='/assets/images/cards/${cardKey}.png'>`);
    }
}