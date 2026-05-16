import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const envResult = dotenv.config();
if (envResult.error) {
  console.error('Failed to load .env file:', envResult.error);
}

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1', taskRoutes);

// Connect DB only if a MONGO_URI is provided
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn('MONGO_URI not set — skipping DB connection');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
