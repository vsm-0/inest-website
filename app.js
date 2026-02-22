const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const laundryRoutes = require("./routes/laundryRoutes");
const bakerRoutes = require("./routes/bakerRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const whistleNestRoutes = require("./routes/whistleNestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static HTML
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route for browser
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// APIs
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/bakers", bakerRoutes);
app.use("/api/medicals", medicalRoutes);
app.use("/api/whistlenest", whistleNestRoutes);

module.exports = app;


