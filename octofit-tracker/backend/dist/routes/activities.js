import { Router } from 'express';
import Activity from '../models/activity.js';
const router = Router();
router.get('/', async (_request, response, next) => {
    try {
        const activities = await Activity.find()
            .populate('user', 'firstName lastName email')
            .populate('team', 'name')
            .sort({ occurredAt: -1 })
            .lean();
        response.json(activities);
    }
    catch (error) {
        next(error);
    }
});
export default router;
