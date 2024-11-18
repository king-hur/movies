import express from 'express';
import cors from 'cors';
import initializeDatabase from "./database.js";
import * as path from 'path';
import { fileURLToPath } from 'url';


// Initialize database
const db = initializeDatabase()

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

// Handle requests for the root path
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
});

app.post("/add-rec", (req, res) => {
  const { username, mediaType, mediaId } = req.body;
  const dateAdded = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO recommended (username, dateAdded, mediaType, mediaId)
     VALUES (?, ?, ?, ?)`
  );
  try {
    stmt.run(
      username.toLowerCase(),
      dateAdded,
      mediaType,
      mediaId
    );
    res.status(200).send('Recommendation added successfully');
  } catch (err) {
    res.status(500).send(`Error adding recommendation:', ${err.message}`);
  }
});

app.post("/add-saved", (req, res) => {
  const { username, mediaType, mediaId } = req.body;
  const stmt = db.prepare(
    `INSERT INTO saved (username, mediaType, mediaId)
     VALUES (?, ?, ?)`
  );
  try {
    stmt.run(
      username.toLowerCase(),
      mediaType,
      mediaId
    );
    res.status(200).send('Media added to saved list successfully');
  } catch (err) {
    res.status(500).send(`Error adding media to saved list:', ${err.message}`);
  }
});

// Get all recommendations from recomended table
app.get("/recommendations", (_, res) => {
  try {
    // Fetch all rows from the "recommended" table
    const rows = db.prepare("SELECT * FROM recommended").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: `Error fetching recommendations: ${err.message}` });
  }
});

// Get all recommendations from saved table
app.get("/saved", (_, res) => {
  try {
    // Fetch all rows from the "recommended" table
    const rows = db.prepare("SELECT * FROM saved").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: `Error fetching recommendations: ${err.message}` });
  }
});

app.listen(PORT, () => console.log('Listening on port 3000'));
