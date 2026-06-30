const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/sample_app",
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

app.get("/api/entries", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM entries ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/entries", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO entries (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/entries/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM entries WHERE id = $1", [req.params.id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

init()
  .then(() => {
    app.listen(port, () => {
      console.log(`Sample app listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
    process.exit(1);
  });
