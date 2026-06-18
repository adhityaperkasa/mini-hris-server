const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// GET semua org
const getOrg = asyncHandler(async (req, res) => {
  const [results] = await db.query("SELECT * FROM org");
  res.json(results);
});

// POST tambah org node
const createOrgNode = asyncHandler(async (req, res) => {
  const { name, type, parentId } = req.body;

  const [results] = await db.query(
    "INSERT INTO org (name, type, parentId) VALUES (?, ?, ?)",
    [name, type, parentId || null]
  );

  res.status(201).json({
    id: results.insertId,
    name,
    type,
    parentId: parentId || null
  });
});

// PUT update org node
const updateOrgNode = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, type, parentId } = req.body;

  const [results] = await db.query(
    "UPDATE org SET name=?, type=?, parentId=? WHERE id=?",
    [name, type, parentId || null, id]
  );

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: "Node tidak ditemukan" });
  }

  res.json({ id: Number(id), name, type, parentId: parentId || null });
});

// DELETE hapus org node
const deleteOrgNode = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const [results] = await db.query(
    "DELETE FROM org WHERE id = ?",
    [id]
  );

  if (results.affectedRows === 0) {
    return res.status(404).json({ message: "Node tidak ditemukan" });
  }

  res.json({ message: "Node berhasil dihapus" });
});

module.exports = {
  getOrg,
  createOrgNode,
  updateOrgNode,
  deleteOrgNode
};