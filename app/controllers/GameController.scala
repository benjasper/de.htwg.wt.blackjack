package controllers

import akka.actor.ActorSystem
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws
import play.api.libs.ws.{WSClient, WSRequest}
import utils.Observable

import scala.concurrent.ExecutionContextExecutor

class GameController(ws: WSClient) extends Observable {

  implicit val actorSystem: ActorSystem = ActorSystem("gameExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  def newGame(player: String): Unit = {
    val request: WSRequest = ws.url("http://localhost:9001/game/start")

    val json: JsValue = Json.obj(
      "playerId" -> player,
      "betValue" -> 100
    )

    request.put(json).map {
      json =>
        this.notifyObservers(player, json.json, "NEWGAME")
    }.recover {
      json => println(json.getMessage)
    }
  }

  def gameHit(player: String): Unit = {
    val request: WSRequest = ws.url("http://localhost:9001/game/hit")
    val body: JsValue = Json.obj(
      "playerId" -> player
    )
    request.put(body).map {
      json => this.notifyObservers(player, json.json, "GAMEHIT")
    }.recover {
      json => println(json.getMessage)
    }
  }

  def gameStand(player: String): Unit = {
    val request: WSRequest = ws.url("http://localhost:9001/game/stand")
    val body: JsValue = Json.obj(
      "playerId" -> player
    )
    request.put(body).map {
      json => this.notifyObservers(player, json.json, "GAMESTAND")
    }.recover {
      json => println(json.getMessage)
    }
  }
}