package controllers

import akka.actor.ActorSystem
import javax.inject._
import play.api.mvc._
import play.api.libs.ws._
import play.api.libs.json.{JsValue, Json}

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContextExecutor, Future}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents,
                               ws: WSClient) extends BaseController {
  implicit val actorSystem: ActorSystem = ActorSystem("apiExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9002/player/5fa3ba4f800df34886c43d15")
      request.withRequestTimeout(Duration("3s"))
      request.get().map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }

  def blackjack(): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
        Ok(views.html.blackjack())
  }

  def newGame(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/start")
      val json: JsValue = Json.obj(
        "playerId" -> "5fa3ba4f800df34886c43d15",
        "betValue" -> 100
      )
      request.put(json).map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }

  def gameHit(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/hit")
      val json: JsValue = Json.obj(
        "playerId" -> "5fa3ba4f800df34886c43d15"
      )
      request.put(json).map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }

  def gameStand(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/stand")
      val json: JsValue = Json.obj(
        "playerId" -> "5fa3ba4f800df34886c43d15"
      )
      request.put(json).map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }
}
