// Enhanced Quiz System with AI Integration
class EnhancedQuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.userAnswers = {};
        this.quizHistory = [];
        this.flashcards = [];
        this.adaptiveData = {};
        this.init();
    }

    init() {
        this.loadQuizHistory();
        this.loadAdaptiveData();
        this.setupEventListeners();
    }

    loadQuizHistory() {
        const saved = localStorage.getItem('quizHistory');
        if (saved) {
            this.quizHistory = JSON.parse(saved);
        }
    }

    loadAdaptiveData() {
        const saved = localStorage.getItem('adaptiveData');
        if (saved) {
            this.adaptiveData = JSON.parse(saved);
        }
    }

    saveQuizHistory() {
        localStorage.setItem('quizHistory', JSON.stringify(this.quizHistory));
    }

    saveAdaptiveData() {
        localStorage.setItem('adaptiveData', JSON.stringify(this.adaptiveData));
    }

    setupEventListeners() {
        // Quiz submission
        document.addEventListener('click', (e) => {
            if (e.target.id === 'submitQuiz') {
                this.submitQuiz();
            } else if (e.target.id === 'generateAIQuiz') {
                this.generateAIQuiz();
            } else if (e.target.id === 'enhanceAnswer') {
                this.enhanceAnswer();
            }
        });

        // Question type changes
        document.addEventListener('change', (e) => {
            if (e.target.name === 'questionType') {
                this.handleQuestionTypeChange(e.target.value);
            }
        });
    }

    // Generate AI-powered quiz
    async generateAIQuiz(chapterContent, subject, chapterName) {
        if (!window.aiIntegration || !window.aiIntegration.isAvailable()) {
            this.showNotification('AI not available. Please set API key.', 'warning');
            return;
        }

        try {
            const quizData = await window.aiIntegration.generateQuizQuestions(
                chapterContent, subject, chapterName
            );
            
            this.currentQuiz = {
                id: Date.now(),
                subject: subject,
                chapter: chapterName,
                questions: quizData.questions,
                generatedBy: 'AI',
                timestamp: new Date()
            };

            this.renderQuiz();
        } catch (error) {
            console.error('Failed to generate AI quiz:', error);
            this.showNotification('Failed to generate AI quiz. Using fallback questions.', 'error');
            this.generateFallbackQuiz(subject, chapterName);
        }
    }

    generateFallbackQuiz(subject, chapterName) {
        this.currentQuiz = {
            id: Date.now(),
            subject: subject,
            chapter: chapterName,
            questions: this.getFallbackQuestions(subject, chapterName),
            generatedBy: 'Fallback',
            timestamp: new Date()
        };
        this.renderQuiz();
    }

    getFallbackQuestions(subject, chapterName) {
        const questionTemplates = {
            'Mathematics': [
                {
                    type: 'multiple_choice',
                    difficulty: 'easy',
                    question: `What is the main concept in ${chapterName}?`,
                    options: ['Basic operations', 'Advanced calculations', 'Problem solving', 'All of the above'],
                    correct_answer: 'D',
                    explanation: 'This chapter covers various mathematical concepts.'
                }
            ],
            'Science': [
                {
                    type: 'true_false',
                    difficulty: 'medium',
                    question: `${chapterName} is an important topic in science.`,
                    options: ['True', 'False'],
                    correct_answer: 'A',
                    explanation: 'This is a fundamental concept in science.'
                }
            ]
        };

        return questionTemplates[subject] || questionTemplates['Mathematics'];
    }

    renderQuiz() {
        const quizContainer = document.getElementById('quizContainer');
        if (!quizContainer || !this.currentQuiz) return;

        quizContainer.innerHTML = `
            <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h3 class="text-2xl font-bold mb-2">${this.currentQuiz.subject} - ${this.currentQuiz.chapter}</h3>
                        <p class="text-primary-100">${this.currentQuiz.questions.length} questions • AI Generated</p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold" id="quizScore">0/${this.currentQuiz.questions.length}</div>
                        <div class="text-sm text-primary-100">Score</div>
                    </div>
                </div>
                
                <div class="space-y-6" id="quizQuestions">
                    ${this.currentQuiz.questions.map((question, index) => this.renderQuestion(question, index)).join('')}
                </div>
                
                <div class="mt-8 flex space-x-4">
                    <button id="submitQuiz" class="flex-1 bg-white hover:bg-gray-100 text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-check mr-2"></i>
                        Submit Quiz
                    </button>
                    <button id="enhanceAnswer" class="flex-1 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-magic mr-2"></i>
                        Enhance Answers
                    </button>
                </div>
            </div>
        `;
    }

    renderQuestion(question, index) {
        const questionTypes = {
            'multiple_choice': this.renderMultipleChoice,
            'true_false': this.renderTrueFalse,
            'fill_blank': this.renderFillBlank,
            'short_answer': this.renderShortAnswer
        };

        const renderFunction = questionTypes[question.type] || questionTypes['multiple_choice'];
        return renderFunction.call(this, question, index);
    }

    renderMultipleChoice(question, index) {
        return `
            <div class="bg-white bg-opacity-10 rounded-lg p-6" data-question-id="${question.id}">
                <div class="flex items-start justify-between mb-4">
                    <h5 class="text-lg font-semibold">Question ${index + 1}</h5>
                    <span class="px-2 py-1 bg-white bg-opacity-20 rounded text-sm">${question.difficulty}</span>
                </div>
                
                <p class="text-lg mb-4">${question.question}</p>
                
                <div class="space-y-3">
                    ${question.options.map((option, optionIndex) => `
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" 
                                   name="question_${question.id}" 
                                   value="${String.fromCharCode(65 + optionIndex)}"
                                   class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500">
                            <span class="text-lg">${String.fromCharCode(65 + optionIndex)}. ${option}</span>
                        </label>
                    `).join('')}
                </div>
                
                <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg hidden" id="explanation_${question.id}">
                    <div class="font-semibold mb-2">Explanation:</div>
                    <p class="text-sm">${question.explanation}</p>
                </div>
            </div>
        `;
    }

    renderTrueFalse(question, index) {
        return `
            <div class="bg-white bg-opacity-10 rounded-lg p-6" data-question-id="${question.id}">
                <div class="flex items-start justify-between mb-4">
                    <h5 class="text-lg font-semibold">Question ${index + 1}</h5>
                    <span class="px-2 py-1 bg-white bg-opacity-20 rounded text-sm">${question.difficulty}</span>
                </div>
                
                <p class="text-lg mb-4">${question.question}</p>
                
                <div class="space-y-3">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="question_${question.id}" value="A" class="w-4 h-4 text-primary-600">
                        <span class="text-lg">True</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="question_${question.id}" value="B" class="w-4 h-4 text-primary-600">
                        <span class="text-lg">False</span>
                    </label>
                </div>
                
                <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg hidden" id="explanation_${question.id}">
                    <div class="font-semibold mb-2">Explanation:</div>
                    <p class="text-sm">${question.explanation}</p>
                </div>
            </div>
        `;
    }

    renderFillBlank(question, index) {
        return `
            <div class="bg-white bg-opacity-10 rounded-lg p-6" data-question-id="${question.id}">
                <div class="flex items-start justify-between mb-4">
                    <h5 class="text-lg font-semibold">Question ${index + 1}</h5>
                    <span class="px-2 py-1 bg-white bg-opacity-20 rounded text-sm">${question.difficulty}</span>
                </div>
                
                <p class="text-lg mb-4">${question.question}</p>
                
                <input type="text" 
                       name="question_${question.id}" 
                       placeholder="Enter your answer..."
                       class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white">
                
                <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg hidden" id="explanation_${question.id}">
                    <div class="font-semibold mb-2">Correct Answer:</div>
                    <p class="text-sm">${question.correct_answer}</p>
                    <div class="font-semibold mb-2 mt-3">Explanation:</div>
                    <p class="text-sm">${question.explanation}</p>
                </div>
            </div>
        `;
    }

    renderShortAnswer(question, index) {
        return `
            <div class="bg-white bg-opacity-10 rounded-lg p-6" data-question-id="${question.id}">
                <div class="flex items-start justify-between mb-4">
                    <h5 class="text-lg font-semibold">Question ${index + 1}</h5>
                    <span class="px-2 py-1 bg-white bg-opacity-20 rounded text-sm">${question.difficulty}</span>
                </div>
                
                <p class="text-lg mb-4">${question.question}</p>
                
                <textarea name="question_${question.id}" 
                          placeholder="Write your answer here..."
                          rows="4"
                          class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white resize-none"></textarea>
                
                <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg hidden" id="explanation_${question.id}">
                    <div class="font-semibold mb-2">Sample Answer:</div>
                    <p class="text-sm">${question.correct_answer}</p>
                    <div class="font-semibold mb-2 mt-3">Explanation:</div>
                    <p class="text-sm">${question.explanation}</p>
                </div>
            </div>
        `;
    }

    submitQuiz() {
        if (!this.currentQuiz) return;

        const answers = {};
        let correctAnswers = 0;

        this.currentQuiz.questions.forEach(question => {
            const answer = this.getAnswerForQuestion(question);
            answers[question.id] = answer;
            
            if (this.isAnswerCorrect(question, answer)) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / this.currentQuiz.questions.length) * 100);
        
        // Update adaptive data
        this.updateAdaptiveData(score, this.currentQuiz.subject);
        
        // Save to history
        this.quizHistory.push({
            ...this.currentQuiz,
            userAnswers: answers,
            score: score,
            completedAt: new Date()
        });
        
        this.saveQuizHistory();
        
        // Show results
        this.showQuizResults(score, this.currentQuiz.questions.length, this.currentQuiz.timestamp - this.currentQuiz.timestamp, this.currentQuiz.questions, answers);
        
        // Award XP
        if (window.app && window.app.awardXP) {
            window.app.awardXP(score);
        }
    }

    getAnswerForQuestion(question) {
        const input = document.querySelector(`[name="question_${question.id}"]`);
        if (!input) return null;

        if (question.type === 'multiple_choice' || question.type === 'true_false') {
            return input.value;
        } else {
            return input.value.trim();
        }
    }

    isAnswerCorrect(question, userAnswer) {
        if (!userAnswer) return false;

        if (question.type === 'multiple_choice' || question.type === 'true_false') {
            return userAnswer === question.correct_answer;
        } else {
            // For fill-in-the-blank and short answer, do fuzzy matching
            const correct = question.correct_answer.toLowerCase();
            const user = userAnswer.toLowerCase();
            return correct.includes(user) || user.includes(correct);
        }
    }

    updateAdaptiveData(score, subject) {
        if (!this.adaptiveData[subject]) {
            this.adaptiveData[subject] = {
                scores: [],
                averageScore: 0,
                totalQuizzes: 0
            };
        }

        this.adaptiveData[subject].scores.push(score);
        this.adaptiveData[subject].totalQuizzes++;
        this.adaptiveData[subject].averageScore = 
            this.adaptiveData[subject].scores.reduce((a, b) => a + b, 0) / this.adaptiveData[subject].scores.length;

        this.saveAdaptiveData();
    }

    showQuizResults(score, totalQuestions, timeTaken, questions, userAnswers) {
        const percentage = Math.round((score / totalQuestions) * 100);
        const timeInMinutes = Math.round(timeTaken / 60);
        
        // Award points based on performance
        const basePoints = 10;
        const accuracyBonus = Math.round(percentage / 10) * 5;
        const speedBonus = timeInMinutes < 10 ? 10 : 0;
        const totalPoints = basePoints + accuracyBonus + speedBonus;
        
        // Update user progress
        this.updateUserProgress(score, totalQuestions, totalPoints);
        
        // Track learning velocity if available
        if (window.learningVelocity) {
            window.learningVelocity.recordTopicCompletion(this.currentSubject, this.currentChapter, timeInMinutes);
        }
        
        // Track retention analysis if available
        if (window.retentionAnalysis) {
            const topicId = `${this.currentSubject}_${this.currentChapter}`;
            const topicName = `${this.currentSubject} - ${this.currentChapter}`;
            
            // Create retention test
            const retentionQuestions = questions.map(q => ({
                question: q.question,
                correctAnswer: q.correct_answer,
                options: q.options
            }));
            
            const testId = window.retentionAnalysis.createRetentionTest(
                topicId, 
                topicName, 
                this.currentSubject, 
                retentionQuestions
            );
            
            // Take retention test with user answers
            const retentionRate = window.retentionAnalysis.takeRetentionTest(testId, userAnswers);
            
            // Start study session tracking
            const sessionId = window.retentionAnalysis.startStudySession(
                topicId, 
                topicName, 
                this.currentSubject
            );
            
            // End study session with focus level based on performance
            const focusLevel = percentage >= 80 ? 100 : percentage >= 60 ? 75 : 50;
            window.retentionAnalysis.endStudySession(sessionId, focusLevel);
        }

        const modalContent = `
            <div class="p-6 max-w-2xl">
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-20 h-20 ${percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'} rounded-full mb-4">
                        <i class="fas fa-${percentage >= 80 ? 'trophy' : percentage >= 60 ? 'star' : 'times'} text-3xl ${percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h3>
                    <p class="text-gray-600 dark:text-gray-400">Great job completing the quiz</p>
                </div>

                <!-- Performance Summary -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${percentage}%</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Score</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${score}/${totalQuestions}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                    </div>
                    <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">${timeInMinutes}m</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Time</div>
                    </div>
                    <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">+${totalPoints}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Points</div>
                    </div>
                </div>

                <!-- Retention Analysis -->
                ${window.retentionAnalysis ? `
                    <div class="mb-6 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <i class="fas fa-brain text-teal-600 dark:text-teal-400"></i>
                            <h4 class="font-semibold text-teal-800 dark:text-teal-200">Retention Analysis</h4>
                        </div>
                        <p class="text-sm text-teal-700 dark:text-teal-300">
                            Your knowledge retention for this topic has been tracked. 
                            Check the Retention Analysis dashboard to see your learning patterns and optimal study times.
                        </p>
                    </div>
                ` : ''}

                <!-- Learning Velocity -->
                ${window.learningVelocity ? `
                    <div class="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                        <div class="flex items-center space-x-3 mb-2">
                            <i class="fas fa-tachometer-alt text-indigo-600 dark:text-indigo-400"></i>
                            <h4 class="font-semibold text-indigo-800 dark:text-indigo-200">Learning Velocity</h4>
                        </div>
                        <p class="text-sm text-indigo-700 dark:text-indigo-300">
                            Your learning speed for this topic has been recorded. 
                            Track your progress in the Learning Velocity dashboard.
                        </p>
                    </div>
                ` : ''}

                <!-- Performance Insights -->
                <div class="mb-6">
                    <h4 class="font-semibold mb-3">Performance Insights</h4>
                    <div class="space-y-2">
                        ${this.getPerformanceInsights(percentage, timeInMinutes, score, totalQuestions)}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3">
                    <button id="reviewQuizBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-eye"></i>
                        <span>Review Answers</span>
                    </button>
                    <button id="retakeQuizBtn" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-redo"></i>
                        <span>Retake Quiz</span>
                    </button>
                    <button id="nextChapterBtn" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                        <i class="fas fa-arrow-right"></i>
                        <span>Next Chapter</span>
                    </button>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupResultButtons(questions, userAnswers);
    }

    retakeQuiz() {
        this.currentQuiz = null;
        this.userAnswers = {};
        this.renderQuiz();
    }

    showReview(questions, userAnswers) {
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <h3 class="text-xl font-bold mb-4">Quiz Review</h3>
                <div class="space-y-4">
                    ${questions.map((question, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === question.correct_answer;
            
            return `
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}">
                                <div class="flex items-start space-x-3">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-${isCorrect ? 'check' : 'times'} text-${isCorrect ? 'green' : 'red'}-500 text-xl mt-1"></i>
                    </div>
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Question ${index + 1}</h4>
                                        <p class="text-gray-700 dark:text-gray-300 mb-3">${question.question}</p>
                    
                    <div class="space-y-2">
                                            ${question.options.map(option => {
                                                const isUserChoice = option === userAnswer;
                                                const isCorrectAnswer = option === question.correct_answer;
                                                let optionClass = 'p-2 rounded border';
                                                
                                                if (isCorrectAnswer) {
                                                    optionClass += ' bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
                                                } else if (isUserChoice && !isCorrect) {
                                                    optionClass += ' bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
                                                } else {
                                                    optionClass += ' bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
                                                }
                                                
                                                return `
                                                    <div class="${optionClass}">
                                                        <span class="text-sm">${option}</span>
                                                        ${isCorrectAnswer ? '<i class="fas fa-check text-green-500 ml-2"></i>' : ''}
                                                        ${isUserChoice && !isCorrect ? '<i class="fas fa-times text-red-500 ml-2"></i>' : ''}
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                    </div>
                    </div>
                </div>
            `;
                    }).join('')}
                </div>
            </div>
        `;
        
        window.app.showModal(modalContent);
    }

    async enhanceAnswer() {
        if (!window.aiIntegration || !window.aiIntegration.isAvailable()) {
            this.showNotification('AI not available for answer enhancement.', 'warning');
            return;
        }

        // Enhance the current question's answer using AI
        const currentQuestion = this.currentQuiz.questions[0]; // For demo, enhance first question
        if (!currentQuestion) return;

        try {
            const enhanced = await window.aiIntegration.enhanceAnswer(
                currentQuestion.explanation,
                currentQuestion.question,
                this.currentQuiz.subject
            );

            this.showEnhancedAnswer(enhanced);
        } catch (error) {
            console.error('Failed to enhance answer:', error);
            this.showNotification('Failed to enhance answer.', 'error');
        }
    }

    showEnhancedAnswer(enhanced) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Enhanced Answer</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold mb-2">Detailed Explanation:</h4>
                        <p class="text-gray-700 dark:text-gray-300">${enhanced.enhanced_answer}</p>
                    </div>
                    
                    ${enhanced.examples.length > 0 ? `
                        <div>
                            <h4 class="font-semibold mb-2">Examples:</h4>
                            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300">
                                ${enhanced.examples.map(example => `<li>${example}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${enhanced.step_by_step.length > 0 ? `
                        <div>
                            <h4 class="font-semibold mb-2">Step-by-Step:</h4>
                            <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300">
                                ${enhanced.step_by_step.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                    ` : ''}
                    
                    ${enhanced.practice_tips.length > 0 ? `
                        <div>
                            <h4 class="font-semibold mb-2">Practice Tips:</h4>
                            <ul class="list-disc list-inside text-gray-700 dark:text-gray-300">
                                ${enhanced.practice_tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'fixed w-2 h-2 bg-yellow-400 rounded-full pointer-events-none z-50';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                
                document.body.appendChild(confetti);
                
                gsap.to(confetti, {
                    y: window.innerHeight + 100,
                    x: Math.random() * 200 - 100,
                    rotation: Math.random() * 360,
                    duration: 3 + Math.random() * 2,
                    ease: 'power2.out',
                    onComplete: () => confetti.remove()
                });
            }, i * 100);
        }
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            warning: 'bg-yellow-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        gsap.fromTo(notification,
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 }
        );
        
        setTimeout(() => {
            gsap.to(notification, {
                x: 300,
                opacity: 0,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        }, 3000);
    }

    // Get adaptive suggestions
    getAdaptiveSuggestions(subject) {
        const data = this.adaptiveData[subject];
        if (!data) return null;

        const suggestions = {
            difficulty: data.averageScore > 80 ? 'hard' : data.averageScore > 60 ? 'medium' : 'easy',
            focusAreas: [],
            studyTips: []
        };

        if (data.averageScore < 70) {
            suggestions.focusAreas.push('Core concepts', 'Basic problem solving');
            suggestions.studyTips.push('Review fundamental concepts', 'Practice more basic problems');
        } else if (data.averageScore < 85) {
            suggestions.focusAreas.push('Advanced topics', 'Complex problem solving');
            suggestions.studyTips.push('Challenge yourself with harder problems', 'Focus on application');
        } else {
            suggestions.focusAreas.push('Mastery level topics', 'Creative problem solving');
            suggestions.studyTips.push('Teach others', 'Explore advanced concepts');
        }

        return suggestions;
    }

    getPerformanceInsights(percentage, timeInMinutes, score, totalQuestions) {
        const insights = [];
        
        if (percentage >= 90) {
            insights.push(`
                <div class="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <i class="fas fa-star"></i>
                    <span class="text-sm">Outstanding performance! You've mastered this topic.</span>
                </div>
            `);
        } else if (percentage >= 80) {
            insights.push(`
                <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <i class="fas fa-thumbs-up"></i>
                    <span class="text-sm">Great work! You have a solid understanding of this topic.</span>
                </div>
            `);
        } else if (percentage >= 60) {
            insights.push(`
                <div class="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                    <i class="fas fa-lightbulb"></i>
                    <span class="text-sm">Good effort! Review the material to improve your understanding.</span>
                </div>
            `);
        } else {
            insights.push(`
                <div class="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span class="text-sm">Keep studying! Focus on understanding the core concepts.</span>
                </div>
            `);
        }
        
        if (timeInMinutes < 5) {
            insights.push(`
                <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                    <i class="fas fa-bolt"></i>
                    <span class="text-sm">Excellent speed! You answered quickly and accurately.</span>
                </div>
            `);
        } else if (timeInMinutes > 15) {
            insights.push(`
                <div class="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                    <i class="fas fa-clock"></i>
                    <span class="text-sm">Take your time to ensure accuracy in future quizzes.</span>
                </div>
            `);
        }
        
        return insights.join('');
    }

    setupResultButtons(questions, userAnswers) {
        setTimeout(() => {
            const reviewBtn = document.getElementById('reviewQuizBtn');
            const retakeBtn = document.getElementById('retakeQuizBtn');
            const nextBtn = document.getElementById('nextChapterBtn');
            
            if (reviewBtn) {
                reviewBtn.addEventListener('click', () => {
                    this.showReview(questions, userAnswers);
                });
            }
            
            if (retakeBtn) {
                retakeBtn.addEventListener('click', () => {
                    this.retakeQuiz();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.nextChapter();
                });
            }
        }, 100);
    }

    updateUserProgress(score, totalQuestions, points) {
        // Update gamification system if available
        if (window.gamificationSystem) {
            window.gamificationSystem.addPoints(points);
            window.gamificationSystem.recordActivity('quiz_completed', {
                score: score,
                total: totalQuestions,
                points: points
            });
        }
    }

    nextChapter() {
        // Navigate to next chapter logic
        const currentChapterIndex = this.chapters.findIndex(ch => ch.title === this.currentChapter);
        if (currentChapterIndex < this.chapters.length - 1) {
            const nextChapter = this.chapters[currentChapterIndex + 1];
            this.loadChapter(nextChapter.title);
        } else {
            // Show completion message
            window.app.showModal(`
                <div class="p-6 text-center">
                    <i class="fas fa-trophy text-4xl text-yellow-500 mb-4"></i>
                    <h3 class="text-xl font-bold mb-2">Chapter Complete!</h3>
                    <p class="text-gray-600 dark:text-gray-400">You've completed all chapters in this subject.</p>
                </div>
            `);
        }
    }
}

// Initialize enhanced quiz system
window.enhancedQuizSystem = new EnhancedQuizSystem(); 