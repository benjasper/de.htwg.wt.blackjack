package controllers

import akka.actor.ActorSystem

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor}
import scala.concurrent.duration._
import scala.util.Random

class StartGameTask(gameController: GameController) {
  val rand_number: Int = Random.nextInt()
  implicit val actorSystem: ActorSystem = ActorSystem(s"runGame${rand_number}ExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  actorSystem.scheduler.scheduleOnce(delay = 29.seconds) {
    print(s"Starting new round with ${gameController.players.toString()}")
    gameController.newGame()
  }
}

