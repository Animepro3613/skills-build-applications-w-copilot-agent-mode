import { Schema, model } from 'mongoose';
const workoutSchema = new Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    equipment: { type: [String], default: [] },
    focus: { type: String, required: true },
    instructions: { type: String, required: true }
}, { timestamps: true });
const Workout = model('Workout', workoutSchema);
export default Workout;
