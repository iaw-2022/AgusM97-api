require("dotenv").config();
const pool = require("./pgpool");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at, updated_at FROM users"
  );
  res.json(response.rows);
};

const getUsersCompact = async (req, res) => {
  const response = await pool.query("SELECT id, username, email FROM users");
  res.json(response.rows);
};

const getUserByUsername = async (req, res) => {
  const username = req.params.username;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at, updated_at  FROM users WHERE username = $1",
    [username]
  );
  if (response.rows.length == 0) res.status(404).send("User not found");
  res.status(404).json(response.rows[0]);
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at, updated_at  FROM users WHERE id = $1",
    [id]
  );
  if (response.rows.length == 0) res.status(404).send("User not found");
  res.json(response.rows[0]);
};

const getUserByEmail = async (req, res) => {
  const email = req.params.email;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at, updated_at  FROM users WHERE email = $1",
    [email]
  );
  if (response.rows.length == 0) res.status(404).send("User not found");
  res.json(response.rows[0]);
};

const updateUserBio = async (req, res) => {
  const username = req.params.username;
  const bio = req.body.bio;
  const now = new Date();
  const response = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (response.rows.length == 0) res.status(404).send("User not found");
  await pool.query(
    "UPDATE users SET bio = $1, updated_at = $2 WHERE username = $3",
    [bio, now, username]
  );
  res.json({
    message: "User Bio Updated Succefully",
  });
};

const updateUserPicture = async (req, res) => {
  const username = req.params.username;
  const picture = req.body.picture;
  const now = new Date();
  const response = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (response.rows.length == 0) res.status(404).send("User not found");
  await pool.query(
    "UPDATE users SET picture = $1, updated_at = $2 WHERE username = $3",
    [picture, now, username]
  );
  res.json({
    message: "User Picture Updated Succefully",
  });
};

const createUser = async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);
  const now = new Date();

  const response1 = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (response1.rows.length != 0)
    res.status(409).send("This username is already taken");

  const response2 = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (response2.rows.length != 0)
    res
      .status(409)
      .send("There is already an account using this email address");

  const response3 = await pool.query("SELECT password FROM users");
  response3.rows.forEach((row) => {
    if (bcrypt.compare(req.body.password, row.password))
      res.status(409).send("This password is already taken");
  });

  await pool.query(
    "INSERT INTO users (username, password, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)",
    [username, password, email, now]
  );
  res.json({
    message: "User Added Succefully",
    body: {
      user: { username, email },
    },
  });
};

const deleteUser = async (req, res) => {
  const username = req.params.username;
  const response = await pool.query("DELETE FROM users WHERE username = $1", [
    username,
  ]);
  res.json(`User ${username} Deleted Succesfully`);
};

module.exports = {
  getUsers,
  getUsersCompact,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserBio,
  updateUserPicture,
  createUser,
  deleteUser,
};
