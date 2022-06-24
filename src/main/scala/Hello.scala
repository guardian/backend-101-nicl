package main

import com.sun.net.httpserver.{HttpServer, HttpHandler, HttpExchange}
import java.net.InetSocketAddress

object Hello {
  def main(args: Array[String]): Unit = {
    val server =
      HttpServer.create(new InetSocketAddress("localhost", 8001), 0)

    server.createContext(
      "/",
      new HttpHandler {
        def handle(httpExchange: HttpExchange): Unit = {
          println("GET / received.")

          val response = "Hello, World!"
          httpExchange.sendResponseHeaders(200, response.length)
          val out = httpExchange.getResponseBody()

          out.write(response.getBytes())
          out.flush()
          out.close()
        }
      }
    )

    server.start()
    println("Server started on port 8001")
  }
}
