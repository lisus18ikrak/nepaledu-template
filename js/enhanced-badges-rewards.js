// Enhanced Badges & Rewards System with Leaderboards
class EnhancedBadgesRewards {
    constructor() {
        this.badges = [];
        this.rewards = [];
        this.leaderboards = {
            class: {},
            school: {},
            global: []
        };
        this.init();
    }

    init() {
        this.loadEnhancedBadges();
        this.loadEnhancedRewards();
        this.initializeLeaderboards();
        this.setupEventListeners();
    }

    loadEnhancedBadges() {
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
                rarity: 'common',
                xpReward: 10
            },
            {
                id: 'learner',
                name: 'Learner',
                description: 'Making steady progress in your studies',
                icon: 'fas fa-leaf',
                color: 'text-blue-500',
                bgColor: 'bg-blue-100 dark:bg-blue-900/20',
                requirement: { type: 'level', value: 5 },
                rarity: 'common',
                xpReward: 25
            },
            {
                id: 'scholar',
                name: 'Scholar',
                description: 'A dedicated student with strong academic focus',
                icon: 'fas fa-book',
                color: 'text-purple-500',
                bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                requirement: { type: 'level', value: 10 },
                rarity: 'rare',
                xpReward: 50
            },
            {
                id: 'expert',
                name: 'Expert',
                description: 'Master of knowledge and learning',
                icon: 'fas fa-gem',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
                requirement: { type: 'level', value: 20 },
                rarity: 'epic',
                xpReward: 100
            },
            {
                id: 'legend',
                name: 'Legend',
                description: 'A living legend in the world of education',
                icon: 'fas fa-crown',
                color: 'text-red-500',
                bgColor: 'bg-red-100 dark:bg-red-900/20',
                requirement: { type: 'level', value: 50 },
                rarity: 'legendary',
                xpReward: 500
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
                rarity: 'epic',
                xpReward: 200
            },
            {
                id: 'streak_master',
                name: 'Streak Master',
                description: 'Maintains incredible study consistency',
                icon: 'fas fa-fire',
                color: 'text-orange-500',
                bgColor: 'bg-orange-100 dark:bg-orange-900/20',
                requirement: { type: 'streak', value: 50 },
                rarity: 'legendary',
                xpReward: 1000
            },
            {
                id: 'subject_master',
                name: 'Subject Master',
                description: 'Has mastered multiple subjects completely',
                icon: 'fas fa-graduation-cap',
                color: 'text-indigo-500',
                bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
                requirement: { type: 'subjects_mastered', value: 2 },
                rarity: 'epic',
                xpReward: 300
            },
            {
                id: 'goal_achiever',
                name: 'Goal Achiever',
                description: 'Consistently meets and exceeds learning goals',
                icon: 'fas fa-target',
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
                requirement: { type: 'weekly_goals', value: 5 },
                rarity: 'rare',
                xpReward: 150
            },
            {
                id: 'class_leader',
                name: 'Class Leader',
                description: 'Leads the class in academic performance',
                icon: 'fas fa-medal',
                color: 'text-cyan-500',
                bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
                requirement: { type: 'class_rank', value: 1 },
                rarity: 'epic',
                xpReward: 400
            },
            {
                id: 'school_champion',
                name: 'School Champion',
                description: 'Top performer across the entire school',
                icon: 'fas fa-star',
                color: 'text-pink-500',
                bgColor: 'bg-pink-100 dark:bg-pink-900/20',
                requirement: { type: 'school_rank', value: 1 },
                rarity: 'legendary',
                xpReward: 1500
            },
            {
                id: 'knowledge_hunter',
                name: 'Knowledge Hunter',
                description: 'Actively seeks knowledge from all sources',
                icon: 'fas fa-search',
                color: 'text-teal-500',
                bgColor: 'bg-teal-100 dark:bg-teal-900/20',
                requirement: { type: 'videos_watched', value: 50 },
                rarity: 'rare',
                xpReward: 200
            },
            // Special milestone badges
            {
                id: 'first_perfect',
                name: 'First Perfect',
                description: 'Achieved your first perfect score',
                icon: 'fas fa-star',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
                requirement: { type: 'perfect_scores', value: 1 },
                rarity: 'common',
                xpReward: 50
            },
            {
                id: 'week_warrior',
                name: 'Week Warrior',
                description: 'Completed a full week of daily study',
                icon: 'fas fa-calendar-week',
                color: 'text-blue-500',
                bgColor: 'bg-blue-100 dark:bg-blue-900/20',
                requirement: { type: 'streak', value: 7 },
                rarity: 'rare',
                xpReward: 100
            },
            {
                id: 'monthly_master',
                name: 'Monthly Master',
                description: 'Maintained study streak for an entire month',
                icon: 'fas fa-calendar-alt',
                color: 'text-purple-500',
                bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                requirement: { type: 'streak', value: 30 },
                rarity: 'epic',
                xpReward: 500
            }
        ];
    }

    loadEnhancedRewards() {
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
        this.leaderboards.class = {
            'Class 9A': [
                { username: 'Student', level: 15, xp: 2500, perfectScores: 8, streak: 12, class: 'Class 9A' },
                { username: 'Alex', level: 14, xp: 2300, perfectScores: 7, streak: 10, class: 'Class 9A' },
                { username: 'Sarah', level: 13, xp: 2100, perfectScores: 6, streak: 8, class: 'Class 9A' },
                { username: 'Mike', level: 12, xp: 1900, perfectScores: 5, streak: 6, class: 'Class 9A' },
                { username: 'Emma', level: 11, xp: 1700, perfectScores: 4, streak: 5, class: 'Class 9A' }
            ],
            'Class 9B': [
                { username: 'John', level: 16, xp: 2800, perfectScores: 9, streak: 15, class: 'Class 9B' },
                { username: 'Lisa', level: 15, xp: 2600, perfectScores: 8, streak: 13, class: 'Class 9B' },
                { username: 'David', level: 14, xp: 2400, perfectScores: 7, streak: 11, class: 'Class 9B' },
                { username: 'Anna', level: 13, xp: 2200, perfectScores: 6, streak: 9, class: 'Class 9B' },
                { username: 'Tom', level: 12, xp: 2000, perfectScores: 5, streak: 7, class: 'Class 9B' }
            ],
            'Class 10A': [
                { username: 'Sophie', level: 18, xp: 3200, perfectScores: 12, streak: 20, class: 'Class 10A' },
                { username: 'James', level: 17, xp: 3000, perfectScores: 11, streak: 18, class: 'Class 10A' },
                { username: 'Maria', level: 16, xp: 2800, perfectScores: 10, streak: 16, class: 'Class 10A' },
                { username: 'Peter', level: 15, xp: 2600, perfectScores: 9, streak: 14, class: 'Class 10A' },
                { username: 'Kate', level: 14, xp: 2400, perfectScores: 8, streak: 12, class: 'Class 10A' }
            ]
        };

        // Initialize school leaderboards
        this.leaderboards.school = {
            'Nepal Secondary School': [
                { username: 'Sophie', class: 'Class 10A', level: 18, xp: 3200, perfectScores: 12 },
                { username: 'James', class: 'Class 10A', level: 17, xp: 3000, perfectScores: 11 },
                { username: 'John', class: 'Class 9B', level: 16, xp: 2800, perfectScores: 9 },
                { username: 'Maria', class: 'Class 10A', level: 16, xp: 2800, perfectScores: 10 },
                { username: 'Student', class: 'Class 9A', level: 15, xp: 2500, perfectScores: 8 }
            ]
        };

        // Global leaderboard
        this.leaderboards.global = [
            { username: 'Sophie', school: 'Nepal Secondary School', class: 'Class 10A', level: 18, xp: 3200 },
            { username: 'James', school: 'Nepal Secondary School', class: 'Class 10A', level: 17, xp: 3000 },
            { username: 'John', school: 'Nepal Secondary School', class: 'Class 9B', level: 16, xp: 2800 },
            { username: 'Maria', school: 'Nepal Secondary School', class: 'Class 10A', level: 16, xp: 2800 },
            { username: 'Student', school: 'Nepal Secondary School', class: 'Class 9A', level: 15, xp: 2500 }
        ];
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('badge-item')) {
                const badgeId = e.target.dataset.badgeId;
                this.showBadgeDetails(badgeId);
            }
            if (e.target.classList.contains('reward-item')) {
                const rewardId = e.target.dataset.rewardId;
                this.showRewardDetails(rewardId);
            }
            if (e.target.classList.contains('leaderboard-tab')) {
                const leaderboardType = e.target.dataset.type;
                this.showLeaderboard(leaderboardType);
            }
        });
    }

    showBadgeDetails(badgeId) {
        const badge = this.badges.find(b => b.id === badgeId);
        if (!badge) return;

        const modalContent = `
            <div class="p-6 max-w-md">
                <div class="text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 ${badge.bgColor} rounded-full mb-4">
                        <i class="${badge.icon} ${badge.color} text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${badge.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">${badge.description}</p>
                    
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Rarity:</span>
                            <span class="text-sm ${this.getRarityColor(badge.rarity)}">${badge.rarity.toUpperCase()}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">XP Reward:</span>
                            <span class="text-sm text-green-600 dark:text-green-400">+${badge.xpReward} XP</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Requirement:</span>
                            <span class="text-sm text-blue-600 dark:text-blue-400">${this.getRequirementText(badge.requirement)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Badge Details');
    }

    showRewardDetails(rewardId) {
        const reward = this.rewards.find(r => r.id === rewardId);
        if (!reward) return;

        const modalContent = `
            <div class="p-6 max-w-md">
                <div class="text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4">
                        <i class="${reward.icon} text-white text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${reward.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">${reward.description}</p>
                    
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Cost:</span>
                            <span class="text-sm text-yellow-600 dark:text-yellow-400">${reward.cost} Coins</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
                            <span class="text-sm text-purple-600 dark:text-purple-400">${reward.type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Rarity:</span>
                            <span class="text-sm ${this.getRarityColor(reward.rarity)}">${reward.rarity.toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <button class="mt-6 w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Purchase for ${reward.cost} Coins
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Reward Details');
    }

    showLeaderboard(type = 'class') {
        let leaderboardData = [];
        let title = '';
        let subtitle = '';

        if (type === 'class') {
            leaderboardData = this.leaderboards.class['Class 9A'] || [];
            title = 'Class Leaderboard';
            subtitle = 'Class 9A';
        } else if (type === 'school') {
            leaderboardData = this.leaderboards.school['Nepal Secondary School'] || [];
            title = 'School Leaderboard';
            subtitle = 'Nepal Secondary School';
        } else if (type === 'global') {
            leaderboardData = this.leaderboards.global;
            title = 'Global Leaderboard';
            subtitle = 'All Schools';
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
                    <button class="leaderboard-tab flex-1 py-2 px-4 rounded-md text-sm font-medium ${type === 'global' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}" data-type="global">
                        <i class="fas fa-globe mr-2"></i>Global
                    </button>
                </div>

                <!-- Leaderboard List -->
                <div class="space-y-3">
                    ${leaderboardData.map((user, index) => `
                        <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${user.username === 'Student' ? 'ring-2 ring-primary-500' : ''}">
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
                                        ${user.username} ${user.username === 'Student' ? '<span class="text-primary-500">(You)</span>' : ''}
                                    </div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">
                                        Level ${user.level} • ${user.xp} XP
                                        ${user.class ? `• ${user.class}` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                    ${user.perfectScores || 0} Perfect Scores
                                </div>
                                <div class="text-xs text-gray-600 dark:text-gray-400">
                                    ${user.streak || 0} Day Streak
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
                            <div class="text-lg font-bold">2500</div>
                            <div class="text-xs opacity-90">Total XP</div>
                        </div>
                        <div>
                            <div class="text-lg font-bold">8</div>
                            <div class="text-xs opacity-90">Perfect Scores</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return leaderboardHTML;
    }

    getUserRank(type) {
        let leaderboardData = [];
        
        if (type === 'class') {
            leaderboardData = this.leaderboards.class['Class 9A'] || [];
        } else if (type === 'school') {
            leaderboardData = this.leaderboards.school['Nepal Secondary School'] || [];
        } else if (type === 'global') {
            leaderboardData = this.leaderboards.global;
        }

        const userIndex = leaderboardData.findIndex(user => user.username === 'Student');
        return userIndex !== -1 ? userIndex + 1 : 'N/A';
    }

    getRarityColor(rarity) {
        const colors = {
            common: 'text-gray-600 dark:text-gray-400',
            rare: 'text-blue-600 dark:text-blue-400',
            epic: 'text-purple-600 dark:text-purple-400',
            legendary: 'text-orange-600 dark:text-orange-400'
        };
        return colors[rarity] || colors.common;
    }

    getRequirementText(requirement) {
        const types = {
            level: 'Reach Level',
            perfect_scores: 'Get Perfect Scores',
            streak: 'Maintain Day Streak',
            subjects_mastered: 'Master Subjects',
            weekly_goals: 'Achieve Weekly Goals',
            class_rank: 'Rank #1 in Class',
            school_rank: 'Rank #1 in School',
            videos_watched: 'Watch Videos'
        };
        return `${types[requirement.type]} ${requirement.value}`;
    }

    showModal(content, title) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4">
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">${title}</h3>
                    <button class="close-modal text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Method to check and unlock badges based on user progress
    checkBadges(userProfile) {
        const unlockedBadges = [];
        
        this.badges.forEach(badge => {
            if (this.isBadgeUnlocked(badge, userProfile)) {
                unlockedBadges.push(badge);
            }
        });

        return unlockedBadges;
    }

    isBadgeUnlocked(badge, userProfile) {
        const requirement = badge.requirement;
        
        switch (requirement.type) {
            case 'level':
                return userProfile.level >= requirement.value;
            case 'perfect_scores':
                return userProfile.stats.perfectScores >= requirement.value;
            case 'streak':
                return userProfile.streak.current >= requirement.value;
            case 'subjects_mastered':
                return userProfile.stats.subjectsMastered >= requirement.value;
            case 'weekly_goals':
                return userProfile.stats.weeklyGoals >= requirement.value;
            case 'videos_watched':
                return userProfile.stats.videosWatched >= requirement.value;
            default:
                return false;
        }
    }
}

// Initialize the enhanced badges and rewards system
window.enhancedBadgesRewards = new EnhancedBadgesRewards(); 