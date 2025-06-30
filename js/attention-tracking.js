// Attention Span Tracking System
class AttentionTracking {
    constructor() {
        this.attentionData = {};
        this.currentSession = null;
        this.focusTimer = null;
        this.distractionTimer = null;
        this.lastActivity = Date.now();
        this.isActive = false;
        this.init();
    }

    init() {
        this.loadAttentionData();
        this.setupEventListeners();
        this.startActivityMonitoring();
    }

    loadAttentionData() {
        const saved = localStorage.getItem('attentionTrackingData');
        if (saved) {
            this.attentionData = JSON.parse(saved);
        } else {
            this.attentionData = {
                sessions: [],
                patterns: {
                    averageFocusTime: 0,
                    averageBreakTime: 0,
                    peakFocusHours: [],
                    distractionTriggers: [],
                    focusTrends: []
                },
                metrics: {
                    totalFocusTime: 0,
                    totalSessions: 0,
                    averageSessionLength: 0,
                    focusEfficiency: 0,
                    longestFocusSession: 0,
                    currentStreak: 0
                },
                settings: {
                    focusThreshold: 30000, // 30 seconds
                    breakThreshold: 60000, // 1 minute
                    sessionTimeout: 300000, // 5 minutes
                    autoStart: true
                }
            };
            this.saveAttentionData();
        }
    }

    saveAttentionData() {
        localStorage.setItem('attentionTrackingData', JSON.stringify(this.attentionData));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'attentionBtn') {
                this.showAttentionDashboard();
            }
            if (e.target.id === 'startFocusBtn') {
                this.startFocusSession();
            }
            if (e.target.id === 'stopFocusBtn') {
                this.stopFocusSession();
            }
        });

        // Track user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                this.recordActivity();
            });
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleDistraction();
            } else {
                this.recordActivity();
            }
        });
    }

    startActivityMonitoring() {
        setInterval(() => {
            const now = Date.now();
            const timeSinceLastActivity = now - this.lastActivity;

            if (this.isActive && timeSinceLastActivity > this.attentionData.settings.focusThreshold) {
                this.handleDistraction();
            }
        }, 10000); // Check every 10 seconds
    }

    recordActivity() {
        this.lastActivity = Date.now();
        
        if (this.currentSession && this.isActive) {
            // Update current session
            this.currentSession.lastActivity = this.lastActivity;
            this.currentSession.focusDuration = this.lastActivity - this.currentSession.startTime;
        }
    }

    handleDistraction() {
        if (this.currentSession && this.isActive) {
            this.currentSession.distractions.push({
                timestamp: Date.now(),
                duration: Date.now() - this.lastActivity,
                type: 'inactivity'
            });
            
            this.currentSession.focusDuration = this.lastActivity - this.currentSession.startTime;
        }
    }

    startFocusSession(topic = 'General Study', subject = 'General') {
        if (this.currentSession) {
            this.stopFocusSession();
        }

        this.currentSession = {
            id: Date.now(),
            topic: topic,
            subject: subject,
            startTime: Date.now(),
            lastActivity: Date.now(),
            endTime: null,
            focusDuration: 0,
            totalDuration: 0,
            distractions: [],
            focusLevel: 100,
            environment: this.getCurrentEnvironment(),
            timeOfDay: this.getTimeOfDay(),
            dayOfWeek: this.getDayOfWeek(),
            completed: false
        };

        this.isActive = true;
        this.recordActivity();

        // Start focus timer
        this.focusTimer = setInterval(() => {
            if (this.currentSession && this.isActive) {
                this.currentSession.focusDuration = Date.now() - this.currentSession.startTime;
                this.updateFocusIndicator();
            }
        }, 1000);

        this.showFocusIndicator();
        return this.currentSession.id;
    }

    stopFocusSession() {
        if (!this.currentSession) return;

        this.isActive = false;
        this.currentSession.endTime = Date.now();
        this.currentSession.totalDuration = this.currentSession.endTime - this.currentSession.startTime;
        this.currentSession.completed = true;

        // Calculate focus efficiency
        const totalDistractionTime = this.currentSession.distractions.reduce((sum, d) => sum + d.duration, 0);
        this.currentSession.focusEfficiency = ((this.currentSession.focusDuration - totalDistractionTime) / this.currentSession.totalDuration) * 100;

        // Save session
        this.attentionData.sessions.push(this.currentSession);
        this.updateMetrics();
        this.analyzePatterns();
        this.saveAttentionData();

        // Clear timers
        if (this.focusTimer) {
            clearInterval(this.focusTimer);
            this.focusTimer = null;
        }

        this.hideFocusIndicator();
        this.currentSession = null;

        return this.currentSession;
    }

    updateFocusIndicator() {
        let indicator = document.getElementById('focusIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'focusIndicator';
            indicator.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            document.body.appendChild(indicator);
        }

        if (this.currentSession && this.isActive) {
            const focusMinutes = Math.floor(this.currentSession.focusDuration / 60000);
            const focusSeconds = Math.floor((this.currentSession.focusDuration % 60000) / 1000);
            indicator.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium">Focus: ${focusMinutes}:${focusSeconds.toString().padStart(2, '0')}</span>
                </div>
            `;
        }
    }

    showFocusIndicator() {
        this.updateFocusIndicator();
    }

    hideFocusIndicator() {
        const indicator = document.getElementById('focusIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    getCurrentEnvironment() {
        // Simple environment detection
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 6) return 'night';
        if (hour >= 18) return 'evening';
        if (hour >= 12) return 'afternoon';
        return 'morning';
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

    updateMetrics() {
        const sessions = this.attentionData.sessions.filter(s => s.completed);
        if (sessions.length === 0) return;

        this.attentionData.metrics.totalSessions = sessions.length;
        this.attentionData.metrics.totalFocusTime = sessions.reduce((sum, s) => sum + s.focusDuration, 0);
        this.attentionData.metrics.averageSessionLength = this.attentionData.metrics.totalFocusTime / sessions.length;
        this.attentionData.metrics.focusEfficiency = sessions.reduce((sum, s) => sum + s.focusEfficiency, 0) / sessions.length;
        this.attentionData.metrics.longestFocusSession = Math.max(...sessions.map(s => s.focusDuration));

        // Calculate current streak
        const today = new Date().toDateString();
        const recentSessions = sessions.filter(s => new Date(s.startTime).toDateString() === today);
        this.attentionData.metrics.currentStreak = recentSessions.length;
    }

    analyzePatterns() {
        const sessions = this.attentionData.sessions.filter(s => s.completed);
        if (sessions.length === 0) return;

        // Analyze focus patterns by time of day
        const timePatterns = {};
        sessions.forEach(session => {
            const timeOfDay = session.timeOfDay;
            if (!timePatterns[timeOfDay]) {
                timePatterns[timeOfDay] = {
                    sessions: [],
                    totalFocusTime: 0,
                    averageFocusTime: 0,
                    focusEfficiency: 0
                };
            }
            timePatterns[timeOfDay].sessions.push(session);
            timePatterns[timeOfDay].totalFocusTime += session.focusDuration;
        });

        // Calculate averages
        Object.keys(timePatterns).forEach(time => {
            const pattern = timePatterns[time];
            pattern.averageFocusTime = pattern.totalFocusTime / pattern.sessions.length;
            pattern.focusEfficiency = pattern.sessions.reduce((sum, s) => sum + s.focusEfficiency, 0) / pattern.sessions.length;
        });

        // Find peak focus hours
        this.attentionData.patterns.peakFocusHours = Object.entries(timePatterns)
            .sort(([,a], [,b]) => b.averageFocusTime - a.averageFocusTime)
            .slice(0, 2)
            .map(([time]) => time);

        // Analyze distraction patterns
        const allDistractions = sessions.flatMap(s => s.distractions);
        const distractionTypes = {};
        allDistractions.forEach(distraction => {
            if (!distractionTypes[distraction.type]) {
                distractionTypes[distraction.type] = 0;
            }
            distractionTypes[distraction.type]++;
        });

        this.attentionData.patterns.distractionTriggers = Object.entries(distractionTypes)
            .sort(([,a], [,b]) => b - a)
            .map(([type, count]) => ({ type, count }));

        // Calculate overall averages
        this.attentionData.patterns.averageFocusTime = this.attentionData.metrics.averageSessionLength;
        this.attentionData.patterns.averageBreakTime = allDistractions.length > 0 ? 
            allDistractions.reduce((sum, d) => sum + d.duration, 0) / allDistractions.length : 0;
    }

    getAttentionInsights() {
        const insights = [];
        const metrics = this.attentionData.metrics;
        const patterns = this.attentionData.patterns;

        // Focus efficiency insights
        if (metrics.focusEfficiency >= 90) {
            insights.push({
                id: 'excellent_focus',
                title: 'Excellent Focus',
                description: `You maintain ${metrics.focusEfficiency.toFixed(1)}% focus efficiency - outstanding concentration!`,
                icon: 'fas fa-brain',
                color: 'text-green-500',
                type: 'positive'
            });
        } else if (metrics.focusEfficiency < 70) {
            insights.push({
                id: 'improve_focus',
                title: 'Improve Focus',
                description: `Your focus efficiency is ${metrics.focusEfficiency.toFixed(1)}% - try minimizing distractions`,
                icon: 'fas fa-lightbulb',
                color: 'text-orange-500',
                type: 'warning'
            });
        }

        // Session length insights
        const avgMinutes = Math.floor(metrics.averageSessionLength / 60000);
        if (avgMinutes >= 45) {
            insights.push({
                id: 'long_sessions',
                title: 'Long Focus Sessions',
                description: `You average ${avgMinutes} minutes per session - great endurance!`,
                icon: 'fas fa-clock',
                color: 'text-blue-500',
                type: 'positive'
            });
        } else if (avgMinutes < 15) {
            insights.push({
                id: 'short_sessions',
                title: 'Short Sessions',
                description: `Consider longer study sessions (currently ${avgMinutes} minutes average)`,
                icon: 'fas fa-hourglass-half',
                color: 'text-yellow-500',
                type: 'suggestion'
            });
        }

        // Peak hours insights
        if (patterns.peakFocusHours.length > 0) {
            insights.push({
                id: 'peak_hours',
                title: 'Peak Focus Hours',
                description: `You focus best during ${patterns.peakFocusHours.join(' and ')}`,
                icon: 'fas fa-chart-line',
                color: 'text-purple-500',
                type: 'info'
            });
        }

        // Streak insights
        if (metrics.currentStreak >= 3) {
            insights.push({
                id: 'focus_streak',
                title: 'Focus Streak',
                description: `You've maintained focus for ${metrics.currentStreak} sessions today!`,
                icon: 'fas fa-fire',
                color: 'text-red-500',
                type: 'positive'
            });
        }

        return insights;
    }

    showAttentionDashboard() {
        const insights = this.getAttentionInsights();
        const recentSessions = this.attentionData.sessions
            .filter(s => s.completed)
            .sort((a, b) => b.startTime - a.startTime)
            .slice(0, 5);

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Attention Span Tracking</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-500">${this.attentionData.metrics.focusEfficiency.toFixed(1)}%</div>
                            <div class="text-xs text-gray-500">Focus Efficiency</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-500">${this.attentionData.metrics.totalSessions}</div>
                            <div class="text-xs text-gray-500">Total Sessions</div>
                        </div>
                    </div>
                </div>

                <!-- Focus Control -->
                <div class="mb-6 p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-lg font-semibold mb-2">Focus Session Control</h4>
                            <p class="text-sm opacity-90">Track your attention span and focus patterns</p>
                        </div>
                        <div class="flex space-x-3">
                            ${this.currentSession ? `
                                <button id="stopFocusBtn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                                    <i class="fas fa-stop"></i>
                                    <span>Stop Focus</span>
                                </button>
                            ` : `
                                <button id="startFocusBtn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                                    <i class="fas fa-play"></i>
                                    <span>Start Focus</span>
                                </button>
                            `}
                        </div>
                    </div>
                    ${this.currentSession ? `
                        <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                            <div class="flex items-center justify-between">
                                <span class="text-sm">Current Session: ${this.currentSession.topic}</span>
                                <span class="text-sm font-semibold" id="currentFocusTime">00:00</span>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Attention Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.attentionData.metrics.focusEfficiency.toFixed(1)}%</div>
                                <div class="text-sm opacity-90">Focus Efficiency</div>
                            </div>
                            <i class="fas fa-brain text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Average concentration level
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${Math.floor(this.attentionData.metrics.averageSessionLength / 60000)}m</div>
                                <div class="text-sm opacity-90">Avg Session</div>
                            </div>
                            <i class="fas fa-clock text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Average focus duration
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.attentionData.metrics.currentStreak}</div>
                                <div class="text-sm opacity-90">Today's Sessions</div>
                            </div>
                            <i class="fas fa-fire text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Focus sessions today
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${Math.floor(this.attentionData.metrics.totalFocusTime / 60000)}m</div>
                                <div class="text-sm opacity-90">Total Focus</div>
                            </div>
                            <i class="fas fa-chart-line text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Total focused time
                        </div>
                    </div>
                </div>

                <!-- Insights Section -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Attention Insights</h4>
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

                <!-- Focus Pattern Analysis -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Focus Pattern Analysis</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h5 class="font-semibold mb-3">Peak Focus Hours</h5>
                            ${this.getPeakHoursAnalysis()}
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h5 class="font-semibold mb-3">Distraction Analysis</h5>
                            ${this.getDistractionAnalysis()}
                        </div>
                    </div>
                </div>

                <!-- Recent Focus Sessions -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recent Focus Sessions</h4>
                    <div class="space-y-3">
                        ${recentSessions.map(session => `
                            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-clock text-blue-500 text-xl"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white">${session.topic}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">${session.subject}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                        ${Math.floor(session.focusDuration / 60000)}:${Math.floor((session.focusDuration % 60000) / 1000).toString().padStart(2, '0')}
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">
                                        ${session.focusEfficiency.toFixed(1)}% efficiency
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupDashboardButtons();
    }

    getPeakHoursAnalysis() {
        const timePatterns = {};
        this.attentionData.sessions.forEach(session => {
            const timeOfDay = session.timeOfDay;
            if (!timePatterns[timeOfDay]) {
                timePatterns[timeOfDay] = {
                    sessions: 0,
                    totalFocusTime: 0,
                    averageFocusTime: 0
                };
            }
            timePatterns[timeOfDay].sessions++;
            timePatterns[timeOfDay].totalFocusTime += session.focusDuration;
        });

        Object.keys(timePatterns).forEach(time => {
            timePatterns[time].averageFocusTime = timePatterns[time].totalFocusTime / timePatterns[time].sessions;
        });

        const times = ['morning', 'afternoon', 'evening', 'night'];
        
        return times.map(time => {
            const pattern = timePatterns[time];
            if (!pattern || pattern.sessions === 0) return '';

            return `
                <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-medium capitalize">${time}</span>
                    <div class="text-right">
                        <div class="text-sm font-semibold">${Math.floor(pattern.averageFocusTime / 60000)}m avg</div>
                        <div class="text-xs text-gray-500">${pattern.sessions} sessions</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getDistractionAnalysis() {
        const allDistractions = this.attentionData.sessions.flatMap(s => s.distractions);
        if (allDistractions.length === 0) {
            return '<div class="text-sm text-gray-500">No distractions recorded</div>';
        }

        const distractionTypes = {};
        allDistractions.forEach(distraction => {
            if (!distractionTypes[distraction.type]) {
                distractionTypes[distraction.type] = {
                    count: 0,
                    totalDuration: 0
                };
            }
            distractionTypes[distraction.type].count++;
            distractionTypes[distraction.type].totalDuration += distraction.duration;
        });

        return Object.entries(distractionTypes).map(([type, data]) => `
            <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-sm font-medium capitalize">${type}</span>
                <div class="text-right">
                    <div class="text-sm font-semibold">${data.count} times</div>
                    <div class="text-xs text-gray-500">${Math.floor(data.totalDuration / 1000)}s total</div>
                </div>
            </div>
        `).join('');
    }

    setupDashboardButtons() {
        setTimeout(() => {
            const startBtn = document.getElementById('startFocusBtn');
            const stopBtn = document.getElementById('stopFocusBtn');
            
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.startFocusSession();
                    this.showAttentionDashboard(); // Refresh dashboard
                });
            }
            
            if (stopBtn) {
                stopBtn.addEventListener('click', () => {
                    this.stopFocusSession();
                    this.showAttentionDashboard(); // Refresh dashboard
                });
            }
        }, 100);
    }

    // Public methods for integration
    getAttentionStats() {
        return {
            focusEfficiency: this.attentionData.metrics.focusEfficiency,
            averageSessionLength: this.attentionData.metrics.averageSessionLength,
            totalSessions: this.attentionData.metrics.totalSessions,
            currentStreak: this.attentionData.metrics.currentStreak,
            insights: this.getAttentionInsights()
        };
    }

    isCurrentlyFocused() {
        return this.isActive && this.currentSession !== null;
    }
}

// Initialize the Attention Tracking system
window.attentionTracking = new AttentionTracking(); 