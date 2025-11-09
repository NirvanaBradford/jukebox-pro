import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireBody from "#middleware/requireBody";
import requireUser from "../middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";

router.use(getUserFromToken);

router.get("/", requireUser, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "user must be logged in" });
  }
  const playlists = await getPlaylists(req.user.id);
  res.status(200).json(playlists);
});

router.post("/", requireUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Request body is required." });
    }

    const { name, description } = req.body || {};
    if (!name || !description) {
      return res.status(400).send("Request body requires: name, description");
    }

    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).json(playlist);
  } catch (error) {
    console.error("Error creating playlist", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.get("/:id", requireUser, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "user must be logged in" });
  }

  const playlist = await getPlaylistById(req.params.id);

  if (!playlist) {
    return res.status(400).json({ error: "Playlist not found" });
  }

  if (playlist.user_id !== req.user.id) {
    return res.status(403).json({ error: "forbidden" });
  }

  res.status(200).json(playlist);
});

router.get("/:id/tracks", async (req, res) => {
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

router.post("/:id/tracks", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
