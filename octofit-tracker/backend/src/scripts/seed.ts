import mongoose from 'mongoose';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const users = await User.insertMany([
      {
        firstName: 'Ava',
        lastName: 'Johnson',
        email: 'ava.johnson@octofit.dev',
        role: 'coach',
        stepGoal: 12000,
        streakDays: 18,
        avatarUrl: 'https://images.example.com/ava-johnson.png'
      },
      {
        firstName: 'Liam',
        lastName: 'Chen',
        email: 'liam.chen@octofit.dev',
        role: 'athlete',
        stepGoal: 10000,
        streakDays: 9,
        avatarUrl: 'https://images.example.com/liam-chen.png'
      },
      {
        firstName: 'Sofia',
        lastName: 'Patel',
        email: 'sofia.patel@octofit.dev',
        role: 'athlete',
        stepGoal: 11000,
        streakDays: 12,
        avatarUrl: 'https://images.example.com/sofia-patel.png'
      },
      {
        firstName: 'Noah',
        lastName: 'Garcia',
        email: 'noah.garcia@octofit.dev',
        role: 'athlete',
        stepGoal: 9500,
        streakDays: 6,
        avatarUrl: 'https://images.example.com/noah-garcia.png'
      }
    ]);

    const team = await Team.create({
      name: 'Summit Sprinters',
      coach: 'Ava Johnson',
      description: 'A fast-moving team focused on daily consistency and healthy competition.',
      weeklyGoal: 6500,
      members: users.map((user) => user._id)
    });

    await User.updateMany(
      { _id: { $in: users.map((user) => user._id) } },
      { $set: { team: team._id } }
    );

    await Activity.insertMany([
      {
        user: users[1]._id,
        team: team._id,
        type: 'Run',
        durationMinutes: 42,
        caloriesBurned: 420,
        occurredAt: new Date('2026-07-08T07:15:00.000Z'),
        notes: 'Morning tempo run around the neighborhood loop.'
      },
      {
        user: users[2]._id,
        team: team._id,
        type: 'Cycling',
        durationMinutes: 55,
        caloriesBurned: 510,
        occurredAt: new Date('2026-07-08T18:00:00.000Z'),
        notes: 'Evening endurance ride with steady pacing.'
      },
      {
        user: users[3]._id,
        team: team._id,
        type: 'Strength Training',
        durationMinutes: 35,
        caloriesBurned: 280,
        occurredAt: new Date('2026-07-09T12:30:00.000Z'),
        notes: 'Upper-body focused session with dumbbells and bands.'
      }
    ]);

    await Leaderboard.create({
      title: 'Weekly Leaderboard',
      generatedAt: new Date('2026-07-10T09:00:00.000Z'),
      entries: [
        {
          rank: 1,
          label: `${users[1].firstName} ${users[1].lastName}`,
          points: 980,
          entityType: 'user',
          user: users[1]._id
        },
        {
          rank: 2,
          label: `${users[2].firstName} ${users[2].lastName}`,
          points: 910,
          entityType: 'user',
          user: users[2]._id
        },
        {
          rank: 3,
          label: team.name,
          points: 1880,
          entityType: 'team',
          team: team._id
        }
      ]
    });

    await Workout.insertMany([
      {
        title: 'Cardio Burst Circuit',
        category: 'Cardio',
        durationMinutes: 30,
        difficulty: 'Intermediate',
        equipment: ['Jump rope', 'Mat'],
        focus: 'Full-body conditioning',
        instructions: 'Alternate high-knee intervals, mountain climbers, and jump rope rounds.'
      },
      {
        title: 'Mobility Reset Flow',
        category: 'Recovery',
        durationMinutes: 20,
        difficulty: 'Beginner',
        equipment: ['Yoga mat'],
        focus: 'Flexibility and recovery',
        instructions: 'Blend hip openers, thoracic rotations, and deep breathing drills.'
      },
      {
        title: 'Strength Ladder',
        category: 'Strength',
        durationMinutes: 45,
        difficulty: 'Advanced',
        equipment: ['Dumbbells', 'Bench'],
        focus: 'Upper and lower body strength',
        instructions: 'Progress through squat, press, and row ladders with controlled rest.'
      }
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
