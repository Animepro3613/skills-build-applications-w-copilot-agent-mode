import { Router } from 'express';
import Team from '../models/team.js';

const router = Router();

router.get('/', async (_request, response, next) => {
  try {
    const teams = await Team.find().populate('members', 'firstName lastName email').lean();

    response.json(teams);
  } catch (error) {
    next(error);
  }
});

export default router;