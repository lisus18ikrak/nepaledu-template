// Sentiment Analysis & Student Mood Tracking System
class SentimentAnalysis {
    constructor() {
        this.sentimentData = {};
        this.currentMood = null;
        this.moodHistory = [];
        this.emotionTriggers = {};
        this.init();
    }

    init() {
        this.loadSentimentData();
        this.setupEventListeners();
        this.startMoodTracking();
    }

    loadSentimentData() {
        const saved = localStorage.getItem('sentimentAnalysisData');
        if (saved) {
            this.sentimentData = JSON.parse(saved);
        } else {
            this.sentimentData = {
                moodHistory: [],
                emotionTriggers: {},
                patterns: {
                    moodTrends: {},
                    learningCorrelation: {},
                    timeBasedMoods: {}
                },
                metrics: {
                    averageMood: 0,
                    moodStability: 0,
                    positiveMoodPercentage: 0,
                    learningMoodCorrelation: 0
                },
                settings: {
                    trackingInterval: 300000, // 5 minutes
                    moodThreshold: 0.3
                }
            };
            this.saveSentimentData();
        }
    }

    saveSentimentData() {
        localStorage.setItem('sentimentAnalysisData', JSON.stringify(this.sentimentData));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'sentimentBtn') {
                this.showSentimentDashboard();
            }
            if (e.target.classList.contains('mood-option')) {
                const mood = e.target.dataset.mood;
                const intensity = parseInt(e.target.dataset.intensity);
                this.recordMood(mood, intensity);
            }
        });

        // Track learning events for mood correlation
        document.addEventListener('quizCompleted', (e) => {
            this.correlateMoodWithLearning('quiz', e.detail);
        });

        document.addEventListener('chapterCompleted', (e) => {
            this.correlateMoodWithLearning('chapter', e.detail);
        });

        document.addEventListener('achievementUnlocked', (e) => {
            this.correlateMoodWithLearning('achievement', e.detail);
        });
    }

    startMoodTracking() {
        // Periodic mood check-ins
        setInterval(() => {
            if (this.shouldPromptForMood()) {
                this.showMoodPrompt();
            }
        }, this.sentimentData.settings.trackingInterval);

        // Track text input for sentiment analysis
        this.trackTextSentiment();
    }

    shouldPromptForMood() {
        const lastMood = this.sentimentData.moodHistory[this.sentimentData.moodHistory.length - 1];
        if (!lastMood) return true;

        const timeSinceLastMood = Date.now() - lastMood.timestamp;
        return timeSinceLastMood > this.sentimentData.settings.trackingInterval;
    }

    showMoodPrompt() {
        const modalContent = `
            <div class="p-6 max-w-md">
                <div class="text-center mb-6">
                    <i class="fas fa-heart text-4xl text-pink-500 mb-4"></i>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">How are you feeling?</h3>
                    <p class="text-gray-600 dark:text-gray-400">Your mood helps us personalize your learning experience</p>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <button class="mood-option bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-4 rounded-lg border-2 border-transparent hover:border-red-300 transition-all" 
                            data-mood="frustrated" data-intensity="1">
                        <div class="text-center">
                            <i class="fas fa-angry text-2xl text-red-500 mb-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">Frustrated</div>
                        </div>
                    </button>
                    <button class="mood-option bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 p-4 rounded-lg border-2 border-transparent hover:border-orange-300 transition-all" 
                            data-mood="confused" data-intensity="2">
                        <div class="text-center">
                            <i class="fas fa-question-circle text-2xl text-orange-500 mb-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">Confused</div>
                        </div>
                    </button>
                    <button class="mood-option bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 p-4 rounded-lg border-2 border-transparent hover:border-yellow-300 transition-all" 
                            data-mood="neutral" data-intensity="3">
                        <div class="text-center">
                            <i class="fas fa-meh text-2xl text-yellow-500 mb-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">Neutral</div>
                        </div>
                    </button>
                    <button class="mood-option bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 p-4 rounded-lg border-2 border-transparent hover:border-blue-300 transition-all" 
                            data-mood="focused" data-intensity="4">
                        <div class="text-center">
                            <i class="fas fa-lightbulb text-2xl text-blue-500 mb-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">Focused</div>
                        </div>
                    </button>
                    <button class="mood-option bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 p-4 rounded-lg border-2 border-transparent hover:border-green-300 transition-all" 
                            data-mood="confident" data-intensity="5">
                        <div class="text-center">
                            <i class="fas fa-smile text-2xl text-green-500 mb-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">Confident</div>
                        </div>
                    </button>
                    <button class="mood-option bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 p-4 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all" 
                            data-mood="excited" data-intensity="6">
                        <div class="text-center">
                            <i class="fas fa-star text-2xl text-purple-500 mb-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">Excited</div>
                        </div>
                    </button>
                </div>

                <div class="text-center">
                    <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm" onclick="this.closest('.modal').remove()">
                        Skip for now
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Mood Check-in');
    }

    recordMood(mood, intensity) {
        const moodEntry = {
            id: Date.now(),
            mood: mood,
            intensity: intensity,
            timestamp: Date.now(),
            timeOfDay: this.getTimeOfDay(),
            dayOfWeek: this.getDayOfWeek(),
            context: this.getCurrentContext(),
            triggers: this.identifyTriggers()
        };

        this.sentimentData.moodHistory.push(moodEntry);
        this.currentMood = moodEntry;
        this.updateMoodPatterns();
        this.saveSentimentData();

        // Close mood prompt
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();

        // Show mood confirmation
        this.showMoodConfirmation(mood, intensity);
    }

    getCurrentContext() {
        // Determine current learning context
        const currentPage = window.location.pathname;
        if (currentPage.includes('quiz')) return 'quiz';
        if (currentPage.includes('chapter')) return 'chapter';
        if (currentPage.includes('dashboard')) return 'dashboard';
        return 'general';
    }

    identifyTriggers() {
        const triggers = [];
        
        // Check for recent events
        if (window.gamificationSystem) {
            const recentActivity = window.gamificationSystem.getRecentActivity();
            if (recentActivity.length > 0) {
                const lastActivity = recentActivity[0];
                if (lastActivity.type === 'quiz_completed') {
                    triggers.push('quiz_completion');
                }
                if (lastActivity.type === 'achievement_unlocked') {
                    triggers.push('achievement');
                }
            }
        }

        // Check for performance
        if (window.retentionAnalysis) {
            const retentionStats = window.retentionAnalysis.getRetentionStats();
            if (retentionStats.overallRetention < 60) {
                triggers.push('low_retention');
            }
        }

        return triggers;
    }

    correlateMoodWithLearning(eventType, eventData) {
        if (!this.currentMood) return;

        const correlation = {
            eventType: eventType,
            eventData: eventData,
            mood: this.currentMood,
            timestamp: Date.now()
        };

        if (!this.sentimentData.patterns.learningCorrelation[eventType]) {
            this.sentimentData.patterns.learningCorrelation[eventType] = [];
        }

        this.sentimentData.patterns.learningCorrelation[eventType].push(correlation);
        this.saveSentimentData();
    }

    trackTextSentiment() {
        // Monitor text input for sentiment analysis
        const textInputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
        
        textInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const text = e.target.value;
                if (text.length > 10) {
                    this.analyzeTextSentiment(text);
                }
            });
        });
    }

    analyzeTextSentiment(text) {
        // Simple sentiment analysis based on keywords
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'understand', 'easy', 'helpful'];
        const negativeWords = ['bad', 'terrible', 'hate', 'difficult', 'confusing', 'frustrated', 'angry', 'sad'];
        
        const words = text.toLowerCase().split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;

        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        });

        const sentiment = positiveCount - negativeCount;
        
        if (Math.abs(sentiment) > 2) {
            this.recordTextSentiment(sentiment > 0 ? 'positive' : 'negative', Math.abs(sentiment));
        }
    }

    recordTextSentiment(sentiment, intensity) {
        const textMoodEntry = {
            id: Date.now(),
            mood: sentiment,
            intensity: intensity,
            timestamp: Date.now(),
            source: 'text_analysis',
            context: this.getCurrentContext()
        };

        this.sentimentData.moodHistory.push(textMoodEntry);
        this.saveSentimentData();
    }

    updateMoodPatterns() {
        const moods = this.sentimentData.moodHistory;
        if (moods.length === 0) return;

        // Calculate average mood
        const moodScores = moods.map(m => m.intensity);
        this.sentimentData.metrics.averageMood = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;

        // Calculate mood stability
        const moodChanges = [];
        for (let i = 1; i < moods.length; i++) {
            moodChanges.push(Math.abs(moods[i].intensity - moods[i-1].intensity));
        }
        this.sentimentData.metrics.moodStability = moodChanges.length > 0 ? 
            moodChanges.reduce((a, b) => a + b, 0) / moodChanges.length : 0;

        // Calculate positive mood percentage
        const positiveMoods = moods.filter(m => m.intensity >= 4);
        this.sentimentData.metrics.positiveMoodPercentage = (positiveMoods.length / moods.length) * 100;

        // Analyze time-based patterns
        this.analyzeTimeBasedPatterns();
    }

    analyzeTimeBasedPatterns() {
        const moods = this.sentimentData.moodHistory;
        const timePatterns = {};

        moods.forEach(mood => {
            const timeOfDay = mood.timeOfDay;
            if (!timePatterns[timeOfDay]) {
                timePatterns[timeOfDay] = {
                    moods: [],
                    averageIntensity: 0
                };
            }
            timePatterns[timeOfDay].moods.push(mood);
        });

        Object.keys(timePatterns).forEach(time => {
            const pattern = timePatterns[time];
            pattern.averageIntensity = pattern.moods.reduce((sum, m) => sum + m.intensity, 0) / pattern.moods.length;
        });

        this.sentimentData.patterns.timeBasedMoods = timePatterns;
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

    showMoodConfirmation(mood, intensity) {
        const moodEmojis = {
            'frustrated': '😤',
            'confused': '😕',
            'neutral': '😐',
            'focused': '🤔',
            'confident': '😊',
            'excited': '🤩'
        };

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl">${moodEmojis[mood]}</div>
                <div>
                    <div class="font-semibold text-gray-900 dark:text-white">Mood Recorded</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Feeling ${mood} (${intensity}/6)</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    getSentimentInsights() {
        const insights = [];
        const metrics = this.sentimentData.metrics;

        // Mood stability insights
        if (metrics.moodStability < 1) {
            insights.push({
                id: 'stable_mood',
                title: 'Stable Mood',
                description: 'Your mood has been very stable - great emotional balance!',
                icon: 'fas fa-balance-scale',
                color: 'text-green-500'
            });
        } else if (metrics.moodStability > 2) {
            insights.push({
                id: 'mood_fluctuations',
                title: 'Mood Fluctuations',
                description: 'Your mood varies significantly - consider what affects your emotions',
                icon: 'fas fa-chart-line',
                color: 'text-orange-500'
            });
        }

        // Positive mood insights
        if (metrics.positiveMoodPercentage >= 70) {
            insights.push({
                id: 'positive_outlook',
                title: 'Positive Outlook',
                description: `${metrics.positiveMoodPercentage.toFixed(1)}% of your moods are positive - excellent!`,
                icon: 'fas fa-sun',
                color: 'text-yellow-500'
            });
        } else if (metrics.positiveMoodPercentage < 40) {
            insights.push({
                id: 'mood_support',
                title: 'Mood Support',
                description: 'Consider talking to someone about your feelings',
                icon: 'fas fa-heart',
                color: 'text-red-500'
            });
        }

        // Learning correlation insights
        const learningCorrelation = this.sentimentData.patterns.learningCorrelation;
        if (learningCorrelation.quiz && learningCorrelation.quiz.length > 0) {
            const quizMoods = learningCorrelation.quiz.map(c => c.mood.intensity);
            const avgQuizMood = quizMoods.reduce((a, b) => a + b, 0) / quizMoods.length;
            
            if (avgQuizMood >= 4) {
                insights.push({
                    id: 'quiz_confidence',
                    title: 'Quiz Confidence',
                    description: 'You feel confident during quizzes - great mindset!',
                    icon: 'fas fa-clipboard-check',
                    color: 'text-blue-500'
                });
            }
        }

        return insights;
    }

    showSentimentDashboard() {
        const insights = this.getSentimentInsights();
        const recentMoods = this.sentimentData.moodHistory
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Sentiment Analysis & Mood Tracking</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-pink-500">${this.sentimentData.metrics.averageMood.toFixed(1)}</div>
                            <div class="text-xs text-gray-500">Average Mood</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-500">${this.sentimentData.moodHistory.length}</div>
                            <div class="text-xs text-gray-500">Mood Records</div>
                        </div>
                    </div>
                </div>

                <!-- Current Mood -->
                ${this.currentMood ? `
                    <div class="mb-6 p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-lg font-semibold mb-2">Current Mood</h4>
                                <p class="text-sm opacity-90">${this.currentMood.mood} (${this.currentMood.intensity}/6)</p>
                            </div>
                            <div class="text-right">
                                <div class="text-3xl">${this.getMoodEmoji(this.currentMood.mood)}</div>
                                <div class="text-xs opacity-75">${new Date(this.currentMood.timestamp).toLocaleTimeString()}</div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Mood Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.sentimentData.metrics.averageMood.toFixed(1)}</div>
                                <div class="text-sm opacity-90">Average Mood</div>
                            </div>
                            <i class="fas fa-heart text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Overall emotional state
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.sentimentData.metrics.positiveMoodPercentage.toFixed(1)}%</div>
                                <div class="text-sm opacity-90">Positive Moods</div>
                            </div>
                            <i class="fas fa-sun text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Percentage of positive emotions
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.sentimentData.metrics.moodStability.toFixed(1)}</div>
                                <div class="text-sm opacity-90">Mood Stability</div>
                            </div>
                            <i class="fas fa-balance-scale text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Emotional consistency
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.sentimentData.moodHistory.length}</div>
                                <div class="text-sm opacity-90">Mood Records</div>
                            </div>
                            <i class="fas fa-chart-line text-3xl opacity-80"></i>
                        </div>
                        <div class="text-xs opacity-75 mt-2">
                            Total mood entries
                        </div>
                    </div>
                </div>

                <!-- Insights Section -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Mood Insights</h4>
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

                <!-- Mood Pattern Analysis -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Mood Pattern Analysis</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h5 class="font-semibold mb-3">Time of Day Moods</h5>
                            ${this.getTimeBasedMoodAnalysis()}
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h5 class="font-semibold mb-3">Learning Correlation</h5>
                            ${this.getLearningCorrelationAnalysis()}
                        </div>
                    </div>
                </div>

                <!-- Recent Mood History -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recent Mood History</h4>
                    <div class="space-y-3">
                        ${recentMoods.map(mood => `
                            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <div class="text-2xl">${this.getMoodEmoji(mood.mood)}</div>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white capitalize">${mood.mood}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">
                                            ${mood.context} • ${new Date(mood.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                        ${mood.intensity}/6 intensity
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">
                                        ${mood.timeOfDay}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Quick Mood Check -->
                <div class="text-center">
                    <button id="quickMoodCheck" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold">
                        <i class="fas fa-heart mr-2"></i>
                        Check My Mood Now
                    </button>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupDashboardButtons();
    }

    getMoodEmoji(mood) {
        const emojis = {
            'frustrated': '😤',
            'confused': '😕',
            'neutral': '😐',
            'focused': '🤔',
            'confident': '😊',
            'excited': '🤩',
            'positive': '😊',
            'negative': '😔'
        };
        return emojis[mood] || '😐';
    }

    getTimeBasedMoodAnalysis() {
        const timePatterns = this.sentimentData.patterns.timeBasedMoods;
        const times = ['morning', 'afternoon', 'evening', 'night'];
        
        return times.map(time => {
            const pattern = timePatterns[time];
            if (!pattern || pattern.moods.length === 0) return '';

            return `
                <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-medium capitalize">${time}</span>
                    <div class="text-right">
                        <div class="text-sm font-semibold">${pattern.averageIntensity.toFixed(1)}/6</div>
                        <div class="text-xs text-gray-500">${pattern.moods.length} records</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getLearningCorrelationAnalysis() {
        const learningCorrelation = this.sentimentData.patterns.learningCorrelation;
        const events = ['quiz', 'chapter', 'achievement'];
        
        return events.map(event => {
            const correlations = learningCorrelation[event];
            if (!correlations || correlations.length === 0) return '';

            const avgMood = correlations.reduce((sum, c) => sum + c.mood.intensity, 0) / correlations.length;
            
            return `
                <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-medium capitalize">${event}</span>
                    <div class="text-right">
                        <div class="text-sm font-semibold">${avgMood.toFixed(1)}/6</div>
                        <div class="text-xs text-gray-500">${correlations.length} events</div>
                    </div>
                </div>
            `;
        }).join('') || '<div class="text-sm text-gray-500">No learning correlation data yet</div>';
    }

    setupDashboardButtons() {
        setTimeout(() => {
            const quickMoodCheck = document.getElementById('quickMoodCheck');
            if (quickMoodCheck) {
                quickMoodCheck.addEventListener('click', () => {
                    this.showMoodPrompt();
                });
            }
        }, 100);
    }

    showModal(content, title) {
        const modal = document.createElement('div');
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
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
    getSentimentStats() {
        return {
            averageMood: this.sentimentData.metrics.averageMood,
            positiveMoodPercentage: this.sentimentData.metrics.positiveMoodPercentage,
            moodStability: this.sentimentData.metrics.moodStability,
            currentMood: this.currentMood,
            insights: this.getSentimentInsights()
        };
    }

    getCurrentMood() {
        return this.currentMood;
    }
}

// Initialize the Sentiment Analysis system
window.sentimentAnalysis = new SentimentAnalysis(); 