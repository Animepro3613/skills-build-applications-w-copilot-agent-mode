import { Schema, model } from 'mongoose';
const activitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    occurredAt: { type: Date, required: true },
    notes: { type: String, default: '' }
}, { timestamps: true });
const Activity = model('Activity', activitySchema);
export default Activity;
