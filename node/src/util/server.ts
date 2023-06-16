import fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import path from "path";
import { buildMQQTBroker } from "@/util/mqtt/broker";
import { buildMQQTClient } from "@/util/mqtt/client";
import {
  brightnessollection,
  buildDatabase,
  humidityCollection,
  moistureCollection,
  temperatureCollection,
} from "@/util/db";

export async function buildServer() {
  const server = fastify();

  await buildMQQTBroker();
  await buildMQQTClient();

  await buildDatabase();

  server.register(fastifyStatic, {
    root: path.join(__dirname, "..", "public"),
  });

  server.register(cors, {
    origin: true,
  });

  server.get("/", function (request, reply) {
    reply.sendFile("index.html");
  });

  server.register(routes, { prefix: "/api/v1" });

  return server;
}

async function routes(server: FastifyInstance) {
  server.get("/sensor", async function (request, reply) {
    const date = new Date();
    date.setHours(date.getHours() - 96);

    const queryDate = new Date(date.toISOString());

    const temperature = await temperatureCollection
      .find({ timestamp: { $gte: queryDate } })
      .sort({ timestamp: 1 })
      .toArray();

    const moisture = await moistureCollection
      .find({ timestamp: { $gte: queryDate } })
      .sort({ timestamp: 1 })
      .toArray();

    const humidity = await humidityCollection
      .find({ timestamp: { $gte: queryDate } })
      .sort({ timestamp: 1 })
      .toArray();

    const brightness = await brightnessollection
      .find({ timestamp: { $gte: queryDate } })
      .sort({ timestamp: 1 })
      .toArray();

    reply.status(200).send({ temperature, moisture, humidity, brightness });
  });
}
