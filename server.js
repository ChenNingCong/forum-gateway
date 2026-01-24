import path from 'path';
import { fileURLToPath } from 'url';
import gateway from 'express-gateway';
import express from 'express';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

gateway()
  .load(path.join(__dirname, 'config'))
  .run(app);