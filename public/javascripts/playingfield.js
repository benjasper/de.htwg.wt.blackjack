gameController = new GameController();

$("#start-game").click((event) => {

    gameController.newGame(event)
})

/*
$("#hitGame").click((event) => {
    gameController.hitGame(event)
})
 */

$("#standGame").click((event) => {
    gameController.gameStand(event)
})