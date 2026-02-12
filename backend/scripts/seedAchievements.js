import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Achievement from '../models/Achievement.js';

dotenv.config();

const seedAchievements = async () => {
    try {
        await connectDB();

        // Clear existing achievements
        await Achievement.deleteMany({});

        const achievements = [
            // Milestone Achievements
            {
                code: 'first_steps',
                name: 'First Steps',
                description: 'Complete your first phrase',
                icon: '🎯',
                type: 'milestone',
                requirement: 1,
                xpReward: 50
            },
            {
                code: 'quick_learner',
                name: 'Quick Learner',
                description: 'Complete 10 phrases',
                icon: '⚡',
                type: 'milestone',
                requirement: 10,
                xpReward: 100
            },
            {
                code: 'dedicated',
                name: 'Dedicated Student',
                description: 'Complete 50 phrases',
                icon: '📚',
                type: 'milestone',
                requirement: 50,
                xpReward: 250
            },
            {
                code: 'century_club',
                name: 'Century Club',
                description: 'Complete 100 phrases',
                icon: '💯',
                type: 'milestone',
                requirement: 100,
                xpReward: 500
            },
            {
                code: 'master',
                name: 'Language Master',
                description: 'Complete 250 phrases',
                icon: '👑',
                type: 'milestone',
                requirement: 250,
                xpReward: 1000
            },

            // Streak Achievements
            {
                code: 'committed',
                name: 'Committed Learner',
                description: 'Maintain a 3-day streak',
                icon: '🔥',
                type: 'streak',
                requirement: 3,
                xpReward: 100
            },
            {
                code: 'weekly_warrior',
                name: 'Weekly Warrior',
                description: 'Maintain a 7-day streak',
                icon: '⭐',
                type: 'streak',
                requirement: 7,
                xpReward: 250
            },
            {
                code: 'unstoppable',
                name: 'Unstoppable',
                description: 'Maintain a 30-day streak',
                icon: '🚀',
                type: 'streak',
                requirement: 30,
                xpReward: 1500
            },

            // Accuracy Achievements
            {
                code: 'perfectionist',
                name: 'Perfectionist',
                description: 'Achieve 100% accuracy on a phrase',
                icon: '✨',
                type: 'accuracy',
                requirement: 100,
                xpReward: 75
            },
            {
                code: 'sharpshooter',
                name: 'Sharpshooter',
                description: 'Maintain 90% average accuracy',
                icon: '🎯',
                type: 'accuracy',
                requirement: 90,
                xpReward: 200
            },

            // Special Achievements
            {
                code: 'early_bird',
                name: 'Early Bird',
                description: 'Complete a lesson before 9 AM',
                icon: '🌅',
                type: 'special',
                requirement: 1,
                xpReward: 50
            },
            {
                code: 'night_owl',
                name: 'Night Owl',
                description: 'Complete a lesson after 10 PM',
                icon: '🦉',
                type: 'special',
                requirement: 1,
                xpReward: 50
            }
        ];

        await Achievement.insertMany(achievements);

        console.log('✅ Achievements seeded successfully!');
        console.log(`📊 Created ${achievements.length} achievements`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding achievements:', error);
        process.exit(1);
    }
};

seedAchievements();
