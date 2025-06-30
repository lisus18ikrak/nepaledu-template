// Retention Rate & Study Pattern Analysis System
class RetentionAnalysis {
    constructor() {
        this.retentionData = {};
        this.init();
    }

    init() {
        this.loadRetentionData();
        this.setupEventListeners();
    }

    loadRetentionData() {
        const saved = localStorage.getItem('retentionAnalysisData');
        if (saved) {
            this.retentionData = JSON.parse(saved);
        } else {
            this.retentionData = {
                topics: {},
                retentionTests: [],
                studySessions: [],
                patterns: {
                    optimalTimes: {},
                    retentionCurves: {},
                    spacedRepetition: {}
                },
                metrics: {
                    overallRetention: 0,
                    optimalStudyTime: null,
                    totalTopics: 0
                }
            };
            this.saveRetentionData();
        }
    }

    saveRetentionData() {
        localStorage.setItem('retentionAnalysisData', JSON.stringify(this.retentionData));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'retentionBtn') {
                this.showRetentionDashboard();
            }
        });
    }

    // Start a study session
    startStudySession(topicId, topicName, subject) {
        const session = {
            id: Date.now(),
            topicId,
            topicName,
            subject,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            focusLevel: 100,
            timeOfDay: this.getTimeOfDay(),
            dayOfWeek: this.getDayOfWeek(),
            completed: false
        };

        this.retentionData.studySessions.push(session);
        this.saveRetentionData();
        return session.id;
    }

    // End a study session
    endStudySession(sessionId, focusLevel = 100) {
        const session = this.retentionData.studySessions.find(s => s.id === sessionId);
        if (!session) return;

        session.endTime = new Date().toISOString();
        session.duration = this.calculateDuration(session.startTime, session.endTime);
        session.focusLevel = focusLevel;
        session.completed = true;

        this.updateStudyPatterns(session);
        this.saveRetentionData();
    }

    // Create a retention test
    createRetentionTest(topicId, topicName, subject, questions) {
        const test = {
            id: Date.now(),
            topicId,
            topicName,
            subject,
            questions: questions,
            createdAt: new Date().toISOString(),
            takenAt: null,
            score: 0,
            retentionRate: 0
        };

        this.retentionData.retentionTests.push(test);
        this.saveRetentionData();
        return test.id;
    }

    // Take a retention test
    takeRetentionTest(testId, answers) {
        const test = this.retentionData.retentionTests.find(t => t.id === testId);
        if (!test) return;

        test.takenAt = new Date().toISOString();
        test.score = this.calculateTestScore(test.questions, answers);
        test.retentionRate = (test.score / test.questions.length) * 100;

        this.updateRetentionMetrics(test);
        this.saveRetentionData();
        return test.retentionRate;
    }

    calculateTestScore(questions, answers) {
        let correct = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return correct;
    }

    updateRetentionMetrics(test) {
        if (!this.retentionData.topics[test.topicId]) {
            this.retentionData.topics[test.topicId] = {
                name: test.topicName,
                subject: test.subject,
                tests: [],
                averageRetention: 0
            };
        }

        const topic = this.retentionData.topics[test.topicId];
        topic.tests.push({
            testId: test.id,
            score: test.score,
            retentionRate: test.retentionRate,
            date: test.takenAt
        });

        // Calculate average retention
        const retentionRates = topic.tests.map(t => t.retentionRate);
        topic.averageRetention = retentionRates.reduce((a, b) => a + b, 0) / retentionRates.length;

        this.calculateOverallMetrics();
    }

    updateStudyPatterns(session) {
        const timeOfDay = session.timeOfDay;
        const dayOfWeek = session.dayOfWeek;

        if (!this.retentionData.patterns.optimalTimes[timeOfDay]) {
            this.retentionData.patterns.optimalTimes[timeOfDay] = {
                sessions: [],
                averageFocus: 0,
                averageDuration: 0
            };
        }

        if (!this.retentionData.patterns.optimalTimes[dayOfWeek]) {
            this.retentionData.patterns.optimalTimes[dayOfWeek] = {
                sessions: [],
                averageFocus: 0,
                averageDuration: 0
            };
        }

        // Update time of day patterns
        const timePattern = this.retentionData.patterns.optimalTimes[timeOfDay];
        timePattern.sessions.push(session);
        timePattern.averageFocus = timePattern.sessions.reduce((sum, s) => sum + s.focusLevel, 0) / timePattern.sessions.length;
        timePattern.averageDuration = timePattern.sessions.reduce((sum, s) => sum + s.duration, 0) / timePattern.sessions.length;

        // Update day of week patterns
        const dayPattern = this.retentionData.patterns.optimalTimes[dayOfWeek];
        dayPattern.sessions.push(session);
        dayPattern.averageFocus = dayPattern.sessions.reduce((sum, s) => sum + s.focusLevel, 0) / dayPattern.sessions.length;
        dayPattern.averageDuration = dayPattern.sessions.reduce((sum, s) => sum + s.duration, 0) / dayPattern.sessions.length;

        this.calculateOptimalStudyTime();
    }

    calculateOptimalStudyTime() {
        const timePatterns = this.retentionData.patterns.optimalTimes;
        let bestTime = null;
        let bestEfficiency = 0;

        Object.entries(timePatterns).forEach(([time, pattern]) => {
            if (pattern.sessions.length >= 3) {
                const efficiency = (pattern.averageFocus * pattern.averageDuration) / 100;
                if (efficiency > bestEfficiency) {
                    bestEfficiency = efficiency;
                    bestTime = time;
                }
            }
        });

        this.retentionData.metrics.optimalStudyTime = bestTime;
    }

    calculateOverallMetrics() {
        const topics = Object.values(this.retentionData.topics);
        if (topics.length === 0) return;

        const retentionRates = topics.map(t => t.averageRetention);
        this.retentionData.metrics.overallRetention = retentionRates.reduce((a, b) => a + b, 0) / retentionRates.length;
        this.retentionData.metrics.totalTopics = topics.length;
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    getDayOfWeek() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        return (end - start) / (1000 * 60); // Duration in minutes
    }

    getRetentionInsights() {
        const insights = [];
        const overallRetention = this.retentionData.metrics.overallRetention;

        // Overall retention insight
        if (overallRetention > 85) {
            insights.push({
                id: 'excellent_retention',
                title: 'Excellent Retention',
                description: `You're retaining ${overallRetention.toFixed(1)}% of what you learn - outstanding!`,
                icon: 'fas fa-brain',
                color: 'text-green-500'
            });
        } else if (overallRetention < 60) {
            insights.push({
                id: 'improve_retention',
                title: 'Improve Retention',
                description: `Your retention rate is ${overallRetention.toFixed(1)}% - try spaced repetition techniques`,
                icon: 'fas fa-lightbulb',
                color: 'text-orange-500'
            });
        }

        // Optimal study time insight
        const optimalTime = this.retentionData.metrics.optimalStudyTime;
        if (optimalTime) {
            insights.push({
                id: 'optimal_time',
                title: 'Optimal Study Time',
                description: `You study most effectively during ${optimalTime}`,
                icon: 'fas fa-clock',
                color: 'text-blue-500'
            });
        }

        return insights;
    }

    showRetentionDashboard() {
        const insights = this.getRetentionInsights();
        const recentTests = this.retentionData.retentionTests
            .filter(t => t.takenAt)
            .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))
            .slice(0, 5);

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Retention & Study Pattern Analysis</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-500">${this.retentionData.metrics.overallRetention.toFixed(1)}%</div>
                            <div class="text-xs text-gray-500">Overall Retention</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-500">${this.retentionData.studySessions.filter(s => s.completed).length}</div>
                            <div class="text-xs text-gray-500">Study Sessions</div>
                        </div>
                    </div>
                </div>

                <!-- Retention Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.retentionData.metrics.overallRetention.toFixed(1)}%</div>
                                <div class="text-sm opacity-90">Overall Retention</div>
                            </div>
                            <i class="fas fa-brain text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Knowledge retention rate
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.retentionData.metrics.optimalStudyTime || 'N/A'}</div>
                                <div class="text-sm opacity-90">Optimal Study Time</div>
                            </div>
                            <i class="fas fa-clock text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Your most productive time
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.retentionData.metrics.totalTopics}</div>
                                <div class="text-sm opacity-90">Topics Tracked</div>
                            </div>
                            <i class="fas fa-book text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Across all subjects
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.retentionData.retentionTests.filter(t => t.takenAt).length}</div>
                                <div class="text-sm opacity-90">Retention Tests</div>
                            </div>
                            <i class="fas fa-clipboard-check text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Knowledge assessments
                        </div>
                    </div>
                </div>

                <!-- Insights Section -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Retention Insights</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${insights.map(insight => `
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
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

                <!-- Topic Performance -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Topic Retention Performance</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${this.getTopicPerformanceCards()}
                    </div>
                </div>

                <!-- Study Pattern Analysis -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Study Pattern Analysis</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h5 class="font-semibold mb-3">Time of Day Performance</h5>
                            ${this.getTimeOfDayAnalysis()}
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h5 class="font-semibold mb-3">Day of Week Performance</h5>
                            ${this.getDayOfWeekAnalysis()}
                        </div>
                    </div>
                </div>

                <!-- Recent Retention Tests -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recent Retention Tests</h4>
                    <div class="space-y-3">
                        ${recentTests.map(test => `
                            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-clipboard-check text-blue-500 text-xl"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white">${test.topicName}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">${test.subject}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                        ${test.retentionRate.toFixed(1)}% retention
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">
                                        ${new Date(test.takenAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    getTopicPerformanceCards() {
        return Object.values(this.retentionData.topics).map(topic => {
            const colorClass = topic.averageRetention >= 80 ? 'text-green-500' : 
                              topic.averageRetention >= 60 ? 'text-yellow-500' : 'text-red-500';
            
            return `
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-2">
                        <h5 class="font-semibold text-gray-900 dark:text-white">${topic.name}</h5>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${topic.subject}</span>
                    </div>
                    <div class="text-2xl font-bold ${colorClass}">${topic.averageRetention.toFixed(1)}%</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">retention rate</div>
                    <div class="text-xs text-gray-500 mt-1">${topic.tests.length} tests taken</div>
                </div>
            `;
        }).join('') || '<div class="col-span-full text-center text-gray-500">No topic data available</div>';
    }

    getTimeOfDayAnalysis() {
        const timePatterns = this.retentionData.patterns.optimalTimes;
        const times = ['morning', 'afternoon', 'evening', 'night'];
        
        return times.map(time => {
            const pattern = timePatterns[time];
            if (!pattern || pattern.sessions.length === 0) return '';

            return `
                <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-medium capitalize">${time}</span>
                    <div class="text-right">
                        <div class="text-sm font-semibold">${pattern.averageFocus.toFixed(0)}% focus</div>
                        <div class="text-xs text-gray-500">${pattern.sessions.length} sessions</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getDayOfWeekAnalysis() {
        const dayPatterns = this.retentionData.patterns.optimalTimes;
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        return days.map(day => {
            const pattern = dayPatterns[day];
            if (!pattern || pattern.sessions.length === 0) return '';

            return `
                <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-medium capitalize">${day}</span>
                    <div class="text-right">
                        <div class="text-sm font-semibold">${pattern.averageFocus.toFixed(0)}% focus</div>
                        <div class="text-xs text-gray-500">${pattern.sessions.length} sessions</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Public methods for integration
    startStudySession(topicId, topicName, subject) {
        return this.startStudySession(topicId, topicName, subject);
    }

    endStudySession(sessionId, focusLevel = 100) {
        return this.endStudySession(sessionId, focusLevel);
    }

    createRetentionTest(topicId, topicName, subject, questions) {
        return this.createRetentionTest(topicId, topicName, subject, questions);
    }

    takeRetentionTest(testId, answers) {
        return this.takeRetentionTest(testId, answers);
    }

    getRetentionStats() {
        return {
            overallRetention: this.retentionData.metrics.overallRetention,
            optimalStudyTime: this.retentionData.metrics.optimalStudyTime,
            totalTopics: this.retentionData.metrics.totalTopics,
            insights: this.getRetentionInsights()
        };
    }
}

// Initialize the Retention Analysis system
window.retentionAnalysis = new RetentionAnalysis(); 