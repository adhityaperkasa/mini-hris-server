const db = require("../config/db");

const VALID_TYPES = ["company", "directorate", "division", "department", "position"];

// Validasi saat CREATE (POST)
const validateCreateOrg = (req, res, next) => {
  const { name, type, parentId } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Nama node tidak boleh kosong" });
  }

  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      message: `Type harus salah satu dari: ${VALID_TYPES.join(", ")}`
    });
  }

  // Kalau parentId diisi, cek apakah parent-nya benar ada di database
  if (parentId) {
    db.query(
      "SELECT id FROM org WHERE id = ?",
      [parentId],
      (err, results) => {
        if (err) return res.status(500).json({ message: err.message });

        if (results.length === 0) {
          return res.status(400).json({
            message: `Parent dengan id ${parentId} tidak ditemukan`
          });
        }

        next(); // lolos validasi, lanjut ke controller
      }
    );
  } else {
    next(); // tidak ada parentId (root node), langsung lanjut
  }
};

// Validasi saat UPDATE (PUT)
const validateUpdateOrg = (req, res, next) => {
  const { name, type } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Nama node tidak boleh kosong" });
  }

  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      message: `Type harus salah satu dari: ${VALID_TYPES.join(", ")}`
    });
  }

  next();
};

module.exports = {
  validateCreateOrg,
  validateUpdateOrg
};