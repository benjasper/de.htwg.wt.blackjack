class PlayerController {
    updatePlayerCardValue(cardValue , player = 0) {
        console.log(cardValue)
        $(`#playerCardValue-${player + 1}`).text("Card Value: " + cardValue)
        return this;
    }
}