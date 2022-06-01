require("dotenv").config();
const pool = require("./pgpool");
const jwt_decode = require("jwt-decode");

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
  else res.json(response.rows[0]);
};

const getImageTags = async (req, res) => {
  const id = req.params.image_id;
  const response = await pool.query(
    "SELECT tags.id, name, tags.created_at, tags.updated_at FROM image_tag JOIN tags ON tag_id = tags.id WHERE image_id = $1",
    [id]
  );
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

const updateImageDescription = async (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  const now = new Date();
  const response = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
  if (response.rows.length == 0) res.status(404).send("Image not found");
  else {
    await pool.query(
      "UPDATE images SET description = $1, updated_at = $2 WHERE id = $3",
      [description, now, id]
    );
    res.json({
      message: "Image Description Updated Succefully",
    });
  }
};

const addTagToImage = async (req, res) => {
  const image_id = req.params.image_id;
  const tag_id = req.params.tag_id;
  const response = await pool.query(
    "SELECT * FROM image_tag WHERE image_id = $1 AND tag_id = $2",
    [image_id, tag_id]
  );
  if (response.rows.length != 0)
    res.status(409).send("Image/Tag relationship already exists");
  else {
    await pool.query(
      "INSERT INTO image_tag (image_id, tag_id) VALUES ($1, $2)",
      [image_id, tag_id]
    );
    res.json({
      message: "Tag Added To Image Succefully",
    });
  }
};

const removeTagFromImage = async (req, res) => {
  const image_id = req.params.image_id;
  const tag_id = req.params.tag_id;
  const response = await pool.query(
    "SELECT * FROM image_tag WHERE image_id = $1 AND tag_id = $2",
    [image_id, tag_id]
  );
  if (response.rows.length == 0)
    res.status(404).send("Image/Tag relationship doesn't exists");
  else {
    await pool.query(
      "DELETE FROM image_tag WHERE image_id = $1 AND tag_id = $2",
      [image_id, tag_id]
    );
    res.json({
      message: "Tag Removed From Image Succefully",
    });
  }
};

const uploadImage = async (req, res) => {
  const file = req.body.file;
  const description = req.body.description;
  const tokken = jwt_decode(req.header("authorization").replace("Bearer ", ""));
  const email = tokken[process.env.EMAIL_URL];
  const response = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  const now = new Date();

  await pool.query(
    "INSERT INTO images (file, description, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)",
    [file, description, response.rows[0].id, now]
  );
  res.json({
    message: "Image Uploaded Succefully",
  });
};

const deleteImage = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
  if (response.rows.length == 0) res.status(404).send("Image not found");
  else {
    await pool.query("DELETE FROM images WHERE id = $1", [id]);
    res.json("Image Deleted Succesfully");
  }
};

//--MIDDLEWARE--
const imageExists = async (req, res, next) => {
  const image_id = req.params.image_id;
  const response = await pool.query("SELECT * FROM images WHERE id = $1", [
    image_id,
  ]);
  if (response.rows.length == 0)
    res.status(404).send("This image doesn't exists");
  else next();
};

module.exports = {
  getImages,
  getImagesCompact,
  getImageById,
  getImageTags,
  getImagesByUsername,
  updateImageDescription,
  addTagToImage,
  removeTagFromImage,
  uploadImage,
  deleteImage,
  imageExists,
};
