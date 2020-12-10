package utils

import play.api.libs.json.JsValue

trait Observer {
  def update(playerId: String, json: JsValue): Unit
}
