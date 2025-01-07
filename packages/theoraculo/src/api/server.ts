import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import testRoutes from './routes/test';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/test', testRoutes);

app.listen(port, () => {
  console.log(`TheOraculo server running on port ${port}`);
});