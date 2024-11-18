import Database from 'better-sqlite3';
import * as path from "path";

import { fileURLToPath } from "url";

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the SQLite database file
const dbPath = path.resolve(__dirname, "database.db");

function initializeDatabase() {
  try {
    // Open the database
    const db = new Database(dbPath, { verbose: console.log });

    console.log("Connected to the SQLite database.");

    // Initialize the recommended media table
    db.exec(`CREATE TABLE IF NOT EXISTS recommended (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      dateAdded TEXT NOT NULL,
      mediaType TEXT NOT NULL,
      mediaId TEXT NOT NULL
    )`);

    // Initialize the saved media table
    db.exec(`CREATE TABLE IF NOT EXISTS saved (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        mediaType TEXT,
        mediaId TEXT
      )`);

    return db;
  } catch (err) {
    console.error("Could not connect to database", err);
    throw err;
  }
}

// Export the initializeDatabase function
export default initializeDatabase;
