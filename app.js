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

// Servir les fichiers statiques du dossier dist
app.use(express.static(path.join(__dirnameResolved, "dist")));

// Routes spécifiques de l'API si nécessaire
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 🌐 Catch-all route pour toutes les autres routes (SPA React)
// C'est nécessaire pour que React Router fonctionne avec les routes comme /admin/login
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnameResolved, "dist", "index.html"));
});

// 🚀 Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
