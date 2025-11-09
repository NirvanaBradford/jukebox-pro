import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    if (!req.body) {
      return res.status(400).json({
        error: "request body is missing required fields: username and password",
      });
    }

    const signUp = await createUser(username, password);
    const token = createToken({ id: signUp.id });

    res.status(201).send(token);
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const login = await getUserByUsernameAndPassword(username, password);
    if (!login)
      return res.status(400).json({
        error: "request body is missing required fields: username and password",
      });

    const token = createToken({ id: login.id });
    res.send(token);
  }
);
