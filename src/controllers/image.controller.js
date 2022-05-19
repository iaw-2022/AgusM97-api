require("dotenv").config();
const pool = require("./pgpool");

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
    "SELECT images.id, user_id, file, description, images.created_at, images.updated_at  FROM images JOIN users ON images.user_id = users.id  WHERE username = $1",
    [username]
  );
  res.json(response.rows);
};

const getImagesByEmail = async (req, res) => {
  const email = req.params.email;
  const response = await pool.query(
    "SELECT images.id, user_id, file, description, images.created_at, images.updated_at FROM images JOIN users ON images.user_id = users.id  WHERE email = $1",
    [email]
  );
  res.json(response.rows);
};

module.exports = {
  getImages,
  getImagesCompact,
  getImageById,
  getImageTags,
  getImagesByUserId,
  getImagesByUsername,
  getImagesByEmail,
};
