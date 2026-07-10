import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, enum: ['athlete', 'coach'], default: 'athlete' },
    avatarUrl: { type: String, default: '' },
    stepGoal: { type: Number, default: 10000 },
    streakDays: { type: Number, default: 0 },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null }
}, { timestamps: true });
const User = model('User', userSchema);
export default User;
