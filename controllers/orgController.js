const db = require("../config/db");

// GET semua org
const getOrg = (req, res) => {
  db.query("SELECT * FROM org", (err, results) => {
    if (err) {
      console.error("Error getOrg:", err.message);
      return res.status(500).json({ message: "Gagal mengambil data organisasi" });
    }
    res.json(results);
  });
};

// POST tambah org node
const createOrgNode = (req, res) => {
  const { name, type, parentId } = req.body;

  db.query(
    "INSERT INTO org (name, type, parentId) VALUES (?, ?, ?)",
    [name, type, parentId || null],
    (err, results) => {
      if (err) {
        console.error("Error createOrgNode:", err.message);
        return res.status(500).json({ message: "Gagal menambahkan node" });
      }
      res.status(201).json({
        id: results.insertId,
        name,
        type,
        parentId: parentId || null
      });
    }
  );
};

// PUT update org node
const updateOrgNode = (req, res) => {
  const id = req.params.id;
  const { name, type, parentId } = req.body;

  db.query(
    "UPDATE org SET name=?, type=?, parentId=? WHERE id=?",
    [name, type, parentId || null, id],
    (err, results) => {
      if (err) {
        console.error("Error updateOrgNode:", err.message);
        return res.status(500).json({ message: "Gagal mengupdate node" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Node tidak ditemukan" });
      }

      res.json({ id: Number(id), name, type, parentId: parentId || null });
    }
  );
};

// DELETE hapus org node
const deleteOrgNode = (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM org WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleteOrgNode:", err.message);
        return res.status(500).json({ message: "Gagal menghapus node" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Node tidak ditemukan" });
      }

      res.json({ message: "Node berhasil dihapus" });
    }
  );
};

module.exports = {
  getOrg,
  createOrgNode,
  updateOrgNode,
  deleteOrgNode
};