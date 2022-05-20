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
  if (response.rows.length == 0) res.status(404).send("Image not found");
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
  if (response.rows.length == 0)
    res.status(404).send("No images by this user found");
  res.json(response.rows);
};

const getImagesByUsername = async (req, res) => {
  const username = req.params.username;
  const response = await pool.query(
    "SELECT images.id, user_id, file, description, images.created_at, images.updated_at  FROM images JOIN users ON images.user_id = users.id  WHERE username = $1",
    [username]
  );
  if (response.rows.length == 0)
    res.status(404).send("No images by this user found");
  res.json(response.rows);
};

const getImagesByEmail = async (req, res) => {
  const email = req.params.email;
  const response = await pool.query(
    "SELECT images.id, user_id, file, description, images.created_at, images.updated_at FROM images JOIN users ON images.user_id = users.id  WHERE email = $1",
    [email]
  );
  if (response.rows.length == 0)
    res.status(404).send("No images by this user found");
  res.json(response.rows);
};

const updateImageDescription = async (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  const now = new Date();
  const response = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
  if (response.rows.length == 0) res.status(404).send("Image not found");
  await pool.query(
    "UPDATE images SET description = $1, updated_at = $2 WHERE id = $3",
    [description, now, id]
  );
  res.json({
    message: "Image Description Updated Succefully",
  });
};

const uploadImage = async (req, res) => {
  const file = req.body.file;
  const description = req.body.description;
  const user_id = req.body.user_id;
  const now = new Date();

  await pool.query(
    "INSERT INTO images (file, description, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)",
    [file, description, user_id, now]
  );
  res.json({
    message: "Image Uploaded Succefully",
  });
};

module.exports = {
  getImages,
  getImagesCompact,
  getImageById,
  getImageTags,
  getImagesByUserId,
  getImagesByUsername,
  getImagesByEmail,
  updateImageDescription,
  uploadImage,
};
