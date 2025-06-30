// Quiz System Management
class QuizManager {
    constructor() {
        this.currentQuiz = null;
        this.userAnswers = {};
        this.quizHistory = [];
        this.dailyQuizId = null;
        this.init();
    }

    init() {
        this.loadQuizHistory();
        this.generateDailyQuiz();
        this.renderDailyQuiz();
        this.setupEventListeners();
    }

    loadQuizHistory() {
        const saved = localStorage.getItem('quizHistory');
        if (saved) {
            this.quizHistory = JSON.parse(saved);
        }
    }

    saveQuizHistory() {
        localStorage.setItem('quizHistory', JSON.stringify(this.quizHistory));
    }

    generateDailyQuiz() {
        const today = new Date().toDateString();
        const existingQuiz = this.quizHistory.find(q => q.date === today);
        
        if (existingQuiz) {
            this.currentQuiz = existingQuiz;
            this.dailyQuizId = existingQuiz.id;
            return;
        }

        // Generate new daily quiz
        this.currentQuiz = {
            id: Date.now(),
            date: today,
            subject: this.getRandomSubject(),
            questions: this.generateQuestions(),
            timeLimit: 600, // 10 minutes
            totalQuestions: 5,
            completed: false,
            score: 0
        };

        this.dailyQuizId = this.currentQuiz.id;
    }

    getRandomSubject() {
        const subjects = ['Mathematics', 'Science', 'English', 'Nepali', 'Social Studies'];
        return subjects[Math.floor(Math.random() * subjects.length)];
    }

    generateQuestions() {
        const questions = [];
        const questionTemplates = this.getQuestionTemplates();

        for (let i = 0; i < 5; i++) {
            const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
            const question = this.generateQuestionFromTemplate(template, i + 1);
            questions.push(question);
        }

        return questions;
    }

    getQuestionTemplates() {
        return [
            {
                type: 'multiple_choice',
                subject: 'Mathematics',
                templates: [
                    {
                        question: 'What is the value of x in the equation 2x + 5 = 13?',
                        options: ['3', '4', '5', '6'],
                        correct: 1,
                        explanation: '2x + 5 = 13 → 2x = 8 → x = 4'
                    },
                    {
                        question: 'Find the area of a circle with radius 7 cm.',
                        options: ['154 cm²', '44 cm²', '22 cm²', '77 cm²'],
                        correct: 0,
                        explanation: 'Area = πr² = π × 7² = 49π ≈ 154 cm²'
                    },
                    {
                        question: 'Solve: 3x² - 12x + 9 = 0',
                        options: ['x = 1, 3', 'x = -1, -3', 'x = 1, -3', 'x = -1, 3'],
                        correct: 0,
                        explanation: '3x² - 12x + 9 = 0 → 3(x² - 4x + 3) = 0 → x = 1, 3'
                    }
                ]
            },
            {
                type: 'multiple_choice',
                subject: 'Science',
                templates: [
                    {
                        question: 'Which of the following is a chemical change?',
                        options: ['Melting ice', 'Boiling water', 'Burning paper', 'Breaking glass'],
                        correct: 2,
                        explanation: 'Burning paper produces new substances (ash and gases), making it a chemical change.'
                    },
                    {
                        question: 'What is the SI unit of force?',
                        options: ['Joule', 'Watt', 'Newton', 'Pascal'],
                        correct: 2,
                        explanation: 'The SI unit of force is Newton (N).'
                    },
                    {
                        question: 'Which gas is essential for photosynthesis?',
                        options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
                        correct: 1,
                        explanation: 'Carbon dioxide is essential for photosynthesis as it provides carbon for glucose production.'
                    }
                ]
            },
            {
                type: 'multiple_choice',
                subject: 'English',
                templates: [
                    {
                        question: 'Choose the correct form: "She _____ to school every day."',
                        options: ['go', 'goes', 'going', 'gone'],
                        correct: 1,
                        explanation: 'With singular third person (she), we use "goes" in present simple tense.'
                    },
                    {
                        question: 'Which word is a synonym for "happy"?',
                        options: ['Sad', 'Joyful', 'Angry', 'Tired'],
                        correct: 1,
                        explanation: '"Joyful" is a synonym for "happy" as both express positive emotions.'
                    },
                    {
                        question: 'Identify the part of speech for "quickly" in "He runs quickly."',
                        options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
                        correct: 3,
                        explanation: '"Quickly" modifies the verb "runs", making it an adverb.'
                    }
                ]
            },
            {
                type: 'multiple_choice',
                subject: 'Nepali',
                templates: [
                    {
                        question: '"म" को सर्वनाम कुन हो?',
                        options: ['पुरुषवाचक', 'निजवाचक', 'निश्चयवाचक', 'अनिश्चयवाचक'],
                        correct: 1,
                        explanation: '"म" निजवाचक सर्वनाम हो किनभने यसले बोल्ने व्यक्तिलाई जनाउँछ।'
                    },
                    {
                        question: 'कुन शब्द सङ्ख्यावाचक विशेषण हो?',
                        options: ['राम्रो', 'पाँच', 'सानो', 'ठूलो'],
                        correct: 1,
                        explanation: '"पाँच" सङ्ख्यावाचक विशेषण हो किनभने यसले सङ्ख्या जनाउँछ।'
                    },
                    {
                        question: '"रामले खाना खायो" मा कुन क्रिया हो?',
                        options: ['खाना', 'खायो', 'ले', 'राम'],
                        correct: 1,
                        explanation: '"खायो" क्रिया हो किनभने यसले कामको सूचना दिन्छ।'
                    }
                ]
            }
        ];

        return questionTemplates;
    }

    generateQuestionFromTemplate(template, questionNumber) {
        const subjectTemplates = template.templates;
        const selectedTemplate = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];
        
        return {
            id: questionNumber,
            type: template.type,
            subject: template.subject,
            question: selectedTemplate.question,
            options: selectedTemplate.options,
            correct: selectedTemplate.correct,
            explanation: selectedTemplate.explanation,
            userAnswer: null,
            isCorrect: false
        };
    }

    renderDailyQuiz() {
        const quizContainer = document.getElementById('quizContent');
        if (!quizContainer || !this.currentQuiz) return;

        quizContainer.innerHTML = `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h4 class="text-xl font-bold mb-2">${this.currentQuiz.subject} Quiz</h4>
                        <p class="text-primary-100">${this.currentQuiz.totalQuestions} questions • ${Math.floor(this.currentQuiz.timeLimit / 60)} minutes</p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold">${this.currentQuiz.score}/${this.currentQuiz.totalQuestions}</div>
                        <div class="text-sm text-primary-100">Score</div>
                    </div>
                </div>
                
                ${this.currentQuiz.completed ? this.renderQuizResults() : this.renderQuizQuestions()}
            </div>
        `;
    }

    renderQuizQuestions() {
        return `
            <div class="space-y-6">
                ${this.currentQuiz.questions.map((question, index) => this.renderQuestion(question, index)).join('')}
            </div>
            
            <div class="mt-8 flex space-x-4">
                <button id="submitQuiz" class="flex-1 bg-white hover:bg-gray-100 text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-check mr-2"></i>
                    Submit Quiz
                </button>
                <button id="resetQuiz" class="flex-1 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-redo mr-2"></i>
                    Reset
                </button>
            </div>
        `;
    }

    renderQuestion(question, index) {
        const isAnswered = question.userAnswer !== null;
        const isCorrect = question.isCorrect;
        
        return `
            <div class="bg-white bg-opacity-10 rounded-lg p-6 ${isAnswered ? (isCorrect ? 'border-2 border-green-400' : 'border-2 border-red-400') : ''}">
                <div class="flex items-start justify-between mb-4">
                    <h5 class="text-lg font-semibold">Question ${index + 1}</h5>
                    ${isAnswered ? `
                        <div class="flex items-center space-x-2">
                            ${isCorrect ? 
                                '<i class="fas fa-check-circle text-green-400"></i>' : 
                                '<i class="fas fa-times-circle text-red-400"></i>'
                            }
                        </div>
                    ` : ''}
                </div>
                
                <p class="text-lg mb-4">${question.question}</p>
                
                <div class="space-y-3">
                    ${question.options.map((option, optionIndex) => `
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" 
                                   name="question_${question.id}" 
                                   value="${optionIndex}"
                                   ${question.userAnswer === optionIndex ? 'checked' : ''}
                                   ${isAnswered ? 'disabled' : ''}
                                   class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500">
                            <span class="text-lg ${question.userAnswer === optionIndex ? 
                                (isCorrect ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold') : 
                                'text-white'}">${option}</span>
                        </label>
                    `).join('')}
                </div>
                
                ${isAnswered ? `
                    <div class="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                        <div class="font-semibold mb-2">Explanation:</div>
                        <p class="text-sm">${question.explanation}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderQuizResults() {
        const correctAnswers = this.currentQuiz.questions.filter(q => q.isCorrect).length;
        const percentage = (correctAnswers / this.currentQuiz.totalQuestions) * 100;
        
        let message = '';
        let color = '';
        
        if (percentage >= 80) {
            message = 'Excellent! You\'re a master!';
            color = 'text-green-400';
        } else if (percentage >= 60) {
            message = 'Good job! Keep practicing!';
            color = 'text-yellow-400';
        } else {
            message = 'Keep studying! You\'ll improve!';
            color = 'text-red-400';
        }

        return `
            <div class="text-center">
                <div class="mb-6">
                    <div class="text-6xl font-bold ${color} mb-2">${percentage}%</div>
                    <div class="text-xl font-semibold mb-4">${message}</div>
                    <div class="text-lg">You got ${correctAnswers} out of ${this.currentQuiz.totalQuestions} questions correct!</div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-white bg-opacity-10 rounded-lg p-4">
                        <div class="text-2xl font-bold text-green-400">${correctAnswers}</div>
                        <div class="text-sm">Correct Answers</div>
                    </div>
                    <div class="bg-white bg-opacity-10 rounded-lg p-4">
                        <div class="text-2xl font-bold text-red-400">${this.currentQuiz.totalQuestions - correctAnswers}</div>
                        <div class="text-sm">Incorrect Answers</div>
                    </div>
                </div>
                
                <div class="flex space-x-4">
                    <button id="retakeQuiz" class="flex-1 bg-white hover:bg-gray-100 text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-redo mr-2"></i>
                        Retake Quiz
                    </button>
                    <button id="shareResult" class="flex-1 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-share mr-2"></i>
                        Share Result
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'submitQuiz') {
                this.submitQuiz();
            } else if (e.target.id === 'resetQuiz') {
                this.resetQuiz();
            } else if (e.target.id === 'retakeQuiz') {
                this.retakeQuiz();
            } else if (e.target.id === 'shareResult') {
                this.shareResult();
            }
        });

        // Handle radio button changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                const questionId = parseInt(e.target.name.split('_')[1]);
                const answer = parseInt(e.target.value);
                this.answerQuestion(questionId, answer);
            }
        });
    }

    answerQuestion(questionId, answer) {
        const question = this.currentQuiz.questions.find(q => q.id === questionId);
        if (question) {
            question.userAnswer = answer;
            question.isCorrect = answer === question.correct;
        }
    }

    submitQuiz() {
        // Check if all questions are answered
        const unanswered = this.currentQuiz.questions.filter(q => q.userAnswer === null);
        if (unanswered.length > 0) {
            this.showNotification('Please answer all questions before submitting.', 'warning');
            return;
        }

        // Calculate score
        const correctAnswers = this.currentQuiz.questions.filter(q => q.isCorrect).length;
        this.currentQuiz.score = correctAnswers;
        this.currentQuiz.completed = true;

        // Save to history
        this.quizHistory.push({ ...this.currentQuiz });
        this.saveQuizHistory();

        // Award XP
        const xpEarned = Math.floor((correctAnswers / this.currentQuiz.totalQuestions) * 100);
        if (window.app && window.app.awardXP) {
            window.app.awardXP(xpEarned);
        }

        // Show confetti for good scores
        if (correctAnswers >= 4) {
            this.showConfetti();
        }

        // Re-render quiz
        this.renderDailyQuiz();
    }

    resetQuiz() {
        this.currentQuiz.questions.forEach(q => {
            q.userAnswer = null;
            q.isCorrect = false;
        });
        this.currentQuiz.score = 0;
        this.currentQuiz.completed = false;
        this.renderDailyQuiz();
    }

    retakeQuiz() {
        this.generateDailyQuiz();
        this.renderDailyQuiz();
    }

    shareResult() {
        const score = this.currentQuiz.score;
        const total = this.currentQuiz.totalQuestions;
        const percentage = Math.floor((score / total) * 100);
        
        const text = `I scored ${score}/${total} (${percentage}%) on today's ${this.currentQuiz.subject} quiz on NepalEdu! 🎓📚`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Quiz Result',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Result copied to clipboard!', 'success');
            });
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

    showConfetti() {
        // Simple confetti effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'fixed w-2 h-2 bg-yellow-400 rounded-full pointer-events-none z-50';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.animation = 'fall 3s linear forwards';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
    }

    // Get quiz statistics
    getQuizStats() {
        const totalQuizzes = this.quizHistory.length;
        const totalScore = this.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
        const totalQuestions = this.quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
        const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
        
        return {
            totalQuizzes,
            totalScore,
            totalQuestions,
            averageScore,
            streak: this.calculateStreak()
        };
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            const quiz = this.quizHistory.find(q => q.date === dateString);
            if (quiz && quiz.completed) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Get leaderboard data
    getLeaderboardData() {
        // In a real app, this would come from an API
        return [
            { name: 'Ram Kumar', xp: 2850, level: 11, avatar: null },
            { name: 'Sita Sharma', xp: 2720, level: 10, avatar: null },
            { name: 'Hari Thapa', xp: 2580, level: 10, avatar: null },
            { name: 'Gita Rai', xp: 2450, level: 9, avatar: null },
            { name: 'Bikash Tamang', xp: 2320, level: 9, avatar: null }
        ];
    }
}

// Initialize quiz manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizManager = new QuizManager();
}); 