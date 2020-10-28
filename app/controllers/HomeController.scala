package controllers

import akka.actor.ActorSystem
import javax.inject._
import play.api.mvc._
import play.api.libs.ws._

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
      val request: WSRequest = ws.url("http://localhost:9002/player/5f996dc0c655b6435178f41e")
      request.withRequestTimeout(Duration("3s"))
      request.get().map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }

  def newGame(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/start")
      request.put("{\n\t\"playerId\": \"5ee8ef6b4e59a14766d20456\",\n\t\"betValue\": 100\n}").map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }

  def gameHit(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/hit")
      request.put("").map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }

  def gameStand(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/stand")
      request.put("{\n\t\"playerId\": \"5ee8ef6b4e59a14766d20456\"\n}").map {
        json => Ok(views.html.index(json.body))
      }.recover {
        json => InternalServerError(views.html.index(json.getMessage))
      }
  }
}
