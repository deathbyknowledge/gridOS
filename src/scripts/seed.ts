import { defineScript } from "@redwoodjs/sdk/worker";
import { db, setupDb } from "@/db";

export default defineScript(async ({ env }) => {
  setupDb(env);

  await db.$executeRawUnsafe(`\
    DELETE FROM Credential;
    DELETE FROM User;
    DELETE FROM Files;
    DELETE FROM sqlite_sequence;
  `);
  await env.R2.delete(["blobs/1234", "blobs/5678"]);


  await db.files.createMany({
    data: [{
      path: "/foo/bar/baz.txt",
      blobKey: "1234",
      size: 0,
    }, {
      path: "/foo/bar.txt",
      blobKey: "5678",
      size: 0,
    }
    ],
  });

  await env.R2.put("blobs/1234", new Blob(["Hello, world!"]));
  await env.R2.put("blobs/5678", new Blob(["Good bye, world! :')"]));

  console.log("🌱 Finished seeding");
});
