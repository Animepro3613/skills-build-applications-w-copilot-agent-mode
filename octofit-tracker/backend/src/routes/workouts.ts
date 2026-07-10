import { Router } from 'express';
import Workout from '../models/workout.js';

const router = Router();

router.get('/', async (_request, response, next) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 }).lean();

    response.json(workouts);
  } catch (error) {
    next(error);
  }
});

export default router;