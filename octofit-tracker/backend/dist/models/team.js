import { Schema, model } from 'mongoose';
const teamSchema = new Schema({
    name: { type: String, required: true, trim: true },
    coach: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    weeklyGoal: { type: Number, default: 0 },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
const Team = model('Team', teamSchema);
export default Team;
