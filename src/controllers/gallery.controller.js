require("dotenv").config();
const pool = require("./pgpool");
const { getIdFromToken } = require("./user.controller");

const getGalleries = async (req, res) => {
  const response = await pool.query("SELECT * FROM galleries");
  res.json(response.rows);
};

const getGalleryById = async (req, res) => {
  const id = req.params.gallery_id;
  const response = await pool.query("SELECT * FROM galleries WHERE id = $1", [
    id,
  ]);
  if (response.rows.length == 0) res.status(404).send("Gallery not found");
  else res.json(response.rows[0]);
};

const getGalleriesByUsername = async (req, res) => {
  const username = req.params.username;
  const response = await pool.query(
    "SELECT galleries.id, name, user_id, galleries.created_at, galleries.updated_at  FROM galleries JOIN users ON galleries.user_id = users.id  WHERE username = $1",
    [username]
  );
  res.json(response.rows);
};

const getGalleryImages = async (req, res) => {
  const id = req.params.gallery_id;
  const response = await pool.query(
    "SELECT images.id, user_id, file, description, images.created_at, images.updated_at FROM gallery_image JOIN images ON image_id = images.id WHERE gallery_id = $1",
    [id]
  );
  res.json(response.rows);
};

const addImageToGallery = async (req, res) => {
  const gallery_id = req.params.gallery_id;
  const image_id = req.params.image_id;
  const response = await pool.query(
    "SELECT * FROM gallery_image WHERE image_id = $1 AND gallery_id = $2",
    [image_id, gallery_id]
  );
  if (response.rows.length != 0)
    res.status(409).send("Image is already in this gallery");
  else {
    await pool.query(
      "INSERT INTO gallery_image (image_id, gallery_id) VALUES ($1, $2)",
      [image_id, gallery_id]
    );
    res.json({
      message: "Image Added To Gallery Succefully",
    });
  }
};

const removeImageFromGallery = async (req, res) => {
  const image_id = req.params.image_id;
  const gallery_id = req.params.gallery_id;
  const response = await pool.query(
    "SELECT * FROM gallery_image WHERE image_id = $1 AND gallery_id = $2",
    [image_id, gallery_id]
  );
  if (response.rows.length == 0)
    res.status(404).send("Image is not in this gallery");
  else {
    await pool.query(
      "DELETE FROM gallery_image WHERE image_id = $1 AND gallery_id = $2",
      [image_id, gallery_id]
    );
    res.json({
      message: "Image Removed From Gallery Succefully",
    });
  }
};

const createGallery = async (req, res) => {
  const name = req.body.name;
  const user_id = req.body.user_id;
  const now = new Date();

  await pool.query(
    "INSERT INTO galleries (name, user_id, created_at, updated_at) VALUES ($1, $2, $3, $3)",
    [name, user_id, now]
  );
  res.json({
    message: "Gallery Created Succefully",
  });
};

const deleteGallery = async (req, res) => {
  const id = req.params.gallery_id;
  const response = await pool.query("SELECT * FROM galleries WHERE id = $1", [
    id,
  ]);
  if (response.rows.length == 0) res.status(404).send("Gallery not found");
  else {
    await pool.query("DELETE FROM galleries WHERE id = $1", [id]);
    res.json("Gallery Deleted Succesfully");
  }
};

//--MIDDLEWARE--
const galleryExists = async (req, res, next) => {
  const gallery_id = req.params.gallery_id;
  const response = await pool.query("SELECT * FROM galleries WHERE id = $1", [
    gallery_id,
  ]);
  if (response.rows.length == 0)
    res.status(404).send("This gallery doesn't exists");
  else next();
};

const galleryBelongsToUser = async (req, res, next) => {
  const gallery_id = req.params.gallery_id;
  const user_id = await getIdFromToken(req);
  const response = await pool.query(
    "SELECT * FROM galleries WHERE id = $1 AND user_id = $2",
    [gallery_id, user_id]
  );
  if (response.rows.length == 0)
    res.status(409).send("You can't modify this gallery");
  else next();
};

module.exports = {
  getGalleries,
  getGalleryById,
  getGalleriesByUsername,
  getGalleryImages,
  addImageToGallery,
  removeImageFromGallery,
  createGallery,
  deleteGallery,
  galleryExists,
  galleryBelongsToUser,
};
