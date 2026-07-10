import { Router } from 'express';
import Leaderboard from '../models/leaderboard.js';
const router = Router();
router.get('/', async (_request, response, next) => {
    try {
        const leaderboardEntries = await Leaderboard.find().sort({ generatedAt: -1 }).lean();
        response.json(leaderboardEntries);
    }
    catch (error) {
        next(error);
    }
});
export default router;
