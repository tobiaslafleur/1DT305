import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(process.env.MONGO_URI as string);
export const db = mongoClient.db("iot");

export const temperatureCollection = db.collection("temperature");
export const humidityCollection = db.collection("humidity");
export const moistureCollection = db.collection("moisture");
export const brightnessollection = db.collection("brightness");

export async function createCollections() {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((collection) => collection.name);

  const missingCollections = newCollections.filter(function (collection) {
    return !collectionNames.includes(collection.name);
  });

  for (const collection of missingCollections) {
    await db.createCollection(collection.name, {
      ignoreUndefined: true,
      timeseries: {
        timeField: "timestamp",
        metaField: collection.metaField,
        granularity: "seconds",
      },
    });
  }
}

export async function buildDatabase() {
  try {
    await createCollections();
    await createIndexes();

    await mongoClient.connect();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    process.exit(1);
  }
}

export async function createIndexes() {
  temperatureCollection.createIndex({ timestamp: 1 });
  humidityCollection.createIndex({ timestamp: 1 });
  moistureCollection.createIndex({ timestamp: 1 });
  brightnessollection.createIndex({ timestamp: 1 });
}

const newCollections = [
  {
    name: "temperature",
    metaField: "clientId",
  },
  {
    name: "humidity",
    metaField: "clientId",
  },
  {
    name: "moisture",
    metaField: "clientId",
  },
  {
    name: "brightness",
    metaField: "clientId",
  },
];
