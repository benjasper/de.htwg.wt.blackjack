class PlayerController {
    updatePlayerCardValue(cardValue , player = 0) {
        $(`#playerCardValue-${player + 1}`).text("Card Value: " + cardValue)
        return this;
    }
}