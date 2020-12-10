package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import models.LoginData
import play.api.data.Form
import play.api.data.Forms.{mapping, nonEmptyText}

import javax.inject._
import play.api.mvc._
import play.api.libs.ws._
import play.api.libs.json.{JsValue, Json}
import play.api.libs.streams.ActorFlow
import utils.{Observable, Observer}

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContextExecutor, Future}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents,
                               ws: WSClient) extends BaseController with play.api.i18n.I18nSupport with Observable {
  implicit val actorSystem: ActorSystem = ActorSystem("apiExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  this.add()

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
  def index(): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.menu("", ""))
  }

  def loginFormAction(): Action[AnyContent] = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.login(loginForm))
  }

  val loginPost: Action[LoginData] = Action.async(parse.form(loginForm)) { implicit request =>
    val userData = request.body
    val newUser = models.LoginData(userData.username)
    val r: WSRequest = ws.url("http://localhost:9002/player")
    val body: JsValue = Json.obj(
      "name" -> newUser.username
    )
    r.withRequestTimeout(Duration("3s"))
    r.post(body).map {
      json =>
        Redirect(routes.HomeController.menu().absoluteURL(), Map[String, Seq[String]](
          "playerId" -> Seq((json.json \ "id").get.as[String]),
          "name" -> Seq((json.json \ "name").get.as[String])))
    }.recover {
      json =>
        printf(json.toString)
        Redirect(routes.HomeController.loginFormAction())
    }
  }

  def playingfield(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9002/player/5fa3ba4f800df34886c43d15")
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
      val playerId: String = request.getQueryString("playerId").getOrElse("")
      val name: String = request.getQueryString("name").getOrElse("")
      Ok(views.html.menu(playerId, name))
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
        json => Ok(Json.parse(json.body))
      }.recover {
        json => InternalServerError(json.getMessage)
      }
  }

  def gameHit(): Action[AnyContent] = Action.async {
    implicit request: Request[AnyContent] =>
      val request: WSRequest = ws.url("http://localhost:9001/game/hit")
      val body: JsValue = Json.obj(
        "playerId" -> "5fa3ba4f800df34886c43d15"
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
      val player = "5fa3ba4f800df34886c43d15"
      val body: JsValue = Json.obj(
        "playerId" -> player
      )
      request.put(body).map {
        json =>
          this.notifyObservers(player,json.json)
      }.recover {
        json => InternalServerError(json.getMessage)
      }
  }

  def socket: WebSocket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MyWebSocketActor.create(out, this)
    }
  }

  object MyWebSocketActor {
    def create(out: ActorRef, controller: HomeController): Props = {
      val actor = new MyWebSocketActor(out)
      controller.add(actor)
      Props(actor)
    }
  }

  class MyWebSocketActor(out: ActorRef) extends Actor with Observer {

    def receive = {
      case msg: String =>
        out ! ("I received your message: " + msg)
    }

    override def update(playerId: String, message: JsValue): Unit = {


    }
  }
}
