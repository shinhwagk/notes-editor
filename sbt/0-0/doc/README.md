###build.sbt
```scala
name := "hello"

version := "1.0"

scalaVersion := "2.10.4"

resolvers += "releases" at "http://115.29.52.6:8081/nexus/content/repositories/releases/"

libraryDependencies += "com.typesafe.akka" % "akka-actor" % "2.0"
```