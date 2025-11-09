import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "./queries/users.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  const user1 = await createUser("I'a", "password123");
  const user2 = await createUser("Maria", "password456");

  const playlist1 = await createPlaylist(
    "I'a playlist",
    "chill vibes",
    user1.id
  );

  const playlist2 = await createPlaylist(
    "Maria playlist",
    "latina baddie hits",
    user2.id
  );

  for (let i = 1; i <= 5; i++) {
    await createPlaylistTrack(playlist1.id, i);
  }

  for (let i = 6; i <= 10; i++) {
    await createPlaylistTrack(playlist2.id, i);
  }

  console.log("database seed correctly!");
}
