package controllers

import java.util.UUID

import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.impl.providers._
import forms.SignUpForm
import javax.inject.Inject
import models.User
import play.api.i18n.Messages
import play.api.libs.mailer.Email
import play.api.mvc.{ AnyContent, Request }
import utils.route.Calls

import scala.concurrent.{ ExecutionContext, Future }

/**
 * The `Sign Up` controller.
 */
class SignUpController @Inject() (
  components: SilhouetteControllerComponents,
  signUp: views.html.signUp, matchmakingController: MatchmakingController
)(implicit ex: ExecutionContext) extends SilhouetteController(components) {

  /**
   * Views the `Sign Up` page.
   *
   * @return The result to display.
   */
  def view = UnsecuredAction.async { implicit request: Request[AnyContent] =>
    Future.successful(Ok(signUp(SignUpForm.form)))
  }

  /**
   * Handles the submitted form.
   *
   * @return The result to display.
   */
  def submit = UnsecuredAction.async { implicit request: Request[AnyContent] =>
    SignUpForm.form.bindFromRequest.fold(
      form => Future.successful(BadRequest(signUp(form))),
      data => {
        val result = Redirect(routes.SignUpController.view()).flashing("info" -> Messages("sign.up.email.sent", data.email))
        val loginInfo = LoginInfo(CredentialsProvider.ID, data.email)
        userService.retrieve(loginInfo).flatMap {
          case Some(user) =>
            val url = Calls.signin.absoluteURL()

            Future.successful(result)
          case None =>
            val authInfo = passwordHasherRegistry.current.hash(data.password)
            for {
              jsonVal <- matchmakingController.addUser(s"${data.firstName} ${data.lastName}")
              id <- Future((jsonVal \ "id").as[String])
            } yield {
              val user = User(
                userID = UUID.randomUUID(),
                loginInfo = loginInfo,
                firstName = Some(data.firstName),
                lastName = Some(data.lastName),
                fullName = Some(data.firstName + " " + data.lastName),
                email = Some(data.email),
                avatarURL = None,
                activated = false,
                apiId = Some(id)
              )
              for {
                avatar <- avatarService.retrieveURL(data.email)
                user <- userService.save(user.copy(avatarURL = avatar))
                authInfo <- authInfoRepository.add(loginInfo, authInfo)
                authToken <- authTokenService.create(user.userID)
              } yield {
                val url = routes.ActivateAccountController.activate(authToken.id).absoluteURL()
                eventBus.publish(SignUpEvent(user, request))
                result
              }
            }
            Future.successful(result)
        }
      }
    )
  }
}
