package controllers

import akka.actor.ActorSystem
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.{WSClient, WSRequest}
import utils.Observable

import scala.concurrent.{ExecutionContextExecutor, Future}

class MatchmakingController(ws: WSClient, gameHost: String) {

  implicit val actorSystem: ActorSystem = ActorSystem("matchmakingExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  def matchmaking(player: String): Future[JsValue] = {
    val request: WSRequest = ws.url(s"${gameHost}game/matchmaking")

    val json: JsValue = Json.obj(
      "playerId" -> player,
      "betValue" -> 100
    )

    request.put(json).map{
      response => response.json
    }
  }
}
