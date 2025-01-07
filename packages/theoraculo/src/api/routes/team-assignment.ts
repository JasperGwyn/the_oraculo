import { Router } from 'express';
import { z } from 'zod';
import { assignTeam } from '../../services/assignment';
import { getRoundStats } from '../../services/blockchain';

const router = Router();

// Schema for request validation
const AssignmentRequestSchema = z.object({
  roundId: z.number(),
  userAddress: z.string()
});

router.post('/assign', async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    // Validate request
    const result = AssignmentRequestSchema.safeParse(req.body);

    if (!result.success) {
      console.error('Validation error:', result.error);
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: result.error.errors
      });
    }

    const { roundId, userAddress } = result.data;

    // Get current round stats
    console.log('Fetching stats for round:', roundId);
    const stats = await getRoundStats(roundId);
    console.log('Round stats:', stats);

    // Calculate team assignment
    const assignedTeam = assignTeam(stats.teamYes, stats.teamNo);
    console.log('Assigned team:', assignedTeam);

    res.json({
      success: true,
      team: assignedTeam,
      roundId,
      userAddress
    });
  } catch (error) {
    console.error('Error in team assignment:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export const teamAssignmentRouter = router;