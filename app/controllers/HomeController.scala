package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import models.LoginData
import play.api.data.Form
import play.api.data.Forms.{default, mapping, nonEmptyText}

import javax.inject._
import play.api.mvc._
import play.api.libs.ws._
import play.api.libs.json.{JsValue, Json}
import play.api.libs.streams.ActorFlow
import utils.{Observable, Observer}

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContextExecutor, Future}
import controllers.Assets.Asset

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents,
                               ws: WSClient, assets: Assets) extends BaseController with play.api.i18n.I18nSupport {
  implicit val actorSystem: ActorSystem = ActorSystem("apiExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  var gamecontrollers = List[GameController]()
  val matchmaking = new MatchmakingController(ws)

  val loginForm: Form[LoginData] = Form(
    mapping(
      "name" -> nonEmptyText,
    )(LoginData.apply)(LoginData.unapply)
  )

  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index: Action[AnyContent] = {

    assets.at("/public", "index.html")

  }

  def serveRootJsFiles(file: String): Action[AnyContent] = {

    assets.versioned("/public", file+".js")
  }

  def user(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val player = request.getQueryString("player").getOrElse("")
      val r: WSRequest = ws.url("http://localhost:9002/player/" + player)
      r.get().map {
        json => Ok(json.json)
      }.recover {
        json => InternalServerError(json.getMessage)
      }
  }

  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MyWebSocketActor.props(out)
    }
  }

  object MyWebSocketActor {
    def props(out: ActorRef) = {
      Props(new MyWebSocketActor(out))
    }
  }

  class MyWebSocketActor(out: ActorRef) extends Actor with Observer {

    def receive: Receive = {
      case msg: String =>
        println(msg)
        val json = Json.parse(msg)
        val action = (json \ "action").get.as[String]
        val player = (json \ "playerId").get.as[String]
        action match {
          case "matchmaking" =>

            matchmaking.matchmaking(player).map(json => {
              val playerIndex = (json \ "playerIndex").get.as[Int]
              if (playerIndex == 0) {
                val gameController = new GameController(ws)
                gamecontrollers = gamecontrollers :+ gameController
                gameController.add(this)
                gameController.addPlayer(Player(player, "Player 0", playerIndex))
                gameController.startTask = Some(new StartGameTask(gameController))
              } else {
                val playerId = (json \ "players" \ 0).get.as[String]
                val gameController = findGamecontrollerByPlayer(playerId).get
                gameController.add(this)
                gameController.addPlayer(Player(player, s"Player $playerIndex", playerIndex))
              }
              println(gamecontrollers.toString())
              out ! Json.obj(
                "game" -> json,
                "action" -> "MATCHMAKING").toString()
            }).recover(json => {
              println(json.getMessage)
            })

          case "gameHit" =>
            val gameController = findGamecontrollerByPlayer(player)
            if (gameController.isEmpty) {
              println("Could not find GameController")
            }
            gameController.get.gameHit(player)
          case "gameStand" =>
            val gameController = findGamecontrollerByPlayer(player)
            if (gameController.isEmpty) {
              println("Could not find GameController")
            }

            gameController.get.gameStand(player)
          case "ping" =>
            out ! Json.obj(
              "player" -> player,
              "game" -> "pong",
              "action" -> "PONG").toString()
          case "forcestart" =>
            val gameController = findGamecontrollerByPlayer(player)
            if (gameController.isEmpty) {
              println("Could not find GameController")
            }

            gameController.get.forceStart()
          case _ =>
            out ! Json.obj("message" -> "Wrong action").toString()
        }
        gamecontrollers = gamecontrollers.filterNot(g => g.ended || g.subscribers.isEmpty)
    }

    override def update(playerId: String, message: JsValue, action: String): Unit = {
      out ! Json.obj(
        "player" -> playerId,
        "game" -> message,
        "action" -> action).toString()
    }
  }

  def findGamecontrollerByPlayer(playerId: String): Option[GameController] = {
    gamecontrollers.find(controller => controller.players.exists(player => player.id == playerId))
  }
}
