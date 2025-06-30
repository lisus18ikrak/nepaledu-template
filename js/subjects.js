// Subjects and Chapters Management
class SubjectsManager {
    constructor() {
        this.class9Subjects = [];
        this.class10Subjects = [];
        this.currentClass = 9;
        this.subjects = [];
        this.currentSubject = null;
        this.currentChapter = null;
        this.init();
    }

    init() {
        this.loadSubjects();
        this.renderSubjects();
        this.setupEventListeners();
        this.setupClassTabs();
    }

    loadSubjects() {
        // Class 9 demo data
        this.class9Subjects = [
            {
                id: 1,
                name: 'Mathematics',
                icon: 'fas fa-calculator',
                color: 'primary',
                description: 'Algebra, Geometry, Trigonometry, and Statistics for Class 9',
                chapters: [
                    { id: 1, name: 'Algebraic Expressions', questions: 25, completed: 10 },
                    { id: 2, name: 'Linear Equations', questions: 20, completed: 5 },
                    { id: 3, name: 'Geometry: Triangles', questions: 18, completed: 3 },
                    { id: 4, name: 'Trigonometry Basics', questions: 15, completed: 2 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 80,
                pastPapers: 12
            },
            {
                id: 2,
                name: 'Science',
                icon: 'fas fa-atom',
                color: 'secondary',
                description: 'Physics, Chemistry, and Biology for Class 9',
                chapters: [
                    { id: 5, name: 'Physics: Motion', questions: 22, completed: 8 },
                    { id: 6, name: 'Chemistry: Atoms', questions: 18, completed: 4 },
                    { id: 7, name: 'Biology: Cell', questions: 20, completed: 7 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 90,
                pastPapers: 14
            },
            {
                id: 3,
                name: 'English',
                icon: 'fas fa-language',
                color: 'purple',
                description: 'Grammar, Literature, and Communication Skills for Class 9',
                chapters: [
                    { id: 8, name: 'Grammar: Tenses', questions: 15, completed: 6 },
                    { id: 9, name: 'Literature: Poems', questions: 12, completed: 4 },
                    { id: 10, name: 'Writing Skills: Essays', questions: 10, completed: 2 }
                ],
                books: ['English Medium'],
                videoCount: 40,
                pastPapers: 8
            },
            {
                id: 4,
                name: 'Nepali',
                icon: 'fas fa-book-open',
                color: 'yellow',
                description: 'नेपाली व्याकरण, साहित्य, र लेखन कौशल कक्षा ९ का लागि',
                chapters: [
                    { id: 11, name: 'व्याकरण: संज्ञा', questions: 14, completed: 5 },
                    { id: 12, name: 'साहित्य: कविता', questions: 13, completed: 3 },
                    { id: 13, name: 'लेखन कौशल: निबन्ध', questions: 11, completed: 2 }
                ],
                books: ['Nepali Medium'],
                videoCount: 30,
                pastPapers: 7
            },
            {
                id: 5,
                name: 'Social Studies',
                icon: 'fas fa-globe',
                color: 'green',
                description: 'History, Geography, and Civics for Class 9',
                chapters: [
                    { id: 14, name: 'History: Ancient Nepal', questions: 16, completed: 6 },
                    { id: 15, name: 'Geography: Landforms', questions: 14, completed: 4 },
                    { id: 16, name: 'Civics: Constitution', questions: 12, completed: 2 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 35,
                pastPapers: 9
            },
            {
                id: 6,
                name: 'Computer Science',
                icon: 'fas fa-laptop-code',
                color: 'red',
                description: 'Programming, Database, and Web Development for Class 9',
                chapters: [
                    { id: 17, name: 'Programming Basics', questions: 13, completed: 5 },
                    { id: 18, name: 'Database Fundamentals', questions: 11, completed: 3 },
                    { id: 19, name: 'Web Development', questions: 10, completed: 2 }
                ],
                books: ['English Medium'],
                videoCount: 28,
                pastPapers: 5
            },
            {
                id: 7,
                name: 'Health & Physical Education',
                icon: 'fas fa-heartbeat',
                color: 'secondary',
                description: 'Health, hygiene, and physical education for Class 9',
                chapters: [
                    { id: 20, name: 'Personal Hygiene', questions: 10, completed: 4 },
                    { id: 21, name: 'Nutrition', questions: 9, completed: 2 },
                    { id: 22, name: 'Physical Fitness', questions: 8, completed: 1 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 18,
                pastPapers: 3
            },
            {
                id: 8,
                name: 'Economics',
                icon: 'fas fa-chart-line',
                color: 'primary',
                description: 'Basic economics for Class 9',
                chapters: [
                    { id: 23, name: 'Introduction to Economics', questions: 12, completed: 5 },
                    { id: 24, name: 'Demand and Supply', questions: 10, completed: 3 }
                ],
                books: ['English Medium'],
                videoCount: 14,
                pastPapers: 2
            }
        ];
        // Class 10 demo data
        this.class10Subjects = [
            {
                id: 101,
                name: 'Mathematics',
                icon: 'fas fa-calculator',
                color: 'primary',
                description: 'Algebra, Geometry, Trigonometry, and Statistics for Class 10',
                chapters: [
                    { id: 101, name: 'Quadratic Equations', questions: 28, completed: 9 },
                    { id: 102, name: 'Circle Geometry', questions: 22, completed: 6 },
                    { id: 103, name: 'Trigonometric Ratios', questions: 20, completed: 4 },
                    { id: 104, name: 'Probability', questions: 18, completed: 2 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 85,
                pastPapers: 13
            },
            {
                id: 102,
                name: 'Science',
                icon: 'fas fa-atom',
                color: 'secondary',
                description: 'Physics, Chemistry, and Biology for Class 10',
                chapters: [
                    { id: 105, name: 'Physics: Electricity', questions: 24, completed: 10 },
                    { id: 106, name: 'Chemistry: Reactions', questions: 20, completed: 7 },
                    { id: 107, name: 'Biology: Genetics', questions: 22, completed: 8 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 92,
                pastPapers: 15
            },
            {
                id: 103,
                name: 'English',
                icon: 'fas fa-language',
                color: 'purple',
                description: 'Grammar, Literature, and Communication Skills for Class 10',
                chapters: [
                    { id: 108, name: 'Grammar: Clauses', questions: 16, completed: 7 },
                    { id: 109, name: 'Literature: Stories', questions: 14, completed: 5 },
                    { id: 110, name: 'Writing Skills: Reports', questions: 12, completed: 3 }
                ],
                books: ['English Medium'],
                videoCount: 42,
                pastPapers: 9
            },
            {
                id: 104,
                name: 'Nepali',
                icon: 'fas fa-book-open',
                color: 'yellow',
                description: 'नेपाली व्याकरण, साहित्य, र लेखन कौशल कक्षा १० का लागि',
                chapters: [
                    { id: 111, name: 'व्याकरण: क्रिया', questions: 15, completed: 6 },
                    { id: 112, name: 'साहित्य: कथा', questions: 13, completed: 4 },
                    { id: 113, name: 'लेखन कौशल: प्रतिवेदन', questions: 12, completed: 2 }
                ],
                books: ['Nepali Medium'],
                videoCount: 32,
                pastPapers: 8
            },
            {
                id: 105,
                name: 'Social Studies',
                icon: 'fas fa-globe',
                color: 'green',
                description: 'History, Geography, and Civics for Class 10',
                chapters: [
                    { id: 114, name: 'History: Medieval Nepal', questions: 18, completed: 7 },
                    { id: 115, name: 'Geography: Climate', questions: 16, completed: 5 },
                    { id: 116, name: 'Civics: Rights & Duties', questions: 14, completed: 3 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 38,
                pastPapers: 10
            },
            {
                id: 106,
                name: 'Computer Science',
                icon: 'fas fa-laptop-code',
                color: 'red',
                description: 'Programming, Database, and Web Development for Class 10',
                chapters: [
                    { id: 117, name: 'Advanced Programming', questions: 15, completed: 6 },
                    { id: 118, name: 'Database Management', questions: 13, completed: 4 },
                    { id: 119, name: 'Web Technologies', questions: 12, completed: 2 }
                ],
                books: ['English Medium'],
                videoCount: 30,
                pastPapers: 6
            },
            {
                id: 107,
                name: 'Health & Physical Education',
                icon: 'fas fa-heartbeat',
                color: 'secondary',
                description: 'Health, hygiene, and physical education for Class 10',
                chapters: [
                    { id: 120, name: 'Mental Health', questions: 11, completed: 5 },
                    { id: 121, name: 'Community Health', questions: 10, completed: 3 },
                    { id: 122, name: 'Sports & Games', questions: 9, completed: 2 }
                ],
                books: ['English Medium', 'Nepali Medium'],
                videoCount: 20,
                pastPapers: 4
            },
            {
                id: 108,
                name: 'Economics',
                icon: 'fas fa-chart-line',
                color: 'primary',
                description: 'Basic economics for Class 10',
                chapters: [
                    { id: 123, name: 'National Income', questions: 13, completed: 6 },
                    { id: 124, name: 'Banking', questions: 11, completed: 4 }
                ],
                books: ['English Medium'],
                videoCount: 16,
                pastPapers: 3
            }
        ];
        this.subjects = this.class9Subjects;
        this.loadProgress();
    }

    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('progress') || '{}');
        
        this.subjects.forEach(subject => {
            subject.chapters.forEach(chapter => {
                if (progress[chapter.id]) {
                    chapter.completed = progress[chapter.id];
                }
            });
        });
    }

    renderSubjects() {
        const subjectsGrid = document.getElementById('subjectsGrid');
        if (!subjectsGrid) return;

        subjectsGrid.innerHTML = this.subjects.map(subject => this.createSubjectCard(subject)).join('');
    }

    createSubjectCard(subject) {
        const totalChapters = subject.chapters.length;
        const completedChapters = subject.chapters.filter(ch => ch.completed && ch.completed >= ch.questions).length;
        const totalQuestions = subject.chapters.reduce((sum, chapter) => sum + chapter.questions, 0);
        const completedQuestions = subject.chapters.reduce((sum, chapter) => sum + (chapter.completed || 0), 0);
        const progressPercent = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

        const colorClasses = {
            primary: 'bg-primary-500 hover:bg-primary-600',
            secondary: 'bg-secondary-500 hover:bg-secondary-600',
            purple: 'bg-purple-500 hover:bg-purple-600',
            yellow: 'bg-yellow-500 hover:bg-yellow-600',
            green: 'bg-green-500 hover:bg-green-600',
            red: 'bg-red-500 hover:bg-red-600'
        };

        return `
            <div class="floating-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105" 
                 data-subject-id="${subject.id}">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-16 h-16 ${colorClasses[subject.color]} rounded-xl flex items-center justify-center">
                            <i class="${subject.icon} text-white text-2xl"></i>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-gray-500 dark:text-gray-400">Progress</div>
                            <div class="text-lg font-bold text-gray-900 dark:text-white">${completedChapters}/${totalChapters} chapters</div>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${subject.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${subject.description}</p>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Chapters</span>
                            <span class="font-medium">${subject.chapters.length}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Questions</span>
                            <span class="font-medium">${totalQuestions}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Videos</span>
                            <span class="font-medium">${subject.videoCount}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Past Papers</span>
                            <span class="font-medium">${subject.pastPapers}</span>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Questions Progress</span>
                            <span>${completedQuestions}/${totalQuestions}</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div class="bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600 h-2 rounded-full transition-all duration-300" 
                                 style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                    
                    <div class="mt-4 flex space-x-2">
                        ${subject.books.map(book => `
                            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400">
                                ${book}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Subject card clicks
        document.addEventListener('click', (e) => {
            const subjectCard = e.target.closest('[data-subject-id]');
            if (subjectCard) {
                const subjectId = parseInt(subjectCard.dataset.subjectId);
                this.openSubject(subjectId);
                return;
            }
            // Chapter card Study/Quiz button clicks
            const chapterCard = e.target.closest('[data-chapter-id]');
            if (chapterCard) {
                const chapterId = parseInt(chapterCard.dataset.chapterId);
                if (e.target.textContent.trim() === 'Study') {
                    this.openChapter(chapterId);
                    return;
                }
                if (e.target.textContent.trim() === 'Quiz') {
                    // You can implement quiz navigation here
                    // For now, just alert or navigate
                    alert('Quiz feature coming soon!');
                    return;
                }
            }
        });
    }

    setupClassTabs() {
        const class9Tab = document.getElementById('class9Tab');
        const class10Tab = document.getElementById('class10Tab');
        const noSubjectsMsg = document.getElementById('noSubjectsMsg');
        class9Tab.addEventListener('click', () => {
            this.currentClass = 9;
            this.subjects = this.class9Subjects;
            class9Tab.classList.add('bg-primary-100', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-200');
            class10Tab.classList.remove('bg-primary-100', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-200');
            class10Tab.classList.add('text-gray-700', 'dark:text-gray-200');
            this.renderSubjects();
            if (this.subjects.length === 0) {
                noSubjectsMsg.classList.remove('hidden');
            } else {
                noSubjectsMsg.classList.add('hidden');
            }
        });
        class10Tab.addEventListener('click', () => {
            this.currentClass = 10;
            this.subjects = this.class10Subjects;
            class10Tab.classList.add('bg-primary-100', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-200');
            class9Tab.classList.remove('bg-primary-100', 'dark:bg-primary-900', 'text-primary-700', 'dark:text-primary-200');
            class9Tab.classList.add('text-gray-700', 'dark:text-gray-200');
            this.renderSubjects();
            if (this.subjects.length === 0) {
                noSubjectsMsg.classList.remove('hidden');
            } else {
                noSubjectsMsg.classList.add('hidden');
            }
        });
    }

    openSubject(subjectId) {
        this.currentSubject = this.subjects.find(s => s.id === subjectId);
        if (!this.currentSubject) return;

        const modalContent = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-${this.currentSubject.color}-500 rounded-lg flex items-center justify-center">
                            <i class="${this.currentSubject.icon} text-white text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${this.currentSubject.name}</h2>
                            <p class="text-gray-600 dark:text-gray-400">${this.currentSubject.description}</p>
                        </div>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onclick="window.app.closeModal()">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-semibold mb-2">Quick Stats</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span>Total Chapters:</span>
                                <span class="font-medium">${this.currentSubject.chapters.length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Total Questions:</span>
                                <span class="font-medium">${this.currentSubject.chapters.reduce((sum, ch) => sum + ch.questions, 0)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Video Lessons:</span>
                                <span class="font-medium">${this.currentSubject.videoCount}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Past Papers:</span>
                                <span class="font-medium">${this.currentSubject.pastPapers}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 class="font-semibold mb-2">Available Books</h3>
                        <div class="space-y-2">
                            ${this.currentSubject.books.map(book => `
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-book text-${this.currentSubject.color}-500"></i>
                                    <span class="text-sm">${book}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h3 class="text-xl font-bold mb-4">Chapters</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.currentSubject.chapters.map(chapter => this.createChapterCard(chapter)).join('')}
                    </div>
                </div>
                
                <div class="flex space-x-4">
                    <button class="flex-1 bg-${this.currentSubject.color}-500 hover:bg-${this.currentSubject.color}-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-play mr-2"></i>
                        Start Learning
                    </button>
                    <button class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-download mr-2"></i>
                        Download PDF
                    </button>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    createChapterCard(chapter) {
        const progressPercent = chapter.questions > 0 ? (chapter.completed / chapter.questions) * 100 : 0;
        
        return `
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                 data-chapter-id="${chapter.id}">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900 dark:text-white">${chapter.name}</h4>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-play-circle text-primary-500"></i>
                        <i class="fas fa-file-pdf text-red-500"></i>
                    </div>
                </div>
                
                <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>${chapter.questions} questions</span>
                    <span>${chapter.completed} completed</span>
                </div>
                
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                    <div class="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                         style="width: ${progressPercent}%"></div>
                </div>
                
                <div class="flex space-x-2">
                    <button class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
                        Study
                    </button>
                    <button class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-3 rounded text-sm font-medium transition-colors">
                        Quiz
                    </button>
                </div>
            </div>
        `;
    }

    // Chapter management methods
    openChapter(chapterId) {
        this.currentChapter = this.currentSubject.chapters.find(c => c.id === chapterId);
        if (!this.currentChapter) return;

        // Navigate to chapter page
        this.navigateToChapterPage(chapterId);
    }

    navigateToChapterPage(chapterId) {
        // Create chapter page URL
        const url = `chapter.html?subject=${this.currentSubject.id}&chapter=${chapterId}`;
        window.location.href = url;
    }

    // Progress tracking
    updateChapterProgress(chapterId, completed) {
        const chapter = this.subjects
            .flatMap(s => s.chapters)
            .find(c => c.id === chapterId);
        
        if (chapter) {
            chapter.completed = completed;
            this.saveProgress();
            this.renderSubjects(); // Re-render to show updated progress
        }
    }

    saveProgress() {
        const progress = {};
        this.subjects.forEach(subject => {
            subject.chapters.forEach(chapter => {
                progress[chapter.id] = chapter.completed;
            });
        });
        localStorage.setItem('progress', JSON.stringify(progress));
    }

    // Search functionality
    searchSubjects(query) {
        const searchTerm = query.toLowerCase();
        return this.subjects.filter(subject => 
            subject.name.toLowerCase().includes(searchTerm) ||
            subject.description.toLowerCase().includes(searchTerm) ||
            subject.chapters.some(chapter => 
                chapter.name.toLowerCase().includes(searchTerm)
            )
        );
    }

    // Get subject by ID
    getSubjectById(id) {
        return this.subjects.find(s => s.id === id);
    }

    // Get chapter by ID
    getChapterById(chapterId) {
        return this.subjects
            .flatMap(s => s.chapters)
            .find(c => c.id === chapterId);
    }

    // Get all chapters for a subject
    getChaptersBySubject(subjectId) {
        const subject = this.getSubjectById(subjectId);
        return subject ? subject.chapters : [];
    }
}

// Initialize subjects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.subjectsManager = new SubjectsManager();
}); 