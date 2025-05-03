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


  await db.files.create({
    data: {
      path: "test.txt",
      blobKey: "blobs/test.txt",
      size: 0,
    }
  });

  console.log("🌱 Finished seeding");
});
