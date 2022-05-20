require("dotenv").config();
const pool = require("./pgpool");

const getTags = async (req, res) => {
  const response = await pool.query("SELECT id, name FROM tags");
  res.json(response.rows);
};

const getTagById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT *  FROM tags WHERE id = $1", [id]);
  if (response.rows.length == 0) res.status(404).send("Tag not found");
  res.json(response.rows[0]);
};

const getTagByName = async (req, res) => {
  const name = req.params.name;
  const response = await pool.query("SELECT *  FROM tags WHERE name = $1", [
    name,
  ]);
  if (response.rows.length == 0) res.status(404).send("Tag not found");
  res.json(response.rows[0]);
};

//--MIDDLEWARE--
const tagExists = async (req, res, next) => {
  const tag_id = req.body.tag_id;
  const response = await pool.query("SELECT * FROM tags WHERE id = $1", [
    tag_id,
  ]);
  if (response.rows.length == 0)
    res.status(404).send("This tag doesn't exists");
  else next();
};

module.exports = {
  getTags,
  getTagById,
  getTagByName,
  tagExists,
};
