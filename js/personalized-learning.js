// Personalized Learning System for NepalEdu
class PersonalizedLearningSystem {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.learningData = this.loadLearningData();
        this.spacedRepetition = new SpacedRepetitionSystem();
        this.masteryTracker = new MasteryTrackingSystem();
        this.aiRecommender = new AIRecommendationEngine();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeLearningProfile();
        this.updateDashboard();
    }

    // User Profile Management
    loadUserProfile() {
        const saved = localStorage.getItem('nepaledu_user_profile');
        return saved ? JSON.parse(saved) : {
            id: this.generateUserId(),
            name: 'Student',
            grade: '10',
            learningStyle: 'visual', // visual, auditory, kinesthetic
            goals: {
                targetScore: 85,
                studyHoursPerDay: 2,
                examDate: null
            },
            preferences: {
                preferredSubjects: [],
                preferredTimeSlots: [],
                notificationSettings: {
                    studyReminders: true,
                    progressUpdates: true,
                    achievementAlerts: true
                }
            },
            strengths: {},
            weaknesses: {},
            masteryLevels: {},
            studyHistory: [],
            performanceMetrics: {
                averageScore: 0,
                totalStudyTime: 0,
                completedTopics: 0,
                streakDays: 0
            }
        };
    }

    saveUserProfile() {
        localStorage.setItem('nepaledu_user_profile', JSON.stringify(this.userProfile));
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Learning Data Management
    loadLearningData() {
        const saved = localStorage.getItem('nepaledu_learning_data');
        return saved ? JSON.parse(saved) : {
            topics: this.initializeTopics(),
            difficultyLevels: {
                easy: 1,
                medium: 2,
                hard: 3,
                expert: 4
            },
            learningPaths: this.generateLearningPaths(),
            spacedRepetitionSchedule: {},
            masteryThresholds: {
                beginner: 0.3,
                intermediate: 0.6,
                advanced: 0.8,
                expert: 0.95
            }
        };
    }

    initializeTopics() {
        return {
            mathematics: {
                algebra: {
                    topics: ['Linear Equations', 'Quadratic Equations', 'Polynomials', 'Functions'],
                    difficulty: 2,
                    prerequisites: [],
                    estimatedTime: 120 // minutes
                },
                geometry: {
                    topics: ['Triangles', 'Circles', 'Polygons', 'Coordinate Geometry'],
                    difficulty: 2,
                    prerequisites: ['algebra'],
                    estimatedTime: 150
                },
                trigonometry: {
                    topics: ['Trigonometric Ratios', 'Trigonometric Identities', 'Heights and Distances'],
                    difficulty: 3,
                    prerequisites: ['geometry'],
                    estimatedTime: 180
                }
            },
            science: {
                physics: {
                    topics: ['Mechanics', 'Electricity', 'Optics', 'Thermodynamics'],
                    difficulty: 2,
                    prerequisites: ['mathematics'],
                    estimatedTime: 200
                },
                chemistry: {
                    topics: ['Atomic Structure', 'Chemical Bonding', 'Reactions', 'Organic Chemistry'],
                    difficulty: 2,
                    prerequisites: [],
                    estimatedTime: 180
                },
                biology: {
                    topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology'],
                    difficulty: 1,
                    prerequisites: [],
                    estimatedTime: 160
                }
            },
            english: {
                grammar: {
                    topics: ['Parts of Speech', 'Tenses', 'Voice', 'Narration'],
                    difficulty: 1,
                    prerequisites: [],
                    estimatedTime: 100
                },
                literature: {
                    topics: ['Poetry', 'Prose', 'Drama', 'Comprehension'],
                    difficulty: 2,
                    prerequisites: ['grammar'],
                    estimatedTime: 120
                }
            },
            nepali: {
                vyakaran: {
                    topics: ['शब्द रूप', 'क्रियापद', 'वाक्य रचना', 'अलंकार'],
                    difficulty: 1,
                    prerequisites: [],
                    estimatedTime: 90
                },
                sahitya: {
                    topics: ['कविता', 'कथा', 'निबन्ध', 'नाटक'],
                    difficulty: 2,
                    prerequisites: ['vyakaran'],
                    estimatedTime: 110
                }
            }
        };
    }

    generateLearningPaths() {
        return {
            mathematics: [
                { path: 'algebra → geometry → trigonometry', difficulty: 'progressive' },
                { path: 'geometry → algebra → trigonometry', difficulty: 'visual-first' },
                { path: 'algebra → trigonometry → geometry', difficulty: 'calculation-first' }
            ],
            science: [
                { path: 'biology → chemistry → physics', difficulty: 'concept-first' },
                { path: 'chemistry → physics → biology', difficulty: 'experiment-first' },
                { path: 'physics → chemistry → biology', difficulty: 'mathematical-first' }
            ],
            english: [
                { path: 'grammar → literature', difficulty: 'foundation-first' },
                { path: 'literature → grammar', difficulty: 'context-first' }
            ],
            nepali: [
                { path: 'vyakaran → sahitya', difficulty: 'foundation-first' },
                { path: 'sahitya → vyakaran', difficulty: 'context-first' }
            ]
        };
    }

    // Learning Style Adaptation
    adaptContentToLearningStyle(content, learningStyle) {
        switch (learningStyle) {
            case 'visual':
                return this.adaptForVisualLearners(content);
            case 'auditory':
                return this.adaptForAuditoryLearners(content);
            case 'kinesthetic':
                return this.adaptForKinestheticLearners(content);
            default:
                return content;
        }
    }

    adaptForVisualLearners(content) {
        return {
            ...content,
            enhancedWith: {
                diagrams: true,
                charts: true,
                mindMaps: true,
                colorCoding: true,
                visualExamples: true
            }
        };
    }

    adaptForAuditoryLearners(content) {
        return {
            ...content,
            enhancedWith: {
                audioExplanations: true,
                verbalInstructions: true,
                discussionPrompts: true,
                pronunciationGuides: true,
                audioSummaries: true
            }
        };
    }

    adaptForKinestheticLearners(content) {
        return {
            ...content,
            enhancedWith: {
                interactiveExercises: true,
                handsOnActivities: true,
                physicalExamples: true,
                movementBasedLearning: true,
                practicalApplications: true
            }
        };
    }

    // Weakness Detection
    detectWeaknesses() {
        const weaknesses = {};
        const performanceData = this.userProfile.studyHistory;

        // Analyze performance by topic
        Object.keys(this.learningData.topics).forEach(subject => {
            Object.keys(this.learningData.topics[subject]).forEach(chapter => {
                const topicPerformance = this.calculateTopicPerformance(subject, chapter);
                if (topicPerformance.averageScore < 60) {
                    weaknesses[`${subject}_${chapter}`] = {
                        subject,
                        chapter,
                        averageScore: topicPerformance.averageScore,
                        totalAttempts: topicPerformance.totalAttempts,
                        lastAttempted: topicPerformance.lastAttempted,
                        recommendedActions: this.getRecommendedActions(topicPerformance)
                    };
                }
            });
        });

        this.userProfile.weaknesses = weaknesses;
        this.saveUserProfile();
        return weaknesses;
    }

    calculateTopicPerformance(subject, chapter) {
        const relevantHistory = this.userProfile.studyHistory.filter(
            record => record.subject === subject && record.chapter === chapter
        );

        if (relevantHistory.length === 0) return { averageScore: 0, totalAttempts: 0, lastAttempted: null };

        const scores = relevantHistory.map(record => record.score);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

        return {
            averageScore,
            totalAttempts: relevantHistory.length,
            lastAttempted: relevantHistory[relevantHistory.length - 1].timestamp,
            improvementTrend: this.calculateImprovementTrend(relevantHistory)
        };
    }

    calculateImprovementTrend(history) {
        if (history.length < 2) return 'insufficient_data';

        const recentScores = history.slice(-3).map(h => h.score);
        const olderScores = history.slice(0, -3).map(h => h.score);

        if (olderScores.length === 0) return 'insufficient_data';

        const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
        const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length;

        if (recentAvg > olderAvg + 10) return 'improving';
        if (recentAvg < olderAvg - 10) return 'declining';
        return 'stable';
    }

    getRecommendedActions(performance) {
        const actions = [];

        if (performance.averageScore < 40) {
            actions.push('Start with basic concepts and fundamentals');
            actions.push('Use visual aids and step-by-step explanations');
            actions.push('Practice with easier questions first');
        } else if (performance.averageScore < 60) {
            actions.push('Review core concepts and formulas');
            actions.push('Practice with medium difficulty questions');
            actions.push('Focus on common mistakes and misconceptions');
        } else if (performance.averageScore < 80) {
            actions.push('Work on advanced problem-solving techniques');
            actions.push('Practice time management for exams');
            actions.push('Focus on application-based questions');
        }

        return actions;
    }

    // Strength Analysis
    analyzeStrengths() {
        const strengths = {};
        const performanceData = this.userProfile.studyHistory;

        Object.keys(this.learningData.topics).forEach(subject => {
            Object.keys(this.learningData.topics[subject]).forEach(chapter => {
                const topicPerformance = this.calculateTopicPerformance(subject, chapter);
                if (topicPerformance.averageScore >= 80) {
                    strengths[`${subject}_${chapter}`] = {
                        subject,
                        chapter,
                        averageScore: topicPerformance.averageScore,
                        totalAttempts: topicPerformance.totalAttempts,
                        masteryLevel: this.calculateMasteryLevel(topicPerformance.averageScore),
                        confidenceLevel: this.calculateConfidenceLevel(topicPerformance)
                    };
                }
            });
        });

        this.userProfile.strengths = strengths;
        this.saveUserProfile();
        return strengths;
    }

    calculateMasteryLevel(score) {
        if (score >= 95) return 'expert';
        if (score >= 85) return 'advanced';
        if (score >= 75) return 'intermediate';
        return 'beginner';
    }

    calculateConfidenceLevel(performance) {
        const consistency = this.calculateConsistency(performance);
        const recentPerformance = performance.improvementTrend;

        if (consistency > 0.8 && recentPerformance === 'improving') return 'very_high';
        if (consistency > 0.7 && recentPerformance !== 'declining') return 'high';
        if (consistency > 0.6) return 'moderate';
        return 'low';
    }

    calculateConsistency(performance) {
        // Calculate how consistent the performance is
        const scores = performance.scores || [];
        if (scores.length < 2) return 0.5;

        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const standardDeviation = Math.sqrt(variance);

        // Lower standard deviation means higher consistency
        return Math.max(0, 1 - (standardDeviation / 100));
    }

    // Custom Study Plans
    generateCustomStudyPlan() {
        const weaknesses = this.detectWeaknesses();
        const strengths = this.analyzeStrengths();
        const userGoals = this.userProfile.goals;

        const studyPlan = {
            id: 'plan_' + Date.now(),
            createdAt: new Date().toISOString(),
            duration: this.calculatePlanDuration(userGoals),
            dailySchedule: this.generateDailySchedule(userGoals),
            weeklyGoals: this.generateWeeklyGoals(weaknesses, userGoals),
            priorityTopics: this.identifyPriorityTopics(weaknesses, userGoals),
            adaptiveAdjustments: this.setupAdaptiveAdjustments(),
            progressMilestones: this.setupProgressMilestones(userGoals)
        };

        this.userProfile.currentStudyPlan = studyPlan;
        this.saveUserProfile();
        return studyPlan;
    }

    calculatePlanDuration(goals) {
        if (!goals.examDate) return 30; // Default 30 days

        const examDate = new Date(goals.examDate);
        const today = new Date();
        const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

        return Math.max(7, Math.min(90, daysUntilExam)); // Between 7 and 90 days
    }

    generateDailySchedule(goals) {
        const studyHours = goals.studyHoursPerDay || 2;
        const timeSlots = this.userProfile.preferences.preferredTimeSlots;

        return {
            morning: {
                duration: Math.floor(studyHours * 0.4 * 60), // 40% of study time
                focus: 'new_concepts',
                preferredTime: timeSlots.morning || '08:00'
            },
            afternoon: {
                duration: Math.floor(studyHours * 0.3 * 60), // 30% of study time
                focus: 'practice_problems',
                preferredTime: timeSlots.afternoon || '14:00'
            },
            evening: {
                duration: Math.floor(studyHours * 0.3 * 60), // 30% of study time
                focus: 'review_revision',
                preferredTime: timeSlots.evening || '18:00'
            }
        };
    }

    generateWeeklyGoals(weaknesses, goals) {
        const weeklyGoals = [];
        const weakTopics = Object.values(weaknesses).slice(0, 3); // Focus on top 3 weaknesses

        weakTopics.forEach((weakness, index) => {
            weeklyGoals.push({
                week: index + 1,
                primaryFocus: `${weakness.subject} - ${weakness.chapter}`,
                targetScore: Math.min(85, weakness.averageScore + 20),
                studyHours: 5,
                activities: [
                    'Review fundamental concepts',
                    'Practice with progressive difficulty',
                    'Take diagnostic quizzes',
                    'Review mistakes and learn from them'
                ]
            });
        });

        return weeklyGoals;
    }

    identifyPriorityTopics(weaknesses, goals) {
        const priorityTopics = [];

        // Add weak topics as high priority
        Object.values(weaknesses)
            .sort((a, b) => a.averageScore - b.averageScore)
            .slice(0, 5)
            .forEach(weakness => {
                priorityTopics.push({
                    topic: `${weakness.subject}_${weakness.chapter}`,
                    priority: 'high',
                    reason: 'low_performance',
                    estimatedTime: this.learningData.topics[weakness.subject][weakness.chapter]?.estimatedTime || 120
                });
            });

        // Add exam-specific topics if exam date is set
        if (goals.examDate) {
            const examTopics = this.getExamSpecificTopics();
            examTopics.forEach(topic => {
                priorityTopics.push({
                    topic: topic.id,
                    priority: 'medium',
                    reason: 'exam_preparation',
                    estimatedTime: topic.estimatedTime
                });
            });
        }

        return priorityTopics;
    }

    getExamSpecificTopics() {
        // Return topics commonly tested in SEE exams
        return [
            { id: 'mathematics_algebra', estimatedTime: 120 },
            { id: 'mathematics_geometry', estimatedTime: 150 },
            { id: 'science_physics', estimatedTime: 200 },
            { id: 'science_chemistry', estimatedTime: 180 },
            { id: 'english_grammar', estimatedTime: 100 },
            { id: 'nepali_vyakaran', estimatedTime: 90 }
        ];
    }

    setupAdaptiveAdjustments() {
        return {
            performanceThreshold: 70,
            adjustmentFrequency: 'weekly',
            adjustmentTypes: {
                difficulty: 'auto_adjust',
                pace: 'performance_based',
                content: 'learning_style_adaptive'
            }
        };
    }

    setupProgressMilestones(goals) {
        const milestones = [];
        const targetScore = goals.targetScore || 85;
        const currentScore = this.userProfile.performanceMetrics.averageScore || 0;

        // Create progressive milestones
        const scoreIncrements = [10, 20, 30, 40, 50];
        scoreIncrements.forEach(increment => {
            const milestoneScore = Math.min(targetScore, currentScore + increment);
            if (milestoneScore > currentScore) {
                milestones.push({
                    id: `milestone_${milestoneScore}`,
                    targetScore: milestoneScore,
                    reward: this.generateMilestoneReward(milestoneScore),
                    estimatedDate: this.estimateMilestoneDate(milestoneScore, currentScore)
                });
            }
        });

        return milestones;
    }

    generateMilestoneReward(score) {
        const rewards = {
            badge: `score_${Math.floor(score / 10) * 10}`,
            xp: score * 10,
            coins: Math.floor(score / 5),
            unlock: score >= 90 ? 'expert_content' : null
        };
        return rewards;
    }

    estimateMilestoneDate(targetScore, currentScore) {
        const scoreGap = targetScore - currentScore;
        const estimatedDays = Math.ceil(scoreGap / 5); // Assuming 5 points improvement per day
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + estimatedDays);
        return targetDate.toISOString();
    }

    // Spaced Repetition System
    setupSpacedRepetition() {
        this.spacedRepetition.initializeSchedule(this.userProfile.masteryLevels);
    }

    getNextReviewItems() {
        return this.spacedRepetition.getDueItems();
    }

    // Difficulty Progression
    adjustDifficulty(topicId, performance) {
        const currentLevel = this.userProfile.masteryLevels[topicId]?.difficulty || 1;
        let newLevel = currentLevel;

        if (performance.averageScore >= 85) {
            newLevel = Math.min(4, currentLevel + 1); // Increase difficulty
        } else if (performance.averageScore < 60) {
            newLevel = Math.max(1, currentLevel - 1); // Decrease difficulty
        }

        if (newLevel !== currentLevel) {
            this.userProfile.masteryLevels[topicId] = {
                ...this.userProfile.masteryLevels[topicId],
                difficulty: newLevel,
                lastAdjusted: new Date().toISOString()
            };
            this.saveUserProfile();
        }

        return newLevel;
    }

    // Mastery Tracking
    updateMasteryLevel(topicId, score, confidence) {
        this.masteryTracker.updateMastery(topicId, score, confidence);
        this.userProfile.masteryLevels[topicId] = this.masteryTracker.getMasteryLevel(topicId);
        this.saveUserProfile();
    }

    getMasteryProgress() {
        return this.masteryTracker.getOverallProgress();
    }

    // AI Learning Path Recommendations
    getRecommendedLearningPath() {
        return this.aiRecommender.generateRecommendation(this.userProfile);
    }

    // Dashboard Updates
    updateDashboard() {
        this.updatePerformanceMetrics();
        this.updateRecommendations();
        this.updateProgressVisualizations();
    }

    updatePerformanceMetrics() {
        const history = this.userProfile.studyHistory;
        if (history.length === 0) return;

        const recentHistory = history.slice(-10);
        const scores = recentHistory.map(record => record.score);
        const studyTimes = recentHistory.map(record => record.duration || 0);

        this.userProfile.performanceMetrics = {
            averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
            totalStudyTime: studyTimes.reduce((sum, time) => sum + time, 0),
            completedTopics: this.countCompletedTopics(),
            streakDays: this.calculateStreakDays(),
            improvementRate: this.calculateImprovementRate(history)
        };

        this.saveUserProfile();
    }

    countCompletedTopics() {
        return Object.keys(this.userProfile.masteryLevels).length;
    }

    calculateStreakDays() {
        const history = this.userProfile.studyHistory;
        if (history.length === 0) return 0;

        let streak = 0;
        const today = new Date().toDateString();
        let currentDate = new Date();

        for (let i = 0; i < 30; i++) { // Check last 30 days
            const dateStr = currentDate.toDateString();
            const hasStudySession = history.some(record => 
                new Date(record.timestamp).toDateString() === dateStr
            );

            if (hasStudySession) {
                streak++;
            } else {
                break;
            }

            currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
    }

    calculateImprovementRate(history) {
        if (history.length < 10) return 0;

        const recentScores = history.slice(-5).map(h => h.score);
        const olderScores = history.slice(-10, -5).map(h => h.score);

        const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
        const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length;

        return ((recentAvg - olderAvg) / olderAvg) * 100;
    }

    updateRecommendations() {
        const recommendations = {
            nextTopics: this.getNextRecommendedTopics(),
            studyTips: this.generateStudyTips(),
            timeManagement: this.getTimeManagementSuggestions(),
            motivation: this.getMotivationalMessages()
        };

        this.userProfile.recommendations = recommendations;
        this.saveUserProfile();
    }

    getNextRecommendedTopics() {
        const weaknesses = this.detectWeaknesses();
        const strengths = this.analyzeStrengths();
        const currentPlan = this.userProfile.currentStudyPlan;

        // Prioritize weak topics
        const weakTopics = Object.values(weaknesses)
            .sort((a, b) => a.averageScore - b.averageScore)
            .slice(0, 3);

        // Add some strength reinforcement
        const strongTopics = Object.values(strengths)
            .sort((a, b) => b.averageScore - a.averageScore)
            .slice(0, 1);

        return [...weakTopics, ...strongTopics].map(topic => ({
            subject: topic.subject,
            chapter: topic.chapter,
            reason: topic.averageScore < 60 ? 'needs_improvement' : 'reinforce_strength',
            estimatedTime: this.learningData.topics[topic.subject]?.[topic.chapter]?.estimatedTime || 120
        }));
    }

    generateStudyTips() {
        const tips = [];
        const performance = this.userProfile.performanceMetrics;

        if (performance.averageScore < 70) {
            tips.push('Focus on understanding fundamental concepts before moving to advanced topics');
            tips.push('Practice regularly with shorter, more frequent study sessions');
            tips.push('Review your mistakes and understand why you got them wrong');
        } else if (performance.averageScore < 85) {
            tips.push('Work on time management during practice tests');
            tips.push('Focus on application-based questions and real-world problems');
            tips.push('Teach concepts to others to reinforce your understanding');
        } else {
            tips.push('Challenge yourself with advanced problems and competitions');
            tips.push('Help other students to deepen your knowledge');
            tips.push('Focus on exam-specific strategies and time management');
        }

        return tips;
    }

    getTimeManagementSuggestions() {
        const suggestions = [];
        const studyTime = this.userProfile.performanceMetrics.totalStudyTime;
        const goals = this.userProfile.goals;

        if (studyTime < goals.studyHoursPerDay * 60) {
            suggestions.push('Try to maintain consistent study hours each day');
            suggestions.push('Break down study sessions into smaller, manageable chunks');
            suggestions.push('Use the Pomodoro technique: 25 minutes study, 5 minutes break');
        } else {
            suggestions.push('Great job maintaining study consistency!');
            suggestions.push('Consider adding short review sessions throughout the day');
            suggestions.push('Use your study time efficiently by focusing on weak areas');
        }

        return suggestions;
    }

    getMotivationalMessages() {
        const messages = [
            'Every expert was once a beginner. Keep going!',
            'Your progress is impressive. You\'re getting better every day!',
            'Success is not final, failure is not fatal. It\'s the courage to continue that counts.',
            'You have the power to achieve your goals. Believe in yourself!',
            'Small progress is still progress. Celebrate every step forward!'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    updateProgressVisualizations() {
        // This would update charts and progress bars in the UI
        this.triggerUIUpdate('progressVisualizations', {
            masteryProgress: this.getMasteryProgress(),
            performanceMetrics: this.userProfile.performanceMetrics,
            studyPlan: this.userProfile.currentStudyPlan
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Listen for study session completion
        document.addEventListener('studySessionCompleted', (e) => {
            this.recordStudySession(e.detail);
        });

        // Listen for quiz completion
        document.addEventListener('quizCompleted', (e) => {
            this.recordQuizResult(e.detail);
        });

        // Listen for profile updates
        document.addEventListener('profileUpdated', (e) => {
            this.updateUserProfile(e.detail);
        });
    }

    recordStudySession(sessionData) {
        const session = {
            id: 'session_' + Date.now(),
            timestamp: new Date().toISOString(),
            subject: sessionData.subject,
            chapter: sessionData.chapter,
            topic: sessionData.topic,
            duration: sessionData.duration,
            activities: sessionData.activities,
            learningStyle: this.userProfile.learningStyle
        };

        this.userProfile.studyHistory.push(session);
        this.saveUserProfile();
        this.updateDashboard();
    }

    recordQuizResult(quizData) {
        const result = {
            id: 'quiz_' + Date.now(),
            timestamp: new Date().toISOString(),
            subject: quizData.subject,
            chapter: quizData.chapter,
            topic: quizData.topic,
            score: quizData.score,
            totalQuestions: quizData.totalQuestions,
            correctAnswers: quizData.correctAnswers,
            timeTaken: quizData.timeTaken,
            difficulty: quizData.difficulty
        };

        this.userProfile.studyHistory.push(result);
        this.updateMasteryLevel(`${quizData.subject}_${quizData.chapter}`, quizData.score, quizData.confidence || 0.5);
        this.adjustDifficulty(`${quizData.subject}_${quizData.chapter}`, { averageScore: quizData.score });
        this.saveUserProfile();
        this.updateDashboard();
    }

    updateUserProfile(updates) {
        this.userProfile = { ...this.userProfile, ...updates };
        this.saveUserProfile();
        this.updateDashboard();
    }

    // UI Integration
    triggerUIUpdate(eventType, data) {
        const event = new CustomEvent('personalizedLearningUpdate', {
            detail: { type: eventType, data }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getPersonalizedRecommendations() {
        return {
            learningPath: this.getRecommendedLearningPath(),
            weaknesses: this.detectWeaknesses(),
            strengths: this.analyzeStrengths(),
            studyPlan: this.generateCustomStudyPlan(),
            nextReviews: this.getNextReviewItems(),
            recommendations: this.userProfile.recommendations
        };
    }

    initializeLearningProfile() {
        if (!this.userProfile.learningStyle) {
            this.detectLearningStyle();
        }
        if (!this.userProfile.currentStudyPlan) {
            this.generateCustomStudyPlan();
        }
        this.setupSpacedRepetition();
    }

    detectLearningStyle() {
        // Simple learning style detection based on user preferences
        // In a real implementation, this would be based on user behavior analysis
        const learningStyles = ['visual', 'auditory', 'kinesthetic'];
        this.userProfile.learningStyle = learningStyles[Math.floor(Math.random() * learningStyles.length)];
        this.saveUserProfile();
    }
}

// Spaced Repetition System
class SpacedRepetitionSystem {
    constructor() {
        this.intervals = [1, 3, 7, 14, 30, 90, 180]; // Days between reviews
        this.schedule = {};
    }

    initializeSchedule(masteryLevels) {
        Object.keys(masteryLevels).forEach(topicId => {
            this.schedule[topicId] = {
                level: 0,
                nextReview: new Date(),
                lastReviewed: null
            };
        });
    }

    getDueItems() {
        const now = new Date();
        const dueItems = [];

        Object.keys(this.schedule).forEach(topicId => {
            const item = this.schedule[topicId];
            if (item.nextReview <= now) {
                dueItems.push({
                    topicId,
                    level: item.level,
                    daysOverdue: Math.floor((now - item.nextReview) / (1000 * 60 * 60 * 24))
                });
            }
        });

        return dueItems.sort((a, b) => b.daysOverdue - a.daysOverdue);
    }

    updateSchedule(topicId, performance) {
        const item = this.schedule[topicId];
        if (!item) return;

        if (performance >= 0.8) {
            // Good performance - increase interval
            item.level = Math.min(item.level + 1, this.intervals.length - 1);
        } else if (performance < 0.6) {
            // Poor performance - decrease interval
            item.level = Math.max(item.level - 1, 0);
        }

        const daysToAdd = this.intervals[item.level];
        item.nextReview = new Date();
        item.nextReview.setDate(item.nextReview.getDate() + daysToAdd);
        item.lastReviewed = new Date();
    }
}

// Mastery Tracking System
class MasteryTrackingSystem {
    constructor() {
        this.masteryLevels = {};
        this.thresholds = {
            beginner: 0.3,
            intermediate: 0.6,
            advanced: 0.8,
            expert: 0.95
        };
    }

    updateMastery(topicId, score, confidence) {
        const normalizedScore = score / 100;
        const masteryScore = (normalizedScore * 0.7) + (confidence * 0.3);

        if (!this.masteryLevels[topicId]) {
            this.masteryLevels[topicId] = {
                score: 0,
                attempts: 0,
                lastUpdated: null
            };
        }

        const mastery = this.masteryLevels[topicId];
        mastery.attempts++;
        mastery.score = (mastery.score * (mastery.attempts - 1) + masteryScore) / mastery.attempts;
        mastery.lastUpdated = new Date().toISOString();
    }

    getMasteryLevel(topicId) {
        const mastery = this.masteryLevels[topicId];
        if (!mastery) return { level: 'beginner', score: 0, confidence: 0 };

        let level = 'beginner';
        if (mastery.score >= this.thresholds.expert) level = 'expert';
        else if (mastery.score >= this.thresholds.advanced) level = 'advanced';
        else if (mastery.score >= this.thresholds.intermediate) level = 'intermediate';

        return {
            level,
            score: mastery.score,
            confidence: this.calculateConfidence(mastery.attempts),
            attempts: mastery.attempts,
            lastUpdated: mastery.lastUpdated
        };
    }

    calculateConfidence(attempts) {
        return Math.min(1, attempts / 10); // More attempts = higher confidence
    }

    getOverallProgress() {
        const topics = Object.keys(this.masteryLevels);
        if (topics.length === 0) return { overall: 0, byLevel: {} };

        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const byLevel = {};

        levels.forEach(level => {
            byLevel[level] = 0;
        });

        let totalScore = 0;
        topics.forEach(topicId => {
            const mastery = this.getMasteryLevel(topicId);
            totalScore += mastery.score;
            byLevel[mastery.level]++;
        });

        return {
            overall: totalScore / topics.length,
            byLevel,
            totalTopics: topics.length
        };
    }
}

// AI Recommendation Engine
class AIRecommendationEngine {
    generateRecommendation(userProfile) {
        const weaknesses = Object.values(userProfile.weaknesses || {});
        const strengths = Object.values(userProfile.strengths || {});
        const performance = userProfile.performanceMetrics;

        // Analyze learning patterns
        const learningPatterns = this.analyzeLearningPatterns(userProfile.studyHistory);
        
        // Generate personalized recommendations
        const recommendations = {
            primaryFocus: this.getPrimaryFocus(weaknesses, performance),
            learningPath: this.getOptimalLearningPath(weaknesses, strengths, learningPatterns),
            studyStrategy: this.getStudyStrategy(learningPatterns, userProfile.learningStyle),
            timeAllocation: this.getTimeAllocation(weaknesses, performance),
            nextSteps: this.getNextSteps(userProfile)
        };

        return recommendations;
    }

    analyzeLearningPatterns(studyHistory) {
        if (studyHistory.length === 0) return {};

        const patterns = {
            preferredTime: this.findPreferredStudyTime(studyHistory),
            sessionDuration: this.calculateAverageSessionDuration(studyHistory),
            subjectPerformance: this.analyzeSubjectPerformance(studyHistory),
            improvementRate: this.calculateImprovementRate(studyHistory)
        };

        return patterns;
    }

    findPreferredStudyTime(history) {
        const timeSlots = history.map(record => {
            const hour = new Date(record.timestamp).getHours();
            if (hour < 12) return 'morning';
            if (hour < 17) return 'afternoon';
            return 'evening';
        });

        const counts = { morning: 0, afternoon: 0, evening: 0 };
        timeSlots.forEach(slot => counts[slot]++);

        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    calculateAverageSessionDuration(history) {
        const sessions = history.filter(record => record.duration);
        if (sessions.length === 0) return 30;

        const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
        return Math.round(totalDuration / sessions.length);
    }

    analyzeSubjectPerformance(history) {
        const subjectScores = {};
        
        history.forEach(record => {
            if (!subjectScores[record.subject]) {
                subjectScores[record.subject] = [];
            }
            subjectScores[record.subject].push(record.score);
        });

        Object.keys(subjectScores).forEach(subject => {
            const scores = subjectScores[subject];
            subjectScores[subject] = {
                average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
                count: scores.length,
                trend: this.calculateTrend(scores)
            };
        });

        return subjectScores;
    }

    calculateTrend(scores) {
        if (scores.length < 2) return 'stable';

        const recent = scores.slice(-3);
        const older = scores.slice(0, -3);

        if (older.length === 0) return 'stable';

        const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
        const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;

        if (recentAvg > olderAvg + 5) return 'improving';
        if (recentAvg < olderAvg - 5) return 'declining';
        return 'stable';
    }

    calculateImprovementRate(history) {
        if (history.length < 10) return 0;

        const recentScores = history.slice(-5).map(h => h.score);
        const olderScores = history.slice(-10, -5).map(h => h.score);

        const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
        const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length;

        return ((recentAvg - olderAvg) / olderAvg) * 100;
    }

    getPrimaryFocus(weaknesses, performance) {
        if (weaknesses.length === 0) return 'maintain_strengths';

        const weakestTopic = weaknesses.sort((a, b) => a.averageScore - b.averageScore)[0];
        
        return {
            subject: weakestTopic.subject,
            chapter: weakestTopic.chapter,
            reason: 'lowest_performance',
            targetScore: Math.min(85, weakestTopic.averageScore + 25),
            estimatedTime: 120
        };
    }

    getOptimalLearningPath(weaknesses, strengths, patterns) {
        const path = [];
        
        // Start with weakest areas
        weaknesses.slice(0, 3).forEach(weakness => {
            path.push({
                type: 'remedial',
                subject: weakness.subject,
                chapter: weakness.chapter,
                focus: 'fundamentals',
                duration: 60
            });
        });

        // Add strength reinforcement
        strengths.slice(0, 1).forEach(strength => {
            path.push({
                type: 'reinforcement',
                subject: strength.subject,
                chapter: strength.chapter,
                focus: 'advanced_applications',
                duration: 45
            });
        });

        return path;
    }

    getStudyStrategy(patterns, learningStyle) {
        const strategies = {
            visual: {
                primary: 'Use diagrams, charts, and visual aids',
                secondary: 'Create mind maps and color-coded notes',
                tertiary: 'Watch educational videos and animations'
            },
            auditory: {
                primary: 'Listen to explanations and discussions',
                secondary: 'Read aloud and explain concepts to others',
                tertiary: 'Use audio recordings and podcasts'
            },
            kinesthetic: {
                primary: 'Practice with hands-on activities',
                secondary: 'Use physical objects and models',
                tertiary: 'Take frequent breaks and move around'
            }
        };

        return strategies[learningStyle] || strategies.visual;
    }

    getTimeAllocation(weaknesses, performance) {
        const totalTime = 120; // 2 hours
        const allocations = {};

        if (weaknesses.length > 0) {
            // Allocate more time to weak areas
            const weakTime = Math.floor(totalTime * 0.6);
            weaknesses.slice(0, 2).forEach((weakness, index) => {
                allocations[`${weakness.subject}_${weakness.chapter}`] = Math.floor(weakTime / 2);
            });

            // Allocate remaining time to general practice
            allocations.general_practice = totalTime - weakTime;
        } else {
            // If no weaknesses, focus on advanced topics
            allocations.advanced_topics = Math.floor(totalTime * 0.7);
            allocations.review = totalTime - allocations.advanced_topics;
        }

        return allocations;
    }

    getNextSteps(userProfile) {
        const steps = [];

        if (userProfile.performanceMetrics.averageScore < 70) {
            steps.push('Focus on fundamental concepts and basic problem-solving');
            steps.push('Practice with easier questions to build confidence');
            steps.push('Review and understand your mistakes thoroughly');
        } else if (userProfile.performanceMetrics.averageScore < 85) {
            steps.push('Work on time management and exam strategies');
            steps.push('Practice with medium to hard difficulty questions');
            steps.push('Focus on application-based problems');
        } else {
            steps.push('Challenge yourself with advanced and competition-level questions');
            steps.push('Help other students to reinforce your knowledge');
            steps.push('Focus on exam-specific preparation and strategies');
        }

        return steps;
    }
}

// Initialize Personalized Learning System
document.addEventListener('DOMContentLoaded', () => {
    window.personalizedLearning = new PersonalizedLearningSystem();
}); 