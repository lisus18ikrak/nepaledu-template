// Automated Content Generation System
class AutomatedContentGeneration {
    constructor() {
        this.contentData = {};
        this.init();
    }

    init() {
        this.loadContentData();
        this.setupEventListeners();
    }

    loadContentData() {
        const saved = localStorage.getItem('automatedContentData');
        if (saved) {
            this.contentData = JSON.parse(saved);
        } else {
            this.contentData = {
                generatedContent: [],
                settings: {
                    difficultyLevels: ['easy', 'medium', 'hard'],
                    questionTypes: ['multiple_choice', 'true_false', 'fill_blank'],
                    subjects: ['mathematics', 'science', 'english', 'nepali', 'social_studies']
                },
                metrics: {
                    totalGenerated: 0,
                    averageQuality: 0
                }
            };
            this.saveContentData();
        }
    }

    saveContentData() {
        localStorage.setItem('automatedContentData', JSON.stringify(this.contentData));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'contentGenBtn') {
                this.showContentGenerationDashboard();
            }
            if (e.target.id === 'generateQuestionsBtn') {
                this.showQuestionGenerationForm();
            }
        });
    }

    async generateQuestions(topic, subject, difficulty, count = 5) {
        const questions = [];
        
        for (let i = 0; i < count; i++) {
            const question = this.createQuestion(topic, subject, difficulty, i + 1);
            questions.push(question);
        }

        const generationResult = {
            id: Date.now(),
            type: 'questions',
            topic: topic,
            subject: subject,
            difficulty: difficulty,
            count: count,
            questions: questions,
            timestamp: Date.now(),
            quality: this.assessQuality(questions)
        };

        this.contentData.generatedContent.push(generationResult);
        this.updateMetrics();
        this.saveContentData();

        return generationResult;
    }

    createQuestion(topic, subject, difficulty, questionNumber) {
        const questionTypes = this.contentData.settings.questionTypes;
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        const baseQuestion = {
            id: `gen_${Date.now()}_${questionNumber}`,
            topic: topic,
            subject: subject,
            difficulty: difficulty,
            type: questionType,
            generated: true
        };

        switch (questionType) {
            case 'multiple_choice':
                return {
                    ...baseQuestion,
                    question: `What is the main concept of ${topic} in ${subject}?`,
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    correct_answer: 'Option A',
                    explanation: `This answer is correct because ${topic} is a fundamental concept in ${subject}.`
                };

            case 'true_false':
                return {
                    ...baseQuestion,
                    question: `${topic} is an important concept in ${subject}.`,
                    options: ['True', 'False'],
                    correct_answer: 'True',
                    explanation: `This statement is true as ${topic} plays a crucial role in ${subject}.`
                };

            case 'fill_blank':
                return {
                    ...baseQuestion,
                    question: `The main principle of ${topic} is _____.`,
                    correct_answer: 'fundamental',
                    explanation: `The blank should be filled with "fundamental" as it describes the core principle of ${topic}.`
                };

            default:
                return baseQuestion;
        }
    }

    assessQuality(content) {
        return 0.8; // Simple quality assessment
    }

    updateMetrics() {
        const content = this.contentData.generatedContent;
        this.contentData.metrics.totalGenerated = content.length;
        
        if (content.length > 0) {
            const qualities = content.map(c => c.quality);
            this.contentData.metrics.averageQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
        }
    }

    showContentGenerationDashboard() {
        const recentContent = this.contentData.generatedContent
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Automated Content Generation</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-500">${this.contentData.metrics.totalGenerated}</div>
                            <div class="text-xs text-gray-500">Total Generated</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-500">${(this.contentData.metrics.averageQuality * 100).toFixed(1)}%</div>
                            <div class="text-xs text-gray-500">Avg Quality</div>
                        </div>
                    </div>
                </div>

                <!-- Generation Controls -->
                <div class="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-lg font-semibold mb-2">AI Content Generation</h4>
                            <p class="text-sm opacity-90">Generate questions and educational content</p>
                        </div>
                        <div class="flex space-x-3">
                            <button id="generateQuestionsBtn" class="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2">
                                <i class="fas fa-question-circle"></i>
                                <span>Generate Questions</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Content Overview -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.contentData.metrics.totalGenerated}</div>
                                <div class="text-sm opacity-90">Total Generated</div>
                            </div>
                            <i class="fas fa-robot text-3xl opacity-80"></i>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${(this.contentData.metrics.averageQuality * 100).toFixed(1)}%</div>
                                <div class="text-sm opacity-90">Average Quality</div>
                            </div>
                            <i class="fas fa-star text-3xl opacity-80"></i>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.contentData.settings.questionTypes.length}</div>
                                <div class="text-sm opacity-90">Question Types</div>
                            </div>
                            <i class="fas fa-list text-3xl opacity-80"></i>
                        </div>
                    </div>
                </div>

                <!-- Recent Generated Content -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recently Generated Content</h4>
                    <div class="space-y-3">
                        ${recentContent.map(content => `
                            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-question-circle text-blue-500 text-xl"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white">${content.topic}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">
                                            ${content.subject} • ${content.difficulty} • ${content.count} questions
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                                        ${(content.quality * 100).toFixed(1)}% quality
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">
                                        ${new Date(content.timestamp).toLocaleDateString()}
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

    showQuestionGenerationForm() {
        const modalContent = `
            <div class="p-6 max-w-md">
                <h3 class="text-xl font-bold mb-4">Generate Questions</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic</label>
                        <input type="text" id="questionTopic" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="e.g., Quadratic Equations">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                        <select id="questionSubject" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                            ${this.contentData.settings.subjects.map(subject => 
                                `<option value="${subject}">${subject.charAt(0).toUpperCase() + subject.slice(1)}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                        <select id="questionDifficulty" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                            ${this.contentData.settings.difficultyLevels.map(level => 
                                `<option value="${level}">${level.charAt(0).toUpperCase() + level.slice(1)}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Questions</label>
                        <input type="number" id="questionCount" min="1" max="20" value="5" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    </div>
                </div>

                <div class="flex space-x-3 mt-6">
                    <button id="generateQuestionsSubmit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                        Generate Questions
                    </button>
                    <button onclick="this.closest('.modal').remove()" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Generate Questions');
        this.setupFormHandlers();
    }

    setupFormHandlers() {
        setTimeout(() => {
            const questionsSubmit = document.getElementById('generateQuestionsSubmit');
            if (questionsSubmit) {
                questionsSubmit.addEventListener('click', async () => {
                    const topic = document.getElementById('questionTopic').value;
                    const subject = document.getElementById('questionSubject').value;
                    const difficulty = document.getElementById('questionDifficulty').value;
                    const count = parseInt(document.getElementById('questionCount').value);

                    if (!topic) {
                        alert('Please enter a topic');
                        return;
                    }

                    try {
                        const result = await this.generateQuestions(topic, subject, difficulty, count);
                        this.showGenerationResult(result);
                    } catch (error) {
                        alert('Error generating questions: ' + error.message);
                    }
                });
            }
        }, 100);
    }

    showGenerationResult(result) {
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">Generated Questions</h3>
                    <div class="text-sm text-gray-500">
                        Quality: ${(result.quality * 100).toFixed(1)}%
                    </div>
                </div>

                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-check-circle text-green-500"></i>
                        <span class="text-green-800 dark:text-green-200 font-semibold">Questions Generated Successfully!</span>
                    </div>
                </div>

                ${this.renderQuestions(result.questions)}

                <div class="flex space-x-3 mt-6">
                    <button onclick="window.automatedContentGeneration.addToQuiz(${result.id})" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
                        <i class="fas fa-plus mr-2"></i>Add to Quiz
                    </button>
                    <button onclick="this.closest('.modal').remove()" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        Close
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Generation Result');
    }

    renderQuestions(questions) {
        return `
            <div class="space-y-4">
                ${questions.map((q, index) => `
                    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                                ${index + 1}
                            </div>
                            <div class="flex-1">
                                <div class="font-semibold text-gray-900 dark:text-white mb-2">${q.question}</div>
                                ${q.options ? `
                                    <div class="space-y-1">
                                        ${q.options.map(option => `
                                            <div class="text-sm text-gray-600 dark:text-gray-400">• ${option}</div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                <div class="mt-2 text-sm">
                                    <span class="font-semibold text-green-600 dark:text-green-400">Correct Answer:</span> ${q.correct_answer}
                                </div>
                                <div class="mt-1 text-sm text-gray-500">${q.explanation}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showModal(content, title) {
        const modal = document.createElement('div');
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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

    addToQuiz(contentId) {
        const content = this.contentData.generatedContent.find(c => c.id === contentId);
        if (!content || content.type !== 'questions') return;

        if (window.enhancedQuizSystem) {
            content.questions.forEach(question => {
                window.enhancedQuizSystem.addQuestion(question);
            });
        }

        alert(`${content.questions.length} questions added to quiz system!`);
    }

    getContentStats() {
        return {
            totalGenerated: this.contentData.metrics.totalGenerated,
            averageQuality: this.contentData.metrics.averageQuality
        };
    }
}

// Initialize the Automated Content Generation system
window.automatedContentGeneration = new AutomatedContentGeneration(); 