import Aedes from "aedes";
import { createServer } from "net";

export async function buildMQQTBroker() {
  const aedes = new Aedes();
  const server = createServer(aedes.handle);

  try {
    server.listen(
      {
        host: "192.168.1.146",
        port: 1883,
      },
      function () {
        console.log("MQTT service is listening on mqtt://192.168.1.146:1883");
      }
    );
  } catch (error: any) {
    process.exit(1);
  }
}
