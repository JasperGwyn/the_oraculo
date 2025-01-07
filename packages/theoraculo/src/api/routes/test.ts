import express from 'express';
import { getRoundStats } from '../../services/blockchain';

const router = express.Router();

router.get('/round/:roundId', async (req, res) => {
  try {
    const roundId = parseInt(req.params.roundId);
    const stats = await getRoundStats(roundId);
    res.json(stats);
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch round stats' });
  }
});

export default router;