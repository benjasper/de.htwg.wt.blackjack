package controllers

import akka.actor.ActorRef

case class Player(id: String, name: String, playerIndex: Int, actor: ActorRef)
