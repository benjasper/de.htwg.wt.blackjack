package controllers

import akka.actor.{ ActorSystem, Cancellable }

import scala.concurrent.ExecutionContextExecutor
import scala.concurrent.duration._
import scala.util.Random

class StartGameTask(gameController: GameController) {
  val rand_number: Int = Random.nextInt()
  implicit val actorSystem: ActorSystem = ActorSystem(s"runGame${rand_number}ExecutionContext")
  implicit val executionContext: ExecutionContextExecutor = actorSystem.dispatcher

  val task: Cancellable = actorSystem.scheduler.scheduleOnce(delay = 29.seconds) {
    println(s"Starting new round with ${gameController.players.toString()}")
    gameController.newGame()
  }
}

