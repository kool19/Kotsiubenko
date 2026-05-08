import { migrate } from "./migrate";
import { run } from "./dbClient";

async function seed(): Promise<void> {
  await migrate();

  const now = new Date().toISOString();

  //  Users 
  await run(
    `INSERT OR IGNORE INTO Users (id, name, email, createdAt)
     VALUES ('u1', 'Olena', 'olena@example.com', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO Users (id, name, email, createdAt)
     VALUES ('u2', 'Ivan', 'ivan@example.com', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO Users (id, name, email, createdAt)
     VALUES ('u3', 'Maria', 'maria@example.com', '${now}');`,
  );

  // Items (заявки/інциденти) 
  await run(
    `INSERT OR IGNORE INTO Items (id, "user", severity, status, text, createdAt)
     VALUES ('i1', 'olena', 'High', 'Open', 'Production server is down', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO Items (id, "user", severity, status, text, createdAt)
     VALUES ('i2', 'ivan', 'Medium', 'InProgress', 'Login page loads slowly', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO Items (id, "user", severity, status, text, createdAt)
     VALUES ('i3', 'olena', 'Low', 'Done', 'Update README documentation', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO Items (id, "user", severity, status, text, createdAt)
     VALUES ('i4', 'maria', 'High', 'Open', 'Database connection pool exhausted', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO Items (id, "user", severity, status, text, createdAt)
     VALUES ('i5', 'ivan', 'Low', 'Open', 'Typo in the footer text', '${now}');`,
  );

  // ItemComments 
  await run(
    `INSERT OR IGNORE INTO ItemComments (id, itemId, authorName, body, createdAt)
     VALUES ('c1', 'i1', 'Ivan', 'Looking into this right now', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO ItemComments (id, itemId, authorName, body, createdAt)
     VALUES ('c2', 'i1', 'Olena', 'Found the root cause — disk is full', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO ItemComments (id, itemId, authorName, body, createdAt)
     VALUES ('c3', 'i2', 'Maria', 'Could be related to the new CDN config', '${now}');`,
  );
  await run(
    `INSERT OR IGNORE INTO ItemComments (id, itemId, authorName, body, createdAt)
     VALUES ('c4', 'i4', 'Olena', 'Restarted the pool, monitoring now', '${now}');`,
  );

  console.log("Seed completed successfully");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
