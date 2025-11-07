import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *;
    `;
  //=== i followed guided practice for this part===
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}
