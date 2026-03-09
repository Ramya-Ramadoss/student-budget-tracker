// server/index.js  –  Student Budget Tracker API
// npm install express cors uuid
// node server/index.js

const express = require("express");
const cors    = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// ── In-memory store (swap with a DB: sqlite, postgres, mongo, etc.) ──────────
let entries = [];

// GET  /api/entries       → list all
app.get("/api/entries", (req, res) => {
  res.json(entries);
});

// POST /api/entries       → create one
app.post("/api/entries", (req, res) => {
  const { label, amount, category, type, date } = req.body;
  if (!label || !amount || !category || !type || !date)
    return res.status(400).json({ error: "All fields required" });

  const entry = { id: uuid(), label, amount: parseFloat(amount), category, type, date };
  entries.unshift(entry);
  res.status(201).json(entry);
});

// DELETE /api/entries/:id → remove one
app.delete("/api/entries/:id", (req, res) => {
  entries = entries.filter(e => e.id !== req.params.id);
  res.json({ ok: true });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Budget API running on :${PORT}`));
