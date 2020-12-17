class Player {
    playerId = "";
    name = "";

    constructor(playerId, name) {
        this.playerId = playerId;
        this.name = name;
    }
}

function isLoggedIn() {
    const playerId = localStorage.getItem("playerId")
    return playerId !== null && playerId !== "";
}

function getLoggedInPlayer() {
    if (localStorage.getItem("player") != null) {
        return JSON.parse(localStorage.getItem("player"));
    }
}

function logIn(playerId, name) {
    localStorage.setItem("playerId", playerId);
    let player = new Player(playerId, name);
    localStorage.setItem("player", JSON.stringify(player));
}