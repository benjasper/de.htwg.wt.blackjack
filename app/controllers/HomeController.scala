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
  def index(): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.menu())
  }

  def playingfield(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9002/player/5fbe39f714ffa231ca5ba48d")
      request.withRequestTimeout(Duration("3s"))
      request.get().map {
        json => Ok(views.html.playingfield(json.body))
      }.recover {
        json => InternalServerError(views.html.playingfield(json.getMessage))
      }
  }

  def rules(): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.blackjack())
  }

  def menu(): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.menu())
  }

  def blackjack(): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
        Ok(views.html.blackjack())
  }

  def newGame(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/start")
      val json: JsValue = Json.obj(
        "playerId" -> "5fbe39f714ffa231ca5ba48d",
        "betValue" -> 100
      )

      request.put(json).map {
        json => Ok(Json.parse(json.body))
      }.recover {
        json => InternalServerError(json.getMessage)
      }
  }

  def gameHit(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/hit")
      val body: JsValue = Json.obj(
        "playerId" -> "5fbe39f714ffa231ca5ba48d"
      )
      request.put(body).map {
        json => Ok(Json.parse(json.body))
      }.recover {
        json => InternalServerError(json.getMessage)
      }
  }

  def gameStand(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/stand")
      val body: JsValue = Json.obj(
        "playerId" -> "5fbe39f714ffa231ca5ba48d"
      )
      request.put(body).map {
        json => Ok(Json.parse(json.body))
      }.recover {
        json => InternalServerError(json.getMessage)
      }
  }
}
