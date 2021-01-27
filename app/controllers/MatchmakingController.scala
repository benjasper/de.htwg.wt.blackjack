package controllers

import akka.actor.ActorSystem
import com.google.inject.Inject
import play.api.Configuration
import play.api.libs.json.{ JsValue, Json }
import play.api.libs.ws.{ WSClient, WSRequest }

import scala.concurrent.{ ExecutionContextExecutor, Future }

class MatchmakingController @Inject() (ws: WSClient, conf: Configuration) {

  implicit val actorSystem: ActorSystem = ActorSystem("matchmakingExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  val playerAPIHost: String = conf.underlying.getString("playerHost")
  val gameAPIHost: String = conf.underlying.getString("gameHost")

  def matchmaking(player: String): Future[JsValue] = {
    val request: WSRequest = ws.url(s"${gameAPIHost}game/matchmaking")

    val json: JsValue = Json.obj(
      "playerId" -> player,
      "betValue" -> 100
    )

    request.put(json).map {
      response => response.json
    }
  }

  def addUser(playerName: String): Future[JsValue] = {
    val request: WSRequest = ws.url(s"${playerAPIHost}player")

    val json: JsValue = Json.obj(
      "name" -> playerName
    )

    request.post(json).map {
      response => response.json
    }
  }
}
