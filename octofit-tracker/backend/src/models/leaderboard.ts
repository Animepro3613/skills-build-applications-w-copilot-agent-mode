import { Schema, model } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    rank: { type: Number, required: true },
    label: { type: String, required: true, trim: true },
    points: { type: Number, required: true },
    entityType: { type: String, enum: ['user', 'team'], required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null }
  },
  { _id: false }
);

const leaderboardSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    generatedAt: { type: Date, required: true },
    entries: { type: [leaderboardEntrySchema], default: [] }
  },
  { timestamps: true }
);

const Leaderboard = model('Leaderboard', leaderboardSchema);

export default Leaderboard;