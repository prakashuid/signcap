// server.mjs
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = "https://signcap.vercel.app";

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize and open the SQLite database
async function initializeDatabase() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Create a table for storing signatures if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS signatures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT NOT NULL,
      capturedAt TEXT NOT NULL,
      capImage TEXT NOT NULL
    );
  `);

  return db;
}

let db;
initializeDatabase().then(database => {
  db = database;
}).catch(error => {
  console.error('Error opening database:', error);
});

app.post('/api/save-image', async (req, res) => {
  try {
    const { image, capturedAt, capImage } = req.body;
    if (!image || !capturedAt || !capImage) {
      return res.status(400).send('Missing required fields');
    }

    await db.run(`
      INSERT INTO signatures (image, capturedAt, capImage)
      VALUES (?, ?, ?)
    `, [image, capturedAt, capImage]);

    res.status(200).send('Image saved successfully');
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/get-images', async (req, res) => {
  try {
    const signatures = await db.all('SELECT * FROM signatures');
    res.json(signatures);
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at https://signcap.vercel.app/`);
});
