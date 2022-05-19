require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

//---USER---
const getUsers = async (req, res) => {
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at FROM users"
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
    "SELECT id, username, email, picture, bio, created_at FROM users WHERE username = $1",
    [username]
  );
  res.json(response.rows[0]);
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at FROM users WHERE id = $1",
    [id]
  );
  res.json(response.rows[0]);
};

const getUserByEmail = async (req, res) => {
  const email = req.params.email;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at FROM users WHERE email = $1",
    [email]
  );
  res.json(response.rows[0]);
};

const createUser = async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);
  const created_at = new Date();
  const response = await pool.query(
    "INSERT INTO users (username, password, email, created_at) VALUES ($1, $2, $3, $4)",
    [username, password, email, created_at]
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

//---IMAGE---
const getImages = async (req, res) => {
  const response = await pool.query("SELECT * FROM images");
  res.json(response.rows);
};

const getImagesCompact = async (req, res) => {
  const response = await pool.query(
    "SELECT id, user_id, description FROM images"
  );
  res.json(response.rows);
};

const getImageById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
  res.json(response.rows[0]);
};

const getImageTags = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query(
    "SELECT tags.id, name FROM image_tag JOIN tags ON tag_id = tags.id WHERE image_id = $1",
    [id]
  );
  res.json(response.rows[0]);
};

const getImagesByUserId = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT * FROM images WHERE user_id = $1", [
    id,
  ]);
  res.json(response.rows);
};

const getImagesByUsername = async (req, res) => {
  const username = req.params.username;
  const response = await pool.query(
    "SELECT images.id, user_id, file, description, images.created_at FROM images JOIN users ON images.user_id = users.id  WHERE username = $1",
    [username]
  );
  res.json(response.rows);
};

const getImagesByEmail = async (req, res) => {
  const email = req.params.email;
  const response = await pool.query(
    "SELECT images.id, user_id, file, description, images.created_at FROM images JOIN users ON images.user_id = users.id  WHERE email = $1",
    [email]
  );
  res.json(response.rows);
};

module.exports = {
  getUsers,
  getUsersCompact,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  deleteUser,
  getImages,
  getImagesCompact,
  getImageById,
  getImageTags,
  getImagesByUserId,
  getImagesByUsername,
  getImagesByEmail,
};
