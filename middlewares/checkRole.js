// Middleware ini dipakai SETELAH verifyToken,
// karena butuh req.user yang diisi oleh verifyToken

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: "Role tidak ditemukan, silakan login ulang" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Akses ditolak. Role '${userRole}' tidak memiliki izin untuk aksi ini`
      });
    }

    next();
  };
};

module.exports = checkRole;