package controllers

import akka.actor.{ActorRef, ActorSystem}
import play.api.libs.json.{JsArray, JsObject, JsValue, Json}
import play.api.libs.ws
import play.api.libs.ws.{WSClient, WSRequest}
import utils.Observable

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContextExecutor, Future}

class GameController(ws: WSClient) extends Observable {

  implicit val actorSystem: ActorSystem = ActorSystem("gameExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  var players: List[Player] = List()
  var turns: Vector[Player] = Vector()
  var ended = false
  var startTask: Option[StartGameTask] = None

  def addPlayer(player: Player): GameController = {
    players = players :+ player
    turns = turns :+ player
    this.notifyObservers(player.id, Json.obj(
      "name" -> player.name
    ), "JOIN", "")
    this
  }

  private def nextPlayer(): Option[Player] = {
    val playerOption = turns.headOption
    if (playerOption.isEmpty) {
      return None
    }

    val player = playerOption.get

    Some(player)
  }

  private def dropFromTurns(player: Player): Player = {
    turns = turns.filterNot(p => p.id == player.id)
    player
  }

  def removePlayer(out: ActorRef): GameController = {
    players = players.filterNot(p => p.actor == out)

    this
  }

  def forceStart(): Unit = {
    startTask.get.task.cancel()
    newGame()
  }

  private def dropPlayerIfEnded(playerIndex: Int, response: JsValue): Unit = {
    val gamestates = (response \ "gameStates" \ playerIndex).get.as[List[JsObject]]
    if (gamestates.exists(gamestate => ((gamestate \ "gameState")).get.as[String] == "DONE")) {
      dropFromTurns(players(playerIndex))
    }
  }

  def newGame(): Unit = {
    var responses: List[JsValue] = List()
    var futures: List[Future[Unit]] = List()

    for ((player, index) <- players.zipWithIndex) {
      val request: WSRequest = ws.url("http://localhost:9001/game/start")

      val json: JsValue = Json.obj(
        "playerId" -> player.id
      )

      val future = request.put(json).map {
        json =>
          dropPlayerIfEnded(index, json.json)

          responses = responses :+ json.json
      }.recover {
        json => println(json.getMessage)
      }
      futures = futures :+ future

      if (index != players.size - 1) {
        Thread.sleep(500)
      }
    }

    for (future <- futures) {
      Await.result(future, Duration("10s"))
    }

    var nextTurnId = ""
    val nextTurnOption = nextPlayer()
    if (nextTurnOption.isDefined) {
      nextTurnId = nextTurnOption.get.id
    }

    for ((response, index) <- responses.zipWithIndex) {
      this.notifyObservers(players(index).id, response, "NEWGAME", nextTurnId)
      checkForRevealed(response: JsValue)
    }
  }

  def gameHit(player: String): Unit = {
    val request: WSRequest = ws.url("http://localhost:9001/game/hit")
    val body: JsValue = Json.obj(
      "playerId" -> player
    )
    var response: Option[JsValue] = None
    val future = request.put(body).map {
      json =>
        response = Some(json.json)
        dropPlayerIfEnded(players.indexWhere(p => p.id == player), json.json)
    }.recover {
      json => println(json.getMessage)
    }

    Await.result(future, Duration("10s"))

    var nextTurnId = ""
    val nextTurnOption = nextPlayer()
    if (nextTurnOption.isDefined) {
      nextTurnId = nextTurnOption.get.id
    }
    this.notifyObservers(player, response.get, "GAMEHIT", nextTurnId)
    checkForRevealed(response.get)
  }

  def gameStand(player: String): Unit = {
    val request: WSRequest = ws.url("http://localhost:9001/game/stand")
    val body: JsValue = Json.obj(
      "playerId" -> player
    )
    var response: Option[JsValue] = None
    val future = request.put(body).map {
      json =>
        response = Some(json.json)
        dropPlayerIfEnded(players.indexWhere(p => p.id == player), json.json)
    }.recover {
      json => println(json.getMessage)
    }

    Await.result(future, Duration("10s"))

    var nextTurnId = ""
    val nextTurnOption = nextPlayer()
    if (nextTurnOption.isDefined) {
      nextTurnId = nextTurnOption.get.id
    }

    this.notifyObservers(player, response.get, "GAMESTAND", nextTurnId)
    checkForRevealed(response.get)
  }

  def checkForRevealed(json: JsValue): Unit = {
    val revealed = (json \ "revealed").get.as[Boolean]
    if (revealed) {
      ended = true
      players = List()
      subscribers = Vector()
    }
  }
}
