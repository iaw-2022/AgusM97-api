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
  res.json(response.rows[0]);
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at, updated_at  FROM users WHERE id = $1",
    [id]
  );
  res.json(response.rows[0]);
};

const getUserByEmail = async (req, res) => {
  const email = req.params.email;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at, updated_at  FROM users WHERE email = $1",
    [email]
  );
  res.json(response.rows[0]);
};

const updateUserBio = async (req, res) => {
  const username = req.params.username;
  const bio = req.body.bio;
  const now = new Date();
  const response = await pool.query(
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
  const response = await pool.query(
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
  const created_at = (updated_at = new Date());
  const response = await pool.query(
    "INSERT INTO users (username, password, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
    [username, password, email, created_at, updated_at]
  );
  res.json({
    message: "User Added Succefully",
    body: {
      user: { username, email, password },
    },
  });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.json(`User ${id} Deleted Succesfully`);
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
