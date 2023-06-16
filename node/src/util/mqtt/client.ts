import {
  brightnessollection,
  humidityCollection,
  moistureCollection,
  temperatureCollection,
} from "@/util/db";
import * as mqtt from "mqtt";

export async function buildMQQTClient() {
  const client = mqtt.connect("mqtt://192.168.1.146");

  client.on("connect", () => {
    client.subscribe("iot");
  });

  client.on("message", async (_, message) => {
    const res = JSON.parse(message.toString());

    const date = new Date(res.date * 1000);

    await temperatureCollection.insertOne({
      clientId: res.client_id,
      timestamp: date,
      temperature: res.temperature,
    });

    await moistureCollection.insertOne({
      clientId: res.client_id,
      timestamp: date,
      moisture: res.moisture,
    });

    await humidityCollection.insertOne({
      clientId: res.client_id,
      timestamp: date,
      humidity: res.humidity,
    });

    await brightnessollection.insertOne({
      clientId: res.client_id,
      timestamp: date,
      brightness: res.brightness,
    });
  });
}
