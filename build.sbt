name := """blackjack"""
organization := "de.htwg"

version := "1.0-SNAPSHOT"

javaOptions ++= Seq("", "-Djdk.lang.Process.allowAmbiguousCommands=true")

includeFilter in (Assets, LessKeys.less) := "*.less"
lazy val root = (project in file(".")).enablePlugins(PlayScala).enablePlugins(SbtWeb)

scalaVersion := "2.13.3"

libraryDependencies += guice
libraryDependencies += ws
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test
libraryDependencies += "org.webjars" % "bootstrap" % "3.3.4"

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.htwg.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.binders._"
