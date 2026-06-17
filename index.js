const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const orgRoutes = require("./routes/orgRoutes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/employees", employeeRoutes);
app.use("/org", orgRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});