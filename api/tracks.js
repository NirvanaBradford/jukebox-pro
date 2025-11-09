import express from "express";
const router = express.Router();
export default router;

import {
  getTracks,
  getTrackById,
  getPlaylistsByTrackId,
} from "#db/queries/tracks";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { getPlaylistsByTrackId } from "#db/queries/tracks";
import { getTrackById } from "#db/queries/tracks";

router.use(getUserFromToken);

router.get("/", requireUser, async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "user must be logged in" });
    }

    const trackId = Number(req.params.id);
    if (isNaN(trackId)) {
      return res.status(400).json({ error: "Invalid track id" });
    }

    const track = await getTrackById(trackId);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    const playlists = await getPlaylistsByTrackId(req.user.id, trackId);
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error in GET /tracks/:id/playlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
