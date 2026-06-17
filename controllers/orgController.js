const db = require("../config/db");

// GET semua org
const getOrg = (req, res) => {
  db.query("SELECT * FROM org", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
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
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({
        id: results.insertId,
        name, type, parentId: parentId || null
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
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
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
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
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