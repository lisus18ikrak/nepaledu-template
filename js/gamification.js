// Gamification System
class GamificationSystem {
    constructor() {
        this.userProfile = null;
        this.achievements = [];
        this.leaderboard = [];
        this.badges = [];
        this.rewards = [];
        this.dailyChallenges = [];
        this.streaks = {};
        this.classLeaderboards = {};
        this.schoolLeaderboards = {};
        this.init();
    }

    init() {
        this.loadUserProfile();
        this.loadAchievements();
        this.loadBadges();
        this.loadRewards();
        this.setupEventListeners();
        this.startDailyChallenges();
        this.updateLeaderboard();
        this.initializeLeaderboards();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'gamificationBtn') {
                this.showGamificationDashboard();
            }
            if (e.target.classList.contains('achievement-item')) {
                const achievementId = e.target.dataset.achievementId;
                this.showAchievementDetails(achievementId);
            }
            if (e.target.classList.contains('badge-item')) {
                const badgeId = e.target.dataset.badgeId;
                this.showBadgeDetails(badgeId);
            }
            if (e.target.classList.contains('claim-reward-btn')) {
                const rewardId = e.target.dataset.rewardId;
                this.claimReward(rewardId);
            }
            if (e.target.classList.contains('challenge-item')) {
                const challengeId = e.target.dataset.challengeId;
                this.startChallenge(challengeId);
            }
            if (e.target.classList.contains('leaderboard-tab')) {
                const leaderboardType = e.target.dataset.type;
                this.showLeaderboard(leaderboardType);
            }
        });
    }

    loadUserProfile() {
        const saved = localStorage.getItem('userGamificationProfile');
        if (saved) {
            this.userProfile = JSON.parse(saved);
        } else {
            this.userProfile = {
                id: Date.now(),
                username: 'Student',
                level: 1,
                xp: 0,
                totalXP: 0,
                coins: 100,
                gems: 10,
                achievements: [],
                badges: [],
                rewards: [],
                streak: {
                    current: 0,
                    longest: 0,
                    lastLogin: null
                },
                stats: {
                    quizzesCompleted: 0,
                    questionsAnswered: 0,
                    chaptersRead: 0,
                    videosWatched: 0,
                    perfectScores: 0,
                    studyTime: 0,
                    subjectsMastered: 0,
                    weeklyGoals: 0,
                    monthlyGoals: 0
                },
                class: 'Class 9A',
                school: 'Nepal Secondary School',
                createdAt: new Date().toISOString()
            };
            this.saveUserProfile();
        }
    }

    saveUserProfile() {
        localStorage.setItem('userGamificationProfile', JSON.stringify(this.userProfile));
    }

    loadAchievements() {
        this.achievements = [
            {
                id: 'first_quiz',
                name: 'First Steps',
                description: 'Complete your first quiz',
                icon: 'fas fa-star',
                xpReward: 50,
                coinReward: 10,
                condition: { type: 'quizzes_completed', value: 1 },
                rarity: 'common'
            },
            {
                id: 'quiz_master',
                name: 'Quiz Master',
                description: 'Complete 50 quizzes',
                icon: 'fas fa-crown',
                xpReward: 500,
                coinReward: 100,
                condition: { type: 'quizzes_completed', value: 50 },
                rarity: 'rare'
            },
            {
                id: 'perfect_score',
                name: 'Perfect Score',
                description: 'Get 100% on a quiz',
                icon: 'fas fa-trophy',
                xpReward: 200,
                coinReward: 50,
                condition: { type: 'perfect_scores', value: 1 },
                rarity: 'epic'
            },
            {
                id: 'streak_7',
                name: 'Week Warrior',
                description: 'Maintain a 7-day study streak',
                icon: 'fas fa-fire',
                xpReward: 300,
                coinReward: 75,
                condition: { type: 'streak', value: 7 },
                rarity: 'rare'
            },
            {
                id: 'streak_30',
                name: 'Monthly Master',
                description: 'Maintain a 30-day study streak',
                icon: 'fas fa-calendar-check',
                xpReward: 1000,
                coinReward: 200,
                condition: { type: 'streak', value: 30 },
                rarity: 'legendary'
            },
            {
                id: 'subject_expert',
                name: 'Subject Expert',
                description: 'Complete all chapters in a subject',
                icon: 'fas fa-graduation-cap',
                xpReward: 400,
                coinReward: 80,
                condition: { type: 'subject_completed', value: 1 },
                rarity: 'epic'
            },
            {
                id: 'speed_learner',
                name: 'Speed Learner',
                description: 'Complete 5 quizzes in one day',
                icon: 'fas fa-bolt',
                xpReward: 250,
                coinReward: 60,
                condition: { type: 'daily_quizzes', value: 5 },
                rarity: 'rare'
            },
            {
                id: 'knowledge_seeker',
                name: 'Knowledge Seeker',
                description: 'Watch 20 educational videos',
                icon: 'fas fa-play-circle',
                xpReward: 300,
                coinReward: 70,
                condition: { type: 'videos_watched', value: 20 },
                rarity: 'rare'
            },
            {
                id: 'class_champion',
                name: 'Class Champion',
                description: 'Top performer in your class for a week',
                icon: 'fas fa-medal',
                xpReward: 600,
                coinReward: 120,
                condition: { type: 'class_rank', value: 1 },
                rarity: 'epic'
            },
            {
                id: 'school_legend',
                name: 'School Legend',
                description: 'Top performer in your school for a month',
                icon: 'fas fa-crown',
                xpReward: 1500,
                coinReward: 300,
                condition: { type: 'school_rank', value: 1 },
                rarity: 'legendary'
            },
            {
                id: 'goal_crusher',
                name: 'Goal Crusher',
                description: 'Achieve 10 weekly goals',
                icon: 'fas fa-target',
                xpReward: 400,
                coinReward: 80,
                condition: { type: 'weekly_goals', value: 10 },
                rarity: 'rare'
            },
            {
                id: 'master_learner',
                name: 'Master Learner',
                description: 'Master all subjects',
                icon: 'fas fa-brain',
                xpReward: 2000,
                coinReward: 500,
                condition: { type: 'subjects_mastered', value: 4 },
                rarity: 'legendary'
            }
        ];
    }

    loadBadges() {
        this.badges = [
            // Level-based badges
            {
                id: 'newbie',
                name: 'Newbie',
                description: 'Just getting started on your learning journey',
                icon: 'fas fa-seedling',
                color: 'text-green-500',
                bgColor: 'bg-green-100 dark:bg-green-900/20',
                requirement: { type: 'level', value: 1 },
                rarity: 'common'
            },
            {
                id: 'learner',
                name: 'Learner',
                description: 'Making steady progress in your studies',
                icon: 'fas fa-leaf',
                color: 'text-blue-500',
                bgColor: 'bg-blue-100 dark:bg-blue-900/20',
                requirement: { type: 'level', value: 5 },
                rarity: 'common'
            },
            {
                id: 'scholar',
                name: 'Scholar',
                description: 'A dedicated student with strong academic focus',
                icon: 'fas fa-book',
                color: 'text-purple-500',
                bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                requirement: { type: 'level', value: 10 },
                rarity: 'rare'
            },
            {
                id: 'expert',
                name: 'Expert',
                description: 'Master of knowledge and learning',
                icon: 'fas fa-gem',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
                requirement: { type: 'level', value: 20 },
                rarity: 'epic'
            },
            {
                id: 'legend',
                name: 'Legend',
                description: 'A living legend in the world of education',
                icon: 'fas fa-crown',
                color: 'text-red-500',
                bgColor: 'bg-red-100 dark:bg-red-900/20',
                requirement: { type: 'level', value: 50 },
                rarity: 'legendary'
            },
            // Achievement-based badges
            {
                id: 'quiz_champion',
                name: 'Quiz Champion',
                description: 'Dominates every quiz with perfect scores',
                icon: 'fas fa-trophy',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
                requirement: { type: 'perfect_scores', value: 10 },
                rarity: 'epic'
            },
            {
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Maintains incredible study consistency',
                icon: 'fas fa-fire',
                color: 'text-orange-500',
                bgColor: 'bg-orange-100 dark:bg-orange-900/20',
                requirement: { type: 'streak', value: 50 },
                rarity: 'legendary'
            },
            {
                id: 'subject_master',
                name: 'Subject Master',
                description: 'Has mastered multiple subjects completely',
                icon: 'fas fa-graduation-cap',
                color: 'text-indigo-500',
                bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
                requirement: { type: 'subjects_mastered', value: 2 },
                rarity: 'epic'
            },
            {
                id: 'goal_achiever',
                name: 'Goal Achiever',
                description: 'Consistently meets and exceeds learning goals',
                icon: 'fas fa-target',
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
                requirement: { type: 'weekly_goals', value: 5 },
                rarity: 'rare'
            },
            {
                id: 'class_leader',
                name: 'Class Leader',
                description: 'Leads the class in academic performance',
                icon: 'fas fa-medal',
                color: 'text-cyan-500',
                bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
                requirement: { type: 'class_rank', value: 1 },
                rarity: 'epic'
            },
            {
                id: 'school_champion',
                name: 'School Champion',
                description: 'Top performer across the entire school',
                icon: 'fas fa-star',
                color: 'text-pink-500',
                bgColor: 'bg-pink-100 dark:bg-pink-900/20',
                requirement: { type: 'school_rank', value: 1 },
                rarity: 'legendary'
            },
            {
                id: 'knowledge_hunter',
                name: 'Knowledge Hunter',
                description: 'Actively seeks knowledge from all sources',
                icon: 'fas fa-search',
                color: 'text-teal-500',
                bgColor: 'bg-teal-100 dark:bg-teal-900/20',
                requirement: { type: 'videos_watched', value: 50 },
                rarity: 'rare'
            }
        ];
    }

    loadRewards() {
        this.rewards = [
            // XP and Learning Rewards
            {
                id: 'xp_boost',
                name: 'XP Boost',
                description: 'Double XP for 1 hour',
                icon: 'fas fa-rocket',
                type: 'temporary_boost',
                cost: 50,
                effect: { type: 'xp_multiplier', value: 2, duration: 3600000 },
                rarity: 'common'
            },
            {
                id: 'xp_mega_boost',
                name: 'Mega XP Boost',
                description: 'Triple XP for 2 hours',
                icon: 'fas fa-rocket',
                type: 'temporary_boost',
                cost: 150,
                effect: { type: 'xp_multiplier', value: 3, duration: 7200000 },
                rarity: 'rare'
            },
            {
                id: 'hint_pack',
                name: 'Hint Pack',
                description: 'Get 5 free hints for quizzes',
                icon: 'fas fa-lightbulb',
                type: 'consumable',
                cost: 30,
                effect: { type: 'hints', value: 5 },
                rarity: 'common'
            },
            {
                id: 'hint_mega_pack',
                name: 'Mega Hint Pack',
                description: 'Get 15 free hints for quizzes',
                icon: 'fas fa-lightbulb',
                type: 'consumable',
                cost: 80,
                effect: { type: 'hints', value: 15 },
                rarity: 'rare'
            },
            // Streak Protection
            {
                id: 'streak_protector',
                name: 'Streak Protector',
                description: 'Protect your streak for 1 day',
                icon: 'fas fa-shield-alt',
                type: 'consumable',
                cost: 100,
                effect: { type: 'streak_protection', value: 1 },
                rarity: 'rare'
            },
            {
                id: 'streak_guardian',
                name: 'Streak Guardian',
                description: 'Protect your streak for 3 days',
                icon: 'fas fa-shield-alt',
                type: 'consumable',
                cost: 250,
                effect: { type: 'streak_protection', value: 3 },
                rarity: 'epic'
            },
            // Cosmetic Rewards
            {
                id: 'premium_theme',
                name: 'Premium Theme',
                description: 'Unlock a special theme',
                icon: 'fas fa-palette',
                type: 'cosmetic',
                cost: 200,
                effect: { type: 'theme', value: 'premium' },
                rarity: 'rare'
            },
            {
                id: 'golden_theme',
                name: 'Golden Theme',
                description: 'Unlock an exclusive golden theme',
                icon: 'fas fa-palette',
                type: 'cosmetic',
                cost: 500,
                effect: { type: 'theme', value: 'golden' },
                rarity: 'epic'
            },
            {
                id: 'rainbow_theme',
                name: 'Rainbow Theme',
                description: 'Unlock a vibrant rainbow theme',
                icon: 'fas fa-palette',
                type: 'cosmetic',
                cost: 1000,
                effect: { type: 'theme', value: 'rainbow' },
                rarity: 'legendary'
            },
            // Special Abilities
            {
                id: 'time_freeze',
                name: 'Time Freeze',
                description: 'Freeze quiz timer for 30 seconds',
                icon: 'fas fa-clock',
                type: 'consumable',
                cost: 75,
                effect: { type: 'time_freeze', value: 30 },
                rarity: 'rare'
            },
            {
                id: 'second_chance',
                name: 'Second Chance',
                description: 'Get a second attempt on failed quizzes',
                icon: 'fas fa-redo',
                type: 'consumable',
                cost: 120,
                effect: { type: 'second_chance', value: 1 },
                rarity: 'epic'
            },
            {
                id: 'perfect_score_boost',
                name: 'Perfect Score Boost',
                description: 'Guaranteed perfect score on next quiz',
                icon: 'fas fa-star',
                type: 'consumable',
                cost: 300,
                effect: { type: 'perfect_score', value: 1 },
                rarity: 'legendary'
            }
        ];
    }

    initializeLeaderboards() {
        // Initialize class leaderboards
        this.classLeaderboards = {
            'Class 9A': [
                { username: 'Student', level: 15, xp: 2500, perfectScores: 8, streak: 12 },
                { username: 'Alex', level: 14, xp: 2300, perfectScores: 7, streak: 10 },
                { username: 'Sarah', level: 13, xp: 2100, perfectScores: 6, streak: 8 },
                { username: 'Mike', level: 12, xp: 1900, perfectScores: 5, streak: 6 },
                { username: 'Emma', level: 11, xp: 1700, perfectScores: 4, streak: 5 }
            ],
            'Class 9B': [
                { username: 'John', level: 16, xp: 2800, perfectScores: 9, streak: 15 },
                { username: 'Lisa', level: 15, xp: 2600, perfectScores: 8, streak: 13 },
                { username: 'David', level: 14, xp: 2400, perfectScores: 7, streak: 11 },
                { username: 'Anna', level: 13, xp: 2200, perfectScores: 6, streak: 9 },
                { username: 'Tom', level: 12, xp: 2000, perfectScores: 5, streak: 7 }
            ],
            'Class 10A': [
                { username: 'Sophie', level: 18, xp: 3200, perfectScores: 12, streak: 20 },
                { username: 'James', level: 17, xp: 3000, perfectScores: 11, streak: 18 },
                { username: 'Maria', level: 16, xp: 2800, perfectScores: 10, streak: 16 },
                { username: 'Peter', level: 15, xp: 2600, perfectScores: 9, streak: 14 },
                { username: 'Kate', level: 14, xp: 2400, perfectScores: 8, streak: 12 }
            ]
        };

        // Initialize school leaderboards
        this.schoolLeaderboards = {
            'Nepal Secondary School': [
                { username: 'Sophie', class: 'Class 10A', level: 18, xp: 3200, perfectScores: 12 },
                { username: 'James', class: 'Class 10A', level: 17, xp: 3000, perfectScores: 11 },
                { username: 'John', class: 'Class 9B', level: 16, xp: 2800, perfectScores: 9 },
                { username: 'Maria', class: 'Class 10A', level: 16, xp: 2800, perfectScores: 10 },
                { username: 'Student', class: 'Class 9A', level: 15, xp: 2500, perfectScores: 8 }
            ]
        };

        // Add current user to leaderboards
        this.updateUserInLeaderboards();
    }

    updateUserInLeaderboards() {
        const userData = {
            username: this.userProfile.username,
            level: this.userProfile.level,
            xp: this.userProfile.totalXP,
            perfectScores: this.userProfile.stats.perfectScores,
            streak: this.userProfile.streak.current,
            class: this.userProfile.class
        };

        // Update class leaderboard
        if (this.classLeaderboards[this.userProfile.class]) {
            const classIndex = this.classLeaderboards[this.userProfile.class].findIndex(
                user => user.username === this.userProfile.username
            );
            
            if (classIndex !== -1) {
                this.classLeaderboards[this.userProfile.class][classIndex] = userData;
            } else {
                this.classLeaderboards[this.userProfile.class].push(userData);
            }

            // Sort by XP (descending)
            this.classLeaderboards[this.userProfile.class].sort((a, b) => b.xp - a.xp);
        }

        // Update school leaderboard
        const schoolIndex = this.schoolLeaderboards[this.userProfile.school].findIndex(
            user => user.username === this.userProfile.username
        );
        
        if (schoolIndex !== -1) {
            this.schoolLeaderboards[this.userProfile.school][schoolIndex] = userData;
        } else {
            this.schoolLeaderboards[this.userProfile.school].push(userData);
        }

        // Sort by XP (descending)
        this.schoolLeaderboards[this.userProfile.school].sort((a, b) => b.xp - a.xp);
    }

    showLeaderboard(type = 'class') {
        let leaderboardData = [];
        let title = '';
        let subtitle = '';

        if (type === 'class') {
            leaderboardData = this.classLeaderboards[this.userProfile.class] || [];
            title = 'Class Leaderboard';
            subtitle = this.userProfile.class;
        } else if (type === 'school') {
            leaderboardData = this.schoolLeaderboards[this.userProfile.school] || [];
            title = 'School Leaderboard';
            subtitle = this.userProfile.school;
        }

        const leaderboardHTML = `
            <div class="space-y-4">
                <div class="text-center mb-6">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">${title}</h3>
                    <p class="text-gray-600 dark:text-gray-400">${subtitle}</p>
                </div>

                <!-- Leaderboard Tabs -->
                <div class="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button class="leaderboard-tab flex-1 py-2 px-4 rounded-md text-sm font-medium ${type === 'class' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}" data-type="class">
                        <i class="fas fa-users mr-2"></i>Class
                    </button>
                    <button class="leaderboard-tab flex-1 py-2 px-4 rounded-md text-sm font-medium ${type === 'school' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}" data-type="school">
                        <i class="fas fa-school mr-2"></i>School
                    </button>
                </div>

                <!-- Leaderboard List -->
                <div class="space-y-3">
                    ${leaderboardData.map((user, index) => `
                        <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${user.username === this.userProfile.username ? 'ring-2 ring-primary-500' : ''}">
                            <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                    ${index === 0 ? '<i class="fas fa-crown text-yellow-500 text-2xl"></i>' :
                                      index === 1 ? '<i class="fas fa-medal text-gray-400 text-2xl"></i>' :
                                      index === 2 ? '<i class="fas fa-medal text-orange-500 text-2xl"></i>' :
                                      `<div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">${index + 1}</div>`
                                    }
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-900 dark:text-white">
                                        ${user.username} ${user.username === this.userProfile.username ? '<span class="text-primary-500">(You)</span>' : ''}
                                    </div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">
                                        Level ${user.level} • ${user.xp} XP
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                    ${user.perfectScores} Perfect Scores
                                </div>
                                <div class="text-xs text-gray-600 dark:text-gray-400">
                                    ${user.streak} Day Streak
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- User Stats Summary -->
                <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white">
                    <h4 class="font-semibold mb-2">Your Performance</h4>
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div class="text-lg font-bold">${this.getUserRank(type)}</div>
                            <div class="text-xs opacity-90">Rank</div>
                        </div>
                        <div>
                            <div class="text-lg font-bold">${this.userProfile.totalXP}</div>
                            <div class="text-xs opacity-90">Total XP</div>
                        </div>
                        <div>
                            <div class="text-lg font-bold">${this.userProfile.stats.perfectScores}</div>
                            <div class="text-xs opacity-90">Perfect Scores</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Update the leaderboard tab content
        const leaderboardTab = document.getElementById('leaderboardTab');
        if (leaderboardTab) {
            leaderboardTab.innerHTML = leaderboardHTML;
        }
    }

    getUserRank(type) {
        let leaderboardData = [];
        
        if (type === 'class') {
            leaderboardData = this.classLeaderboards[this.userProfile.class] || [];
        } else if (type === 'school') {
            leaderboardData = this.schoolLeaderboards[this.userProfile.school] || [];
        }

        const userIndex = leaderboardData.findIndex(user => user.username === this.userProfile.username);
        return userIndex !== -1 ? userIndex + 1 : 'N/A';
    }

    showGamificationDashboard() {
        const user = this.getCurrentUser();
        const achievements = this.getUserAchievements(user.id);
        const leaderboards = this.getLeaderboards();
        const badges = this.getUserBadges(user.id);
        const rewards = this.getUserRewards(user.id);
        const velocityStats = window.learningVelocity ? window.learningVelocity.getVelocityStats() : null;
        const retentionStats = window.retentionAnalysis ? window.retentionAnalysis.getRetentionStats() : null;
        const attentionStats = window.attentionTracking ? window.attentionTracking.getAttentionStats() : null;

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Gamification Dashboard</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-500">${user.points}</div>
                            <div class="text-xs text-gray-500">Total Points</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-500">${user.level}</div>
                            <div class="text-xs text-gray-500">Level</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${achievements.length}</div>
                                <div class="text-sm opacity-90">Achievements</div>
                            </div>
                            <i class="fas fa-trophy text-3xl opacity-80"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${badges.length}</div>
                                <div class="text-sm opacity-90">Badges</div>
                            </div>
                            <i class="fas fa-medal text-3xl opacity-80"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${rewards.length}</div>
                                <div class="text-sm opacity-90">Rewards</div>
                            </div>
                            <i class="fas fa-gift text-3xl opacity-80"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.getCurrentStreak(user.id)}</div>
                                <div class="text-sm opacity-90">Day Streak</div>
                            </div>
                            <i class="fas fa-fire text-3xl opacity-80"></i>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                    <button id="achievementsBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-trophy"></i>
                        <span>Achievements</span>
                    </button>
                    <button id="badgesBtn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-medal"></i>
                        <span>Badges & Rewards</span>
                    </button>
                    <button id="leaderboardsBtn" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-chart-line"></i>
                        <span>Leaderboards</span>
                    </button>
                    <button id="velocityBtn" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Learning Velocity</span>
                    </button>
                    <button id="retentionBtn" class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-brain"></i>
                        <span>Retention Analysis</span>
                    </button>
                    <button id="attentionBtn" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-eye"></i>
                        <span>Attention Tracking</span>
                    </button>
                    <button id="searchHistoryBtn" class="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-search"></i>
                        <span>Search History</span>
                    </button>
                    <button id="sentimentBtn" class="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-heart"></i>
                        <span>Sentiment Analysis</span>
                    </button>
                    <button id="contentGenBtn" class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-robot"></i>
                        <span>AI Content</span>
                    </button>
                    <button id="plagiarismBtn" class="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-shield-alt"></i>
                        <span>Plagiarism Check</span>
                    </button>
                </div>

                <!-- Recent Activity -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recent Activity</h4>
                    <div class="space-y-3">
                        ${this.getRecentActivity(user.id).slice(0, 5).map(activity => `
                            <div class="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div class="flex-shrink-0">
                                    <i class="${activity.icon} text-${activity.color} text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="font-semibold text-gray-900 dark:text-white">${activity.title}</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">${activity.description}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold text-green-500">+${activity.points} pts</div>
                                    <div class="text-xs text-gray-500">${activity.time}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Performance Summary -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h5 class="font-semibold mb-3">Learning Progress</h5>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600 dark:text-gray-400">Quizzes Completed</span>
                                <span class="font-semibold">${this.getQuizCount(user.id)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                                <span class="font-semibold">${this.getAverageScore(user.id)}%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600 dark:text-gray-400">Study Time</span>
                                <span class="font-semibold">${this.getTotalStudyTime(user.id)} hrs</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h5 class="font-semibold mb-3">Advanced Metrics</h5>
                        <div class="space-y-3">
                            ${velocityStats ? `
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Learning Velocity</span>
                                    <span class="font-semibold">${velocityStats.averageVelocity.toFixed(1)} topics/hr</span>
                                </div>
                            ` : ''}
                            ${retentionStats ? `
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Retention Rate</span>
                                    <span class="font-semibold">${retentionStats.overallRetention.toFixed(1)}%</span>
                                </div>
                            ` : ''}
                            ${attentionStats ? `
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Focus Efficiency</span>
                                    <span class="font-semibold">${attentionStats.focusEfficiency.toFixed(1)}%</span>
                                </div>
                            ` : ''}
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600 dark:text-gray-400">Consistency Score</span>
                                <span class="font-semibold">${this.getConsistencyScore(user.id)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // Update button states
                tabBtns.forEach(b => {
                    b.classList.remove('bg-white', 'dark:bg-gray-700', 'text-primary-600', 'dark:text-primary-400');
                    b.classList.add('text-gray-600', 'dark:text-gray-400');
                });
                btn.classList.remove('text-gray-600', 'dark:text-gray-400');
                btn.classList.add('bg-white', 'dark:bg-gray-700', 'text-primary-600', 'dark:text-primary-400');

                // Show target content
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(targetTab + 'Tab').classList.remove('hidden');
            });
        });
    }

    showAchievementDetails(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        const isUnlocked = this.userProfile.achievements.includes(achievementId);
        const progress = this.getAchievementProgress(achievement);

        const modalContent = `
            <div class="p-6 max-w-md">
                <div class="text-center">
                    <i class="${achievement.icon} text-6xl ${isUnlocked ? 'text-green-500' : 'text-gray-400'} mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">${achievement.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">${achievement.description}</p>
                    
                    ${isUnlocked ? `
                        <div class="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                            <div class="text-green-800 dark:text-green-200 font-semibold">Achievement Unlocked!</div>
                            <div class="text-sm text-green-700 dark:text-green-300 mt-1">
                                +${achievement.xpReward} XP • +${achievement.coinReward} Coins
                            </div>
                        </div>
                    ` : `
                        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Progress</div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full" style="width: ${progress}%"></div>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">${this.getAchievementProgressText(achievement)}</div>
                        </div>
                    `}
                    
                    <div class="flex items-center justify-center space-x-4 text-sm">
                        <span class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">+${achievement.xpReward} XP</span>
                        <span class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">+${achievement.coinReward} Coins</span>
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    getAchievementProgress(achievement) {
        switch (achievement.condition.type) {
            case 'quizzes_completed':
                return Math.min((this.userProfile.stats.quizzesCompleted / achievement.condition.value) * 100, 100);
            case 'perfect_scores':
                return Math.min((this.userProfile.stats.perfectScores / achievement.condition.value) * 100, 100);
            case 'streak':
                return Math.min((this.userProfile.streak.current / achievement.condition.value) * 100, 100);
            case 'videos_watched':
                return Math.min((this.userProfile.stats.videosWatched / achievement.condition.value) * 100, 100);
            default:
                return 0;
        }
    }

    getAchievementProgressText(achievement) {
        switch (achievement.condition.type) {
            case 'quizzes_completed':
                return `${this.userProfile.stats.quizzesCompleted}/${achievement.condition.value} quizzes completed`;
            case 'perfect_scores':
                return `${this.userProfile.stats.perfectScores}/${achievement.condition.value} perfect scores`;
            case 'streak':
                return `${this.userProfile.streak.current}/${achievement.condition.value} day streak`;
            case 'videos_watched':
                return `${this.userProfile.stats.videosWatched}/${achievement.condition.value} videos watched`;
            default:
                return 'Progress tracking not available';
        }
    }

    showBadgeDetails(badgeId) {
        const badge = this.badges.find(b => b.id === badgeId);
        if (!badge) return;

        const isUnlocked = this.userProfile.level >= badge.requirement.value;

        const modalContent = `
            <div class="p-6 max-w-md">
                <div class="text-center">
                    <i class="${badge.icon} text-6xl ${isUnlocked ? badge.color : 'text-gray-400'} mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">${badge.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">${badge.description}</p>
                    
                    ${isUnlocked ? `
                        <div class="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div class="text-green-800 dark:text-green-200 font-semibold">Badge Unlocked!</div>
                        </div>
                    ` : `
                        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                            <div class="text-sm text-gray-600 dark:text-gray-400">Requirement</div>
                            <div class="font-semibold">Reach Level ${badge.requirement.value}</div>
                            <div class="text-xs text-gray-500 mt-1">Current: Level ${this.userProfile.level}</div>
                        </div>
                    `}
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    claimReward(rewardId) {
        const reward = this.rewards.find(r => r.id === rewardId);
        if (!reward) return;

        if (this.userProfile.coins < reward.cost) {
            this.showNotification('Not enough coins!', 'error');
            return;
        }

        // Deduct coins
        this.userProfile.coins -= reward.cost;
        
        // Apply reward effect
        this.applyRewardEffect(reward);
        
        // Save profile
        this.saveUserProfile();
        
        this.showNotification(`${reward.name} purchased successfully!`, 'success');
    }

    applyRewardEffect(reward) {
        switch (reward.effect.type) {
            case 'xp_multiplier':
                // Apply XP multiplier for duration
                this.userProfile.activeBoosts = this.userProfile.activeBoosts || [];
                this.userProfile.activeBoosts.push({
                    type: 'xp_multiplier',
                    value: reward.effect.value,
                    expiresAt: new Date(Date.now() + reward.effect.duration).toISOString()
                });
                break;
            case 'hints':
                this.userProfile.hints = (this.userProfile.hints || 0) + reward.effect.value;
                break;
            case 'streak_protection':
                this.userProfile.streakProtection = (this.userProfile.streakProtection || 0) + reward.effect.value;
                break;
        }
    }

    startChallenge(challengeId) {
        const challenge = this.dailyChallenges.find(c => c.id === challengeId);
        if (!challenge) return;

        // Navigate to appropriate section based on challenge
        switch (challengeId) {
            case 'daily_quiz':
                if (window.app && window.app.showSection) {
                    window.app.showSection('quiz');
                }
                break;
            case 'study_time':
                if (window.app && window.app.showSection) {
                    window.app.showSection('study');
                }
                break;
            case 'perfect_score':
                if (window.app && window.app.showSection) {
                    window.app.showSection('quiz');
                }
                break;
        }

        window.app.closeModal();
    }

    // Event handlers for game actions
    onQuizCompleted(score, totalQuestions) {
        const xpGained = Math.floor((score / totalQuestions) * 50) + 10;
        this.addXP(xpGained);
        this.userProfile.stats.quizzesCompleted++;
        
        if (score === totalQuestions) {
            this.userProfile.stats.perfectScores++;
            this.checkAchievements();
        }
        
        this.updateDailyChallenges('daily_quiz', 1);
        this.updateDailyChallenges('perfect_score', score === totalQuestions ? 1 : 0);
        
        // Track learning velocity for quiz completion
        if (window.learningVelocity) {
            const currentTopic = this.getCurrentTopic();
            if (currentTopic) {
                const sessionId = window.learningVelocity.startLearningSession(
                    currentTopic.id, 
                    currentTopic.name, 
                    currentTopic.subject
                );
                window.learningVelocity.endLearningSession(sessionId);
            }
        }
        
        this.saveUserProfile();
        this.showNotification(`Quiz completed! +${xpGained} XP`, 'success');
    }

    onVideoWatched() {
        this.addXP(5);
        this.userProfile.stats.videosWatched++;
        this.checkAchievements();
        
        // Track learning velocity for video watching
        if (window.learningVelocity) {
            const currentTopic = this.getCurrentTopic();
            if (currentTopic) {
                const sessionId = window.learningVelocity.startLearningSession(
                    currentTopic.id, 
                    currentTopic.name, 
                    currentTopic.subject
                );
                window.learningVelocity.endLearningSession(sessionId);
            }
        }
        
        this.saveUserProfile();
    }

    onChapterRead() {
        this.addXP(15);
        this.userProfile.stats.chaptersRead++;
        
        // Track learning velocity for chapter reading
        if (window.learningVelocity) {
            const currentTopic = this.getCurrentTopic();
            if (currentTopic) {
                const sessionId = window.learningVelocity.startLearningSession(
                    currentTopic.id, 
                    currentTopic.name, 
                    currentTopic.subject
                );
                window.learningVelocity.endLearningSession(sessionId);
            }
        }
        
        this.saveUserProfile();
    }

    // Helper method to get current topic information
    getCurrentTopic() {
        // This would be integrated with the main app to get current topic
        // For now, return a default topic
        return {
            id: 'current_topic',
            name: 'Current Topic',
            subject: 'General'
        };
    }

    addXP(amount) {
        // Apply XP multiplier if active
        const activeBoost = this.userProfile.activeBoosts?.find(b => 
            b.type === 'xp_multiplier' && new Date(b.expiresAt) > new Date()
        );
        
        const finalAmount = activeBoost ? amount * activeBoost.value : amount;
        
        this.userProfile.xp += finalAmount;
        this.userProfile.totalXP += finalAmount;
        
        // Check for level up
        while (this.userProfile.xp >= this.getXPForNextLevel()) {
            this.levelUp();
        }
    }

    levelUp() {
        this.userProfile.xp -= this.getXPForNextLevel();
        this.userProfile.level++;
        
        // Give level up rewards
        const coinReward = this.userProfile.level * 10;
        this.userProfile.coins += coinReward;
        
        this.showLevelUpNotification();
        this.checkBadges();
    }

    getXPForNextLevel() {
        return this.userProfile.level * 100;
    }

    getLevelProgress() {
        const currentLevelXP = this.userProfile.xp;
        const requiredXP = this.getXPForNextLevel();
        return Math.min((currentLevelXP / requiredXP) * 100, 100);
    }

    updateStreak() {
        const now = new Date();
        const lastLogin = this.userProfile.streak.lastLogin ? new Date(this.userProfile.streak.lastLogin) : null;
        
        if (!lastLogin) {
            this.userProfile.streak.current = 1;
        } else {
            const daysDiff = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                this.userProfile.streak.current++;
            } else if (daysDiff > 1) {
                // Check if streak protection is active
                if (this.userProfile.streakProtection && this.userProfile.streakProtection > 0) {
                    this.userProfile.streakProtection--;
                } else {
                    this.userProfile.streak.current = 1;
                }
            }
        }
        
        this.userProfile.streak.lastLogin = now.toISOString();
        
        if (this.userProfile.streak.current > this.userProfile.streak.longest) {
            this.userProfile.streak.longest = this.userProfile.streak.current;
        }
        
        this.checkAchievements();
    }

    updateDailyChallenges(challengeType, progress) {
        const challenge = this.dailyChallenges.find(c => c.id === challengeType);
        if (challenge) {
            challenge.progress += progress;
            
            // Check if challenge is completed
            if (challenge.progress >= challenge.target) {
                this.completeChallenge(challenge);
            }
        }
    }

    completeChallenge(challenge) {
        this.addXP(challenge.xpReward);
        this.userProfile.coins += challenge.coinReward;
        
        this.showNotification(`Challenge completed: ${challenge.name}! +${challenge.xpReward} XP, +${challenge.coinReward} Coins`, 'success');
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.userProfile.achievements.includes(achievement.id)) {
                if (this.isAchievementUnlocked(achievement)) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    isAchievementUnlocked(achievement) {
        switch (achievement.condition.type) {
            case 'quizzes_completed':
                return this.userProfile.stats.quizzesCompleted >= achievement.condition.value;
            case 'perfect_scores':
                return this.userProfile.stats.perfectScores >= achievement.condition.value;
            case 'streak':
                return this.userProfile.streak.current >= achievement.condition.value;
            case 'videos_watched':
                return this.userProfile.stats.videosWatched >= achievement.condition.value;
            default:
                return false;
        }
    }

    unlockAchievement(achievement) {
        this.userProfile.achievements.push(achievement.id);
        this.addXP(achievement.xpReward);
        this.userProfile.coins += achievement.coinReward;
        
        this.showAchievementUnlockedNotification(achievement);
        this.saveUserProfile();
    }

    checkBadges() {
        this.badges.forEach(badge => {
            if (!this.userProfile.badges.includes(badge.id)) {
                if (this.userProfile.level >= badge.requirement.value) {
                    this.unlockBadge(badge);
                }
            }
        });
    }

    unlockBadge(badge) {
        this.userProfile.badges.push(badge.id);
        this.showBadgeUnlockedNotification(badge);
        this.saveUserProfile();
    }

    updateLeaderboard() {
        // In a real app, this would fetch from the server
        this.leaderboard = [
            { username: 'Top Student', level: 25, totalXP: 25000, streak: 45 },
            { username: 'Math Wizard', level: 22, totalXP: 22000, streak: 38 },
            { username: 'Science Pro', level: 20, totalXP: 20000, streak: 32 },
            { username: 'Study Master', level: 18, totalXP: 18000, streak: 28 },
            { username: 'Knowledge Seeker', level: 15, totalXP: 15000, streak: 25 }
        ];
    }

    showLevelUpNotification() {
        const modalContent = `
            <div class="p-6 text-center">
                <i class="fas fa-star text-6xl text-yellow-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Level Up!</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Congratulations! You've reached Level ${this.userProfile.level}</p>
                <div class="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div class="text-yellow-800 dark:text-yellow-200 font-semibold">Rewards</div>
                    <div class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        +${this.userProfile.level * 10} Coins
                    </div>
                </div>
                <button onclick="window.app.closeModal()" class="mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                    Awesome!
                </button>
            </div>
        `;
        window.app.showModal(modalContent);
    }

    showAchievementUnlockedNotification(achievement) {
        const modalContent = `
            <div class="p-6 text-center">
                <i class="${achievement.icon} text-6xl text-green-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Achievement Unlocked!</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">${achievement.name}</p>
                <div class="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div class="text-green-800 dark:text-green-200 font-semibold">Rewards</div>
                    <div class="text-sm text-green-700 dark:text-green-300 mt-1">
                        +${achievement.xpReward} XP • +${achievement.coinReward} Coins
                    </div>
                </div>
                <button onclick="window.app.closeModal()" class="mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                    Claim Rewards
                </button>
            </div>
        `;
        window.app.showModal(modalContent);
    }

    showBadgeUnlockedNotification(badge) {
        const modalContent = `
            <div class="p-6 text-center">
                <i class="${badge.icon} text-6xl ${badge.color} mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Badge Unlocked!</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">${badge.name}</p>
                <div class="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div class="text-blue-800 dark:text-blue-200 font-semibold">New Badge</div>
                    <div class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        ${badge.description}
                    </div>
                </div>
                <button onclick="window.app.closeModal()" class="mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                    Awesome!
                </button>
            </div>
        `;
        window.app.showModal(modalContent);
    }

    showNotification(message, type = 'info') {
        if (window.adminDashboard && window.adminDashboard.showNotification) {
            window.adminDashboard.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `fixed top-20 right-4 bg-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    getRarityColor(rarity) {
        switch (rarity) {
            case 'common':
                return 'text-gray-500';
            case 'rare':
                return 'text-blue-500';
            case 'epic':
                return 'text-purple-500';
            case 'legendary':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    }
}

// Initialize gamification system
window.gamification = new GamificationSystem(); 