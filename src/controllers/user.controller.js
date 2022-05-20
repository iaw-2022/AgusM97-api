require("dotenv").config();
const pool = require("./pgpool");
const bcrypt = require("bcrypt");
const req = require("express/lib/request");

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
  res.json(response.rows[0]);
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
  const response = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (response.rows.length == 0) res.status(404).send("User not found");
  await pool.query("DELETE FROM users WHERE username = $1", [username]);
  res.json(`User ${username} Deleted Succesfully`);
};

//--MIDDLEWARE--

const usernameTaken = async (req, res, next) => {
  const username = req.body.username;
  const response = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (response.rows.length != 0)
    res.status(409).send("This username is already taken");
  else next();
};

const emailTaken = async (req, res, next) => {
  const email = req.body.email;
  const response = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (response.rows.length != 0)
    res
      .status(409)
      .send("There is already an account using this email address");
  else next();
};

const passwordTaken = async (req, res, next) => {
  const response = await pool.query("SELECT password FROM users");
  response.rows.forEach((row) => {
    if (bcrypt.compareSync(req.body.password, row.password)) {
      res.status(409).send("This password is already taken");
      return next("Invalid password");
    }
  });
  next();
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
  usernameTaken,
  emailTaken,
  passwordTaken,
};
