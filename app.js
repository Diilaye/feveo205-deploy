const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT =  3050;

// Middleware
app.use(cors());
app.use(express.json());

// 📂 Dossier de build frontend
const __dirnameResolved = path.resolve();

app.use(express.static(path.join(__dirnameResolved, "dist")));

// 🌐 Catch-all route pour une SPA
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirnameResolved, "dist", "index.html"));
});

// 🚀 Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
