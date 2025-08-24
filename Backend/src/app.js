import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import formsRouter from './routes/forms.js';
import responsesRouter from './routes/responses.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/forms', formsRouter);
app.use('/api/responses', responsesRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
