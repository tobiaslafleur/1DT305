import { buildServer } from "@/util/server";

async function main() {
  const server = await buildServer();

  server.listen(
    {
      port: 3001,
    },
    function () {
      console.log("REST service is listening on http://localhost:3001");
    }
  );
}

main();
