require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

const getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query(
    "SELECT id, username, email, picture, bio, created_at FROM users WHERE id = $1",
    [id]
  );
  res.json(response.rows);
};

const createUser = async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);
  const response = await pool.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
    [username, password, email]
  );
  res.json({
    message: "User Added Succefully",
    body: {
      user: { username, email, password },
    },
  });
};

module.exports = {
  getUsers,
  getUsersCompact,
  getUserById,
  createUser,
};
