import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

dotenv.config();

// A missing JWT secret would otherwise silently fall back to a guessable
// value, letting anyone forge a valid session token — refuse to boot instead.
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Refusing to start.');
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Platform', 'X-App-Version', 'X-Device-ID'],
  })
);
app.use(express.json());

await connectDB();

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(authRoutes);
app.use(propertyRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default app;
