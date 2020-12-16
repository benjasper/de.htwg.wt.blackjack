class CardController {
    cardback = "blue_back";

    addCardToDealer(cardKey) {
        const stack = $("#hand-dealer .cards");
        this.removePlaceholderIfNecessary(stack);
        stack.append(this.newListWrappedImageElement(cardKey));
        return this;
    }

    addCardToPlayer(cardKey, player = 0) {
        const stack = $(`#player-stack-player-${player + 1} .cards`);
        this.removePlaceholderIfNecessary(stack);
        stack.append(this.newListWrappedImageElement(cardKey));
        return this;
    }

    addFlippedCardToDealer() {
        const stack = $("#hand-dealer .cards");
        this.removePlaceholderIfNecessary(stack);
        stack.append(this.newListWrappedImageElement("", true));
        return this;
    }

    removePlaceholderIfNecessary(element) {
        const selector = element.find('.placeholder');
        if (selector) {
            selector.remove();
        }
    }

    revealDealerCards(dealerCards) {
        const stack = $("#hand-dealer .cards");
        this.clearDealerCards();
        const self = this;

        this.removePlaceholderIfNecessary(stack);
        dealerCards.forEach((element) => {
           stack.append(self.newListWrappedImageElement(element.card))
        });
    }

    clearDealerCards() {
        const stack = $("#hand-dealer .cards");
        stack.empty();
        stack.append(this.newPlaceHolder());
        return this;
    }

    clearPlayerCards(player = 0) {
        const stack = $(`#player-stack-player-${player + 1} .cards`);

        stack.empty();
        stack.append(this.newPlaceHolder())
    }

    newListWrappedImageElement(cardKey, flipped = false) {
        if (flipped) {
            cardKey = this.cardback;
        }
        return $(`<li><img class="playing-card" src='/assets/images/cards/${cardKey}.png' alt="${cardKey}"></li>`);
    }

    newPlaceHolder() {
        return $(`<li class="placeholder"><img class="playing-card" src='/assets/images/cards/${this.cardback}.png' alt="${this.cardback}"></li>`);
    }
}