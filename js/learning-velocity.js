// Learning Velocity System - Track Topic Completion Speed
class LearningVelocity {
    constructor() {
        this.velocityData = {};
        this.topicHistory = [];
        this.learningSessions = [];
        this.velocityMetrics = {};
        this.init();
    }

    init() {
        this.loadVelocityData();
        this.setupEventListeners();
        this.calculateVelocityMetrics();
    }

    loadVelocityData() {
        const saved = localStorage.getItem('learningVelocityData');
        if (saved) {
            this.velocityData = JSON.parse(saved);
        } else {
            this.velocityData = {
                topics: {},
                sessions: [],
                metrics: {
                    averageVelocity: 0,
                    fastestTopic: null,
                    slowestTopic: null,
                    improvementRate: 0,
                    weeklyVelocity: [],
                    monthlyVelocity: [],
                    totalTopics: 0
                },
                settings: {
                    trackSessions: true,
                    autoCalculate: true,
                    showInsights: true
                }
            };
            this.saveVelocityData();
        }
    }

    saveVelocityData() {
        localStorage.setItem('learningVelocityData', JSON.stringify(this.velocityData));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'velocityBtn') {
                this.showVelocityDashboard();
            }
            if (e.target.classList.contains('velocity-insight')) {
                const insightId = e.target.dataset.insightId;
                this.showInsightDetails(insightId);
            }
        });
    }

    // Start tracking a topic
    startTopic(topicId, topicName, subject) {
        const session = {
            id: Date.now(),
            topicId,
            topicName,
            subject,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            completed: false,
            difficulty: 'medium',
            interruptions: 0,
            focusScore: 100
        };

        this.learningSessions.push(session);
        this.saveVelocityData();
        return session.id;
    }

    // Complete a topic
    completeTopic(sessionId, difficulty = 'medium', focusScore = 100) {
        const session = this.learningSessions.find(s => s.id === sessionId);
        if (!session) return;

        session.endTime = new Date().toISOString();
        session.duration = this.calculateDuration(session.startTime, session.endTime);
        session.completed = true;
        session.difficulty = difficulty;
        session.focusScore = focusScore;

        // Calculate velocity (topics per hour)
        const velocity = this.calculateTopicVelocity(session);
        
        // Update topic history
        if (!this.velocityData.topics[session.topicId]) {
            this.velocityData.topics[session.topicId] = {
                name: session.topicName,
                subject: session.subject,
                completions: [],
                averageVelocity: 0,
                bestVelocity: 0,
                totalTime: 0,
                difficulty: difficulty
            };
        }

        this.velocityData.topics[session.topicId].completions.push({
            sessionId,
            velocity,
            duration: session.duration,
            date: session.endTime,
            difficulty,
            focusScore
        });

        this.updateTopicMetrics(session.topicId);
        this.calculateVelocityMetrics();
        this.saveVelocityData();

        return velocity;
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        return (end - start) / (1000 * 60); // Duration in minutes
    }

    calculateTopicVelocity(session) {
        if (session.duration <= 0) return 0;
        return 60 / session.duration; // Topics per hour
    }

    updateTopicMetrics(topicId) {
        const topic = this.velocityData.topics[topicId];
        if (!topic || topic.completions.length === 0) return;

        const velocities = topic.completions.map(c => c.velocity);
        topic.averageVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
        topic.bestVelocity = Math.max(...velocities);
        topic.totalTime = topic.completions.reduce((sum, c) => sum + c.duration, 0);
    }

    calculateVelocityMetrics() {
        const allVelocities = [];
        const topicIds = Object.keys(this.velocityData.topics);

        // Calculate overall metrics
        topicIds.forEach(topicId => {
            const topic = this.velocityData.topics[topicId];
            if (topic.completions.length > 0) {
                allVelocities.push(...topic.completions.map(c => c.velocity));
            }
        });

        if (allVelocities.length > 0) {
            this.velocityData.metrics.averageVelocity = allVelocities.reduce((a, b) => a + b, 0) / allVelocities.length;
            
            // Find fastest and slowest topics
            let fastestTopic = null;
            let slowestTopic = null;
            let fastestVelocity = 0;
            let slowestVelocity = Infinity;

            topicIds.forEach(topicId => {
                const topic = this.velocityData.topics[topicId];
                if (topic.averageVelocity > fastestVelocity) {
                    fastestVelocity = topic.averageVelocity;
                    fastestTopic = topicId;
                }
                if (topic.averageVelocity < slowestVelocity) {
                    slowestVelocity = topic.averageVelocity;
                    slowestTopic = topicId;
                }
            });

            this.velocityData.metrics.fastestTopic = fastestTopic;
            this.velocityData.metrics.slowestTopic = slowestTopic;
        }

        // Calculate weekly and monthly trends
        this.calculateTrends();
    }

    calculateTrends() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Weekly velocity
        const weeklyCompletions = this.learningSessions.filter(session => 
            session.completed && new Date(session.endTime) >= weekAgo
        );
        
        if (weeklyCompletions.length > 0) {
            const weeklyVelocities = weeklyCompletions.map(session => 
                this.calculateTopicVelocity(session)
            );
            this.velocityData.metrics.weeklyVelocity = weeklyVelocities;
        }

        // Monthly velocity
        const monthlyCompletions = this.learningSessions.filter(session => 
            session.completed && new Date(session.endTime) >= monthAgo
        );
        
        if (monthlyCompletions.length > 0) {
            const monthlyVelocities = monthlyCompletions.map(session => 
                this.calculateTopicVelocity(session)
            );
            this.velocityData.metrics.monthlyVelocity = monthlyVelocities;
        }

        // Calculate improvement rate
        this.calculateImprovementRate();
    }

    calculateImprovementRate() {
        const recentVelocities = this.velocityData.metrics.weeklyVelocity;
        const olderVelocities = this.velocityData.metrics.monthlyVelocity.filter((_, index) => 
            index < Math.floor(olderVelocities.length / 2)
        );

        if (recentVelocities.length > 0 && olderVelocities.length > 0) {
            const recentAvg = recentVelocities.reduce((a, b) => a + b, 0) / recentVelocities.length;
            const olderAvg = olderVelocities.reduce((a, b) => a + b, 0) / olderVelocities.length;
            
            if (olderAvg > 0) {
                this.velocityData.metrics.improvementRate = ((recentAvg - olderAvg) / olderAvg) * 100;
            }
        }
    }

    getVelocityInsights() {
        const insights = [];

        // Overall performance insight
        const avgVelocity = this.velocityData.metrics.averageVelocity;
        if (avgVelocity > 2) {
            insights.push({
                id: 'fast_learner',
                type: 'positive',
                title: 'Fast Learner',
                description: `You're completing topics at ${avgVelocity.toFixed(1)} per hour - excellent pace!`,
                icon: 'fas fa-rocket',
                color: 'text-green-500'
            });
        } else if (avgVelocity < 0.5) {
            insights.push({
                id: 'thorough_learner',
                type: 'info',
                title: 'Thorough Learner',
                description: 'You take time to deeply understand topics - quality over quantity!',
                icon: 'fas fa-brain',
                color: 'text-blue-500'
            });
        }

        // Subject performance insights
        const subjectVelocities = {};
        Object.values(this.velocityData.topics).forEach(topic => {
            if (!subjectVelocities[topic.subject]) {
                subjectVelocities[topic.subject] = [];
            }
            subjectVelocities[topic.subject].push(topic.averageVelocity);
        });

        Object.entries(subjectVelocities).forEach(([subject, velocities]) => {
            const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
            if (avgVelocity > 1.5) {
                insights.push({
                    id: `strong_${subject}`,
                    type: 'positive',
                    title: `${subject} Strength`,
                    description: `You excel in ${subject} with ${avgVelocity.toFixed(1)} topics/hour`,
                    icon: 'fas fa-star',
                    color: 'text-yellow-500'
                });
            }
        });

        // Improvement insight
        const improvementRate = this.velocityData.metrics.improvementRate;
        if (improvementRate > 10) {
            insights.push({
                id: 'improving',
                type: 'positive',
                title: 'Getting Faster',
                description: `Your learning speed has improved by ${improvementRate.toFixed(1)}%`,
                icon: 'fas fa-chart-line',
                color: 'text-green-500'
            });
        }

        // Focus insights
        const lowFocusSessions = this.learningSessions.filter(s => s.focusScore < 70);
        if (lowFocusSessions.length > 0) {
            insights.push({
                id: 'focus_improvement',
                type: 'warning',
                title: 'Focus Opportunity',
                description: `${lowFocusSessions.length} sessions had low focus - try reducing distractions`,
                icon: 'fas fa-eye',
                color: 'text-orange-500'
            });
        }

        return insights;
    }

    showVelocityDashboard() {
        const insights = this.getVelocityInsights();
        const recentSessions = this.learningSessions
            .filter(s => s.completed)
            .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
            .slice(0, 5);

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Learning Velocity Dashboard</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-500">${this.velocityData.metrics.averageVelocity.toFixed(1)}</div>
                            <div class="text-xs text-gray-500">Topics/Hour</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-500">${this.learningSessions.filter(s => s.completed).length}</div>
                            <div class="text-xs text-gray-500">Topics Completed</div>
                        </div>
                    </div>
                </div>

                <!-- Velocity Overview -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.velocityData.metrics.averageVelocity.toFixed(1)}</div>
                                <div class="text-sm opacity-90">Average Velocity</div>
                            </div>
                            <i class="fas fa-tachometer-alt text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Topics per hour
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.velocityData.metrics.improvementRate.toFixed(1)}%</div>
                                <div class="text-sm opacity-90">Improvement Rate</div>
                            </div>
                            <i class="fas fa-chart-line text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            ${this.velocityData.metrics.improvementRate > 0 ? 'Getting faster' : 'Room for improvement'}
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${Object.keys(this.velocityData.topics).length}</div>
                                <div class="text-sm opacity-90">Unique Topics</div>
                            </div>
                            <i class="fas fa-book text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Across all subjects
                        </div>
                    </div>
                </div>

                <!-- Insights Section -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Learning Insights</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${insights.map(insight => `
                            <div class="velocity-insight border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" 
                                 data-insight-id="${insight.id}">
                                <div class="flex items-center space-x-3">
                                    <div class="flex-shrink-0">
                                        <i class="${insight.icon} ${insight.color} text-2xl"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h5 class="font-semibold text-gray-900 dark:text-white">${insight.title}</h5>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">${insight.description}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Subject Performance -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Subject Performance</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${this.getSubjectPerformanceCards()}
                    </div>
                </div>

                <!-- Recent Sessions -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recent Learning Sessions</h4>
                    <div class="space-y-3">
                        ${recentSessions.map(session => `
                            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-play-circle text-blue-500 text-xl"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white">${session.topicName}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">${session.subject}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                        ${this.calculateTopicVelocity(session).toFixed(1)} topics/hour
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">
                                        ${session.duration.toFixed(0)} minutes
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Velocity Chart -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Velocity Trends</h4>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <canvas id="velocityChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
        this.renderVelocityChart();
    }

    getSubjectPerformanceCards() {
        const subjectVelocities = {};
        Object.values(this.velocityData.topics).forEach(topic => {
            if (!subjectVelocities[topic.subject]) {
                subjectVelocities[topic.subject] = [];
            }
            subjectVelocities[topic.subject].push(topic.averageVelocity);
        });

        return Object.entries(subjectVelocities).map(([subject, velocities]) => {
            const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
            const topicCount = velocities.length;
            
            return `
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-2">
                        <h5 class="font-semibold text-gray-900 dark:text-white">${subject}</h5>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${topicCount} topics</span>
                    </div>
                    <div class="text-2xl font-bold text-blue-500">${avgVelocity.toFixed(1)}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">topics/hour</div>
                </div>
            `;
        }).join('') || '<div class="col-span-full text-center text-gray-500">No subject data available</div>';
    }

    renderVelocityChart() {
        const canvas = document.getElementById('velocityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const recentSessions = this.learningSessions
            .filter(s => s.completed)
            .sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
            .slice(-10);

        const labels = recentSessions.map(s => 
            new Date(s.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        const data = recentSessions.map(s => this.calculateTopicVelocity(s));

        // Simple chart rendering (you can enhance this with Chart.js)
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        ctx.clearRect(0, 0, width, height);

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw data points and lines
        if (data.length > 0) {
            const maxValue = Math.max(...data);
            const xStep = (width - 2 * padding) / (data.length - 1);
            const yScale = (height - 2 * padding) / maxValue;

            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();

            data.forEach((value, index) => {
                const x = padding + index * xStep;
                const y = height - padding - (value * yScale);
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                // Draw point
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
            ctx.stroke();
        }
    }

    showInsightDetails(insightId) {
        const insights = this.getVelocityInsights();
        const insight = insights.find(i => i.id === insightId);
        if (!insight) return;

        const modalContent = `
            <div class="p-6 max-w-md">
                <div class="text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                        <i class="${insight.icon} ${insight.color} text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${insight.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">${insight.description}</p>
                    
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Recommendations</h4>
                        <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            ${this.getRecommendations(insightId)}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Learning Insight');
    }

    getRecommendations(insightId) {
        const recommendations = {
            fast_learner: [
                'Consider taking on more challenging topics',
                'Help peers who might be struggling',
                'Focus on depth of understanding'
            ],
            thorough_learner: [
                'Your approach ensures strong foundations',
                'Consider setting time limits for practice',
                'Review completed topics regularly'
            ],
            strong_math: [
                'Mathematics is your strength!',
                'Consider advanced math topics',
                'Help others with math concepts'
            ],
            strong_science: [
                'Science comes naturally to you',
                'Explore advanced scientific concepts',
                'Consider science competitions'
            ],
            improving: [
                'Keep up the excellent progress!',
                'Your study techniques are working',
                'Set new challenging goals'
            ],
            focus_improvement: [
                'Find a quiet study environment',
                'Use the Pomodoro technique',
                'Turn off notifications during study'
            ]
        };

        const recs = recommendations[insightId] || ['Continue your current approach', 'Set new learning goals'];
        return recs.map(rec => `<li>• ${rec}</li>`).join('');
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

    // Public methods for integration
    startLearningSession(topicId, topicName, subject) {
        return this.startTopic(topicId, topicName, subject);
    }

    endLearningSession(sessionId, difficulty = 'medium', focusScore = 100) {
        return this.completeTopic(sessionId, difficulty, focusScore);
    }

    getVelocityStats() {
        return {
            averageVelocity: this.velocityData.metrics.averageVelocity,
            improvementRate: this.velocityData.metrics.improvementRate,
            totalTopics: this.learningSessions.filter(s => s.completed).length,
            insights: this.getVelocityInsights()
        };
    }
}

// Initialize the Learning Velocity system
window.learningVelocity = new LearningVelocity(); 