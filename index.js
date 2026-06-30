require("dotenv").config();

const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const orgRoutes = require("./routes/orgRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/org", orgRoutes);
app.use("/dashboard", dashboardRoutes);

// PENTING: error handler harus didaftarkan PALING TERAKHIR,
// setelah semua routes lainnya
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});