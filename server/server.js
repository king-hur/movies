import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

app.listen(PORT, () => console.log('Listening on port 3000'));
