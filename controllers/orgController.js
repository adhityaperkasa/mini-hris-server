const db = require("../config/db");

// GET semua org
const getOrg = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM org");
    res.json(results);
  } catch (err) {
    console.error("Error getOrg:", err.message);
    res.status(500).json({ message: "Gagal mengambil data organisasi" });
  }
};

// POST tambah org node
const createOrgNode = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error createOrgNode:", err.message);
    res.status(500).json({ message: "Gagal menambahkan node" });
  }
};

// PUT update org node
const updateOrgNode = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error updateOrgNode:", err.message);
    res.status(500).json({ message: "Gagal mengupdate node" });
  }
};

// DELETE hapus org node
const deleteOrgNode = async (req, res) => {
  try {
    const id = req.params.id;

    const [results] = await db.query(
      "DELETE FROM org WHERE id = ?",
      [id]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Node tidak ditemukan" });
    }

    res.json({ message: "Node berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteOrgNode:", err.message);
    res.status(500).json({ message: "Gagal menghapus node" });
  }
};

module.exports = {
  getOrg,
  createOrgNode,
  updateOrgNode,
  deleteOrgNode
};