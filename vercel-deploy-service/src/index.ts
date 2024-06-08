import { createClient, commandOptions } from "redis";

import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
  console.log("Listening for messages...");
  while (1) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );

    const id = res?.element;
    if (!id) {
      continue;
    }

    await downloadS3Folder(`output/${id}`);
    console.log("done downloading");
    await buildProject(id);
    await copyFinalDist(id);
    publisher.hSet("status", id, "deployed");
  }
}
main();

