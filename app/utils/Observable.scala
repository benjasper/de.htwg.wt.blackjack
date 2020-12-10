package utils

import play.api.libs.json.JsValue

class Observable {
  var subscribers: Vector[Observer] = Vector()

  def add(s: Observer): Unit = subscribers = subscribers :+ s

  def remove(s: Observer): Unit = subscribers = subscribers.filterNot(o => o == s)

  def notifyObservers(playerId: String, message: JsValue, action: String): Unit = subscribers.foreach(o => o.update(playerId, message, action))
}
