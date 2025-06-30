// Student Dashboard with Progress Tracking and Personalization
class StudentDashboard {
    constructor() {
        this.currentUser = null;
        this.userProgress = {};
        this.bookmarks = [];
        this.notes = [];
        this.studyPlan = null;
        this.learningPath = [];
        this.analytics = {};
        this.notifications = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.initializeDashboard();
    }

    loadUserData() {
        // Load user data from localStorage
        const savedUser = localStorage.getItem('studentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        // Load progress data
        const savedProgress = localStorage.getItem('userProgress');
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
        }

        // Load bookmarks
        const savedBookmarks = localStorage.getItem('userBookmarks');
        if (savedBookmarks) {
            this.bookmarks = JSON.parse(savedBookmarks);
        }

        // Load notes
        const savedNotes = localStorage.getItem('userNotes');
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
        }

        // Load study plan
        const savedStudyPlan = localStorage.getItem('userStudyPlan');
        if (savedStudyPlan) {
            this.studyPlan = JSON.parse(savedStudyPlan);
        }

        // Load analytics
        const savedAnalytics = localStorage.getItem('userAnalytics');
        if (savedAnalytics) {
            this.analytics = JSON.parse(savedAnalytics);
        }
    }

    saveUserData() {
        localStorage.setItem('studentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
        localStorage.setItem('userBookmarks', JSON.stringify(this.bookmarks));
        localStorage.setItem('userNotes', JSON.stringify(this.notes));
        localStorage.setItem('userStudyPlan', JSON.stringify(this.studyPlan));
        localStorage.setItem('userAnalytics', JSON.stringify(this.analytics));
    }

    setupEventListeners() {
        // Dashboard navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-dashboard-tab]')) {
                const tab = e.target.dataset.dashboardTab;
                this.showTab(tab);
            }
        });

        // Bookmark functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-bookmark-btn]')) {
                const itemId = e.target.dataset.bookmarkBtn;
                const itemType = e.target.dataset.itemType;
                this.toggleBookmark(itemId, itemType);
            }
        });

        // Note functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-note-btn]')) {
                const itemId = e.target.dataset.noteBtn;
                this.showNoteEditor(itemId);
            }
        });

        // Study plan generation
        document.addEventListener('click', (e) => {
            if (e.target.matches('#generateStudyPlan')) {
                this.generateStudyPlan();
            }
        });
    }

    initializeDashboard() {
        this.updateDashboardStats();
        this.renderProgressCharts();
        this.renderRecentActivity();
        this.renderBookmarks();
        this.renderNotes();
        this.renderStudyPlan();
        this.renderLearningPath();
        this.renderNotifications();
    }

    // Dashboard Stats
    updateDashboardStats() {
        const stats = this.calculateStats();
        
        const statsContainer = document.getElementById('dashboardStats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalStudyTime}h</p>
                            <p class="text-sm text-green-600">+${stats.studyTimeIncrease}% this week</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <i class="fas fa-clock text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Chapters Completed</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${stats.completedChapters}</p>
                            <p class="text-sm text-green-600">${stats.chapterProgress}% of total</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <i class="fas fa-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Quiz Score</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${stats.averageQuizScore}%</p>
                            <p class="text-sm text-green-600">+${stats.quizImprovement}% improvement</p>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <i class="fas fa-trophy text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${stats.currentStreak} days</p>
                            <p class="text-sm text-green-600">Keep it up!</p>
                        </div>
                        <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                            <i class="fas fa-fire text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    calculateStats() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Calculate study time
        const totalStudyTime = Object.values(this.userProgress).reduce((total, progress) => {
            return total + (progress.studyTime || 0);
        }, 0);

        // Calculate completed chapters
        const completedChapters = Object.values(this.userProgress).filter(progress => 
            progress.completed
        ).length;

        // Calculate quiz scores
        const quizScores = Object.values(this.userProgress).map(progress => 
            progress.quizScores || []
        ).flat();

        const averageQuizScore = quizScores.length > 0 ? 
            Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length) : 0;

        // Calculate streak
        const currentStreak = this.calculateStreak();

        return {
            totalStudyTime: Math.round(totalStudyTime / 60), // Convert to hours
            studyTimeIncrease: 15, // Mock data
            completedChapters,
            chapterProgress: Math.round((completedChapters / 24) * 100), // Assuming 24 total chapters
            averageQuizScore,
            quizImprovement: 8, // Mock data
            currentStreak
        };
    }

    calculateStreak() {
        // Calculate current study streak
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            const hasActivity = Object.values(this.userProgress).some(progress => 
                progress.lastStudied === dateString
            );
            
            if (hasActivity) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Progress Charts
    renderProgressCharts() {
        this.renderSubjectProgressChart();
        this.renderStudyTimeChart();
        this.renderQuizPerformanceChart();
    }

    renderSubjectProgressChart() {
        const ctx = document.getElementById('subjectProgressChart');
        if (!ctx) return;

        const subjects = ['Mathematics', 'Science', 'English', 'Nepali'];
        const progress = subjects.map(subject => {
            const subjectProgress = Object.values(this.userProgress).filter(progress => 
                progress.subject === subject
            );
            return subjectProgress.length > 0 ? 
                Math.round(subjectProgress.filter(p => p.completed).length / subjectProgress.length * 100) : 0;
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: subjects,
                datasets: [{
                    data: progress,
                    backgroundColor: [
                        '#3B82F6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderStudyTimeChart() {
        const ctx = document.getElementById('studyTimeChart');
        if (!ctx) return;

        const last7Days = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toDateString();
        }).reverse();

        const studyTime = last7Days.map(date => {
            return Object.values(this.userProgress).reduce((total, progress) => {
                return total + (progress.dailyStudyTime?.[date] || 0);
            }, 0);
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString()),
                datasets: [{
                    label: 'Study Time (minutes)',
                    data: studyTime,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderQuizPerformanceChart() {
        const ctx = document.getElementById('quizPerformanceChart');
        if (!ctx) return;

        const subjects = ['Mathematics', 'Science', 'English', 'Nepali'];
        const performance = subjects.map(subject => {
            const subjectQuizzes = Object.values(this.userProgress).filter(progress => 
                progress.subject === subject && progress.quizScores
            ).map(progress => progress.quizScores).flat();
            
            return subjectQuizzes.length > 0 ? 
                Math.round(subjectQuizzes.reduce((sum, score) => sum + score, 0) / subjectQuizzes.length) : 0;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Average Quiz Score (%)',
                    data: performance,
                    backgroundColor: [
                        '#3B82F6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Recent Activity
    renderRecentActivity() {
        const activities = this.getRecentActivities();
        
        const container = document.getElementById('recentActivity');
        if (!container) return;

        container.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold">Recent Activity</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        ${activities.map(activity => `
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center">
                                    <i class="${activity.icon} ${activity.iconColor}"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900 dark:text-white">${activity.title}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">${activity.description}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-500">${activity.time}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getRecentActivities() {
        const activities = [];
        const now = new Date();

        // Add quiz completions
        Object.entries(this.userProgress).forEach(([id, progress]) => {
            if (progress.lastQuizAttempt) {
                activities.push({
                    title: `Completed ${progress.subject} Quiz`,
                    description: `Scored ${progress.lastQuizScore}%`,
                    time: this.getTimeAgo(new Date(progress.lastQuizAttempt)),
                    icon: 'fas fa-trophy',
                    iconBg: 'bg-yellow-100 dark:bg-yellow-900',
                    iconColor: 'text-yellow-600'
                });
            }
        });

        // Add chapter completions
        Object.entries(this.userProgress).forEach(([id, progress]) => {
            if (progress.completed && progress.completedAt) {
                activities.push({
                    title: `Completed ${progress.subject} Chapter`,
                    description: progress.chapterName || 'Chapter',
                    time: this.getTimeAgo(new Date(progress.completedAt)),
                    icon: 'fas fa-check-circle',
                    iconBg: 'bg-green-100 dark:bg-green-900',
                    iconColor: 'text-green-600'
                });
            }
        });

        // Sort by time and return recent 10
        return activities
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 10);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hours ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} days ago`;
        }
    }

    // Bookmarks System
    renderBookmarks() {
        const container = document.getElementById('bookmarksContainer');
        if (!container) return;

        if (this.bookmarks.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-bookmark text-gray-400 text-4xl mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-400">No bookmarks yet</p>
                    <p class="text-sm text-gray-500">Bookmark important questions and chapters for quick access</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${this.bookmarks.map(bookmark => this.renderBookmarkItem(bookmark)).join('')}
            </div>
        `;
    }

    renderBookmarkItem(bookmark) {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-bookmark text-primary-500"></i>
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">${bookmark.type}</span>
                    </div>
                    <button class="text-gray-400 hover:text-red-500" onclick="studentDashboard.removeBookmark('${bookmark.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">${bookmark.title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${bookmark.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">${bookmark.subject}</span>
                    <button class="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        View
                    </button>
                </div>
            </div>
        `;
    }

    toggleBookmark(itemId, itemType) {
        const existingIndex = this.bookmarks.findIndex(b => b.id === itemId);
        
        if (existingIndex >= 0) {
            this.bookmarks.splice(existingIndex, 1);
        } else {
            this.bookmarks.push({
                id: itemId,
                type: itemType,
                title: `Bookmarked ${itemType}`,
                description: `Quick access to ${itemType}`,
                subject: 'General',
                createdAt: new Date().toISOString()
            });
        }
        
        this.saveUserData();
        this.renderBookmarks();
    }

    removeBookmark(bookmarkId) {
        this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
        this.saveUserData();
        this.renderBookmarks();
    }

    // Notes System
    renderNotes() {
        const container = document.getElementById('notesContainer');
        if (!container) return;

        if (this.notes.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-sticky-note text-gray-400 text-4xl mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-400">No notes yet</p>
                    <p class="text-sm text-gray-500">Take notes while studying for better retention</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${this.notes.map(note => this.renderNoteItem(note)).join('')}
            </div>
        `;
    }

    renderNoteItem(note) {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-sticky-note text-yellow-500"></i>
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">${note.subject}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="text-gray-400 hover:text-blue-500" onclick="studentDashboard.editNote('${note.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-gray-400 hover:text-red-500" onclick="studentDashboard.deleteNote('${note.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">${note.title}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${note.content.substring(0, 100)}...</p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">${new Date(note.createdAt).toLocaleDateString()}</span>
                    <span class="text-xs text-gray-500">${note.chapter}</span>
                </div>
            </div>
        `;
    }

    showNoteEditor(itemId = null) {
        const note = itemId ? this.notes.find(n => n.id === itemId) : null;
        
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">${note ? 'Edit Note' : 'Add Note'}</h3>
                <form id="noteForm">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Title</label>
                            <input type="text" id="noteTitle" value="${note?.title || ''}" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Subject</label>
                            <select id="noteSubject" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option value="Mathematics" ${note?.subject === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
                                <option value="Science" ${note?.subject === 'Science' ? 'selected' : ''}>Science</option>
                                <option value="English" ${note?.subject === 'English' ? 'selected' : ''}>English</option>
                                <option value="Nepali" ${note?.subject === 'Nepali' ? 'selected' : ''}>Nepali</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Chapter</label>
                            <input type="text" id="noteChapter" value="${note?.chapter || ''}" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Content</label>
                            <textarea id="noteContent" rows="6" 
                                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">${note?.content || ''}</textarea>
                        </div>
                    </div>
                    <div class="flex space-x-4 mt-6">
                        <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium">
                            ${note ? 'Update Note' : 'Save Note'}
                        </button>
                        <button type="button" onclick="window.app.closeModal()" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;

        window.app.showModal(modalContent);

        // Handle form submission
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNote(note?.id);
        });
    }

    saveNote(noteId = null) {
        const title = document.getElementById('noteTitle').value;
        const subject = document.getElementById('noteSubject').value;
        const chapter = document.getElementById('noteChapter').value;
        const content = document.getElementById('noteContent').value;

        if (!title || !content) {
            alert('Please fill in all required fields');
            return;
        }

        if (noteId) {
            // Update existing note
            const noteIndex = this.notes.findIndex(n => n.id === noteId);
            if (noteIndex >= 0) {
                this.notes[noteIndex] = {
                    ...this.notes[noteIndex],
                    title,
                    subject,
                    chapter,
                    content,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Create new note
            this.notes.push({
                id: Date.now().toString(),
                title,
                subject,
                chapter,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        this.saveUserData();
        this.renderNotes();
        window.app.closeModal();
    }

    editNote(noteId) {
        this.showNoteEditor(noteId);
    }

    deleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            this.saveUserData();
            this.renderNotes();
        }
    }

    // Study Plan
    async generateStudyPlan() {
        if (!window.aiIntegration || !window.aiIntegration.isAvailable()) {
            this.createFallbackStudyPlan();
            return;
        }

        try {
            const userData = {
                availableHours: 4,
                weakSubjects: this.getWeakSubjects(),
                strongSubjects: this.getStrongSubjects()
            };

            const subjects = ['Mathematics', 'Science', 'English', 'Nepali'];
            const examDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

            this.studyPlan = await window.aiIntegration.generateStudyPlan(userData, examDate, subjects);
            this.saveUserData();
            this.renderStudyPlan();
        } catch (error) {
            console.error('Failed to generate study plan:', error);
            this.createFallbackStudyPlan();
        }
    }

    createFallbackStudyPlan() {
        this.studyPlan = {
            weekly_plan: [
                {
                    day: 'Monday',
                    subjects: [
                        {
                            subject: 'Mathematics',
                            topics: ['Algebra', 'Geometry'],
                            duration: 2,
                            activities: ['Study', 'Practice', 'Quiz']
                        }
                    ]
                },
                {
                    day: 'Tuesday',
                    subjects: [
                        {
                            subject: 'Science',
                            topics: ['Physics', 'Chemistry'],
                            duration: 2,
                            activities: ['Study', 'Practice', 'Quiz']
                        }
                    ]
                }
            ],
            daily_goals: ['Complete assigned topics', 'Take practice quiz'],
            revision_schedule: ['Week 1: All subjects', 'Week 2: Weak subjects']
        };

        this.saveUserData();
        this.renderStudyPlan();
    }

    getWeakSubjects() {
        // Analyze user progress to find weak subjects
        const subjectPerformance = {};
        
        Object.values(this.userProgress).forEach(progress => {
            if (!subjectPerformance[progress.subject]) {
                subjectPerformance[progress.subject] = {
                    totalQuizzes: 0,
                    totalScore: 0
                };
            }
            
            if (progress.quizScores) {
                subjectPerformance[progress.subject].totalQuizzes += progress.quizScores.length;
                subjectPerformance[progress.subject].totalScore += progress.quizScores.reduce((sum, score) => sum + score, 0);
            }
        });

        return Object.entries(subjectPerformance)
            .filter(([subject, data]) => data.totalQuizzes > 0 && (data.totalScore / data.totalQuizzes) < 70)
            .map(([subject]) => subject);
    }

    getStrongSubjects() {
        const subjectPerformance = {};
        
        Object.values(this.userProgress).forEach(progress => {
            if (!subjectPerformance[progress.subject]) {
                subjectPerformance[progress.subject] = {
                    totalQuizzes: 0,
                    totalScore: 0
                };
            }
            
            if (progress.quizScores) {
                subjectPerformance[progress.subject].totalQuizzes += progress.quizScores.length;
                subjectPerformance[progress.subject].totalScore += progress.quizScores.reduce((sum, score) => sum + score, 0);
            }
        });

        return Object.entries(subjectPerformance)
            .filter(([subject, data]) => data.totalQuizzes > 0 && (data.totalScore / data.totalQuizzes) >= 80)
            .map(([subject]) => subject);
    }

    renderStudyPlan() {
        const container = document.getElementById('studyPlanContainer');
        if (!container) return;

        if (!this.studyPlan) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-calendar-alt text-gray-400 text-4xl mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-400">No study plan yet</p>
                    <button id="generateStudyPlan" class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium">
                        Generate Study Plan
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Your Study Plan</h3>
                    <button onclick="studentDashboard.generateStudyPlan()" class="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        <i class="fas fa-refresh mr-1"></i>
                        Regenerate
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h4 class="font-semibold mb-4">Weekly Schedule</h4>
                        <div class="space-y-4">
                            ${this.studyPlan.weekly_plan.map(day => `
                                <div class="border-l-4 border-primary-500 pl-4">
                                    <h5 class="font-medium text-gray-900 dark:text-white">${day.day}</h5>
                                    ${day.subjects.map(subject => `
                                        <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div class="font-medium">${subject.subject}</div>
                                            <div>Topics: ${subject.topics.join(', ')}</div>
                                            <div>Duration: ${subject.duration}h</div>
                                            <div>Activities: ${subject.activities.join(', ')}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h4 class="font-semibold mb-4">Daily Goals</h4>
                            <ul class="space-y-2">
                                ${this.studyPlan.daily_goals.map(goal => `
                                    <li class="flex items-center space-x-2">
                                        <i class="fas fa-check-circle text-green-500"></i>
                                        <span class="text-sm text-gray-600 dark:text-gray-400">${goal}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h4 class="font-semibold mb-4">Revision Schedule</h4>
                            <ul class="space-y-2">
                                ${this.studyPlan.revision_schedule.map(schedule => `
                                    <li class="flex items-center space-x-2">
                                        <i class="fas fa-calendar text-blue-500"></i>
                                        <span class="text-sm text-gray-600 dark:text-gray-400">${schedule}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Learning Path
    renderLearningPath() {
        const container = document.getElementById('learningPathContainer');
        if (!container) return;

        this.learningPath = this.generateLearningPath();

        container.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold mb-4">Your Learning Path</h3>
                <div class="space-y-4">
                    ${this.learningPath.map((step, index) => `
                        <div class="flex items-center space-x-4">
                            <div class="w-8 h-8 ${step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} rounded-full flex items-center justify-center text-white font-medium">
                                ${step.completed ? '✓' : index + 1}
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium text-gray-900 dark:text-white">${step.title}</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${step.description}</p>
                            </div>
                            <div class="text-sm text-gray-500">
                                ${step.estimatedTime}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateLearningPath() {
        return [
            {
                title: 'Complete Basic Concepts',
                description: 'Master fundamental topics in all subjects',
                estimatedTime: '2 weeks',
                completed: this.getProgressPercentage() > 25
            },
            {
                title: 'Practice with Quizzes',
                description: 'Test your knowledge with interactive quizzes',
                estimatedTime: '1 week',
                completed: this.getProgressPercentage() > 50
            },
            {
                title: 'Advanced Topics',
                description: 'Dive into complex concepts and problem-solving',
                estimatedTime: '2 weeks',
                completed: this.getProgressPercentage() > 75
            },
            {
                title: 'Final Revision',
                description: 'Comprehensive review and mock tests',
                estimatedTime: '1 week',
                completed: this.getProgressPercentage() > 90
            }
        ];
    }

    getProgressPercentage() {
        const totalChapters = 24; // Assuming 24 total chapters
        const completedChapters = Object.values(this.userProgress).filter(progress => 
            progress.completed
        ).length;
        
        return Math.round((completedChapters / totalChapters) * 100);
    }

    // Notifications
    renderNotifications() {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        this.notifications = this.getNotifications();

        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-bell text-gray-400 text-4xl mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-400">No notifications</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="space-y-4">
                ${this.notifications.map(notification => `
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 ${notification.iconBg} rounded-full flex items-center justify-center">
                                <i class="${notification.icon} ${notification.iconColor}"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium text-gray-900 dark:text-white">${notification.title}</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${notification.message}</p>
                                <p class="text-xs text-gray-500 mt-1">${notification.time}</p>
                            </div>
                            <button class="text-gray-400 hover:text-gray-600" onclick="studentDashboard.dismissNotification('${notification.id}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getNotifications() {
        return [
            {
                id: '1',
                title: 'Study Reminder',
                message: 'Time for your daily study session!',
                time: '2 hours ago',
                icon: 'fas fa-clock',
                iconBg: 'bg-blue-100 dark:bg-blue-900',
                iconColor: 'text-blue-600'
            },
            {
                id: '2',
                title: 'Quiz Available',
                message: 'New quiz available for Mathematics chapter 3',
                time: '1 day ago',
                icon: 'fas fa-question-circle',
                iconBg: 'bg-green-100 dark:bg-green-900',
                iconColor: 'text-green-600'
            },
            {
                id: '3',
                title: 'Achievement Unlocked',
                message: 'Congratulations! You\'ve completed 10 chapters',
                time: '2 days ago',
                icon: 'fas fa-trophy',
                iconBg: 'bg-yellow-100 dark:bg-yellow-900',
                iconColor: 'text-yellow-600'
            }
        ];
    }

    dismissNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.renderNotifications();
    }

    // Tab Management
    showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('[data-tab-content]').forEach(content => {
            content.classList.add('hidden');
        });

        // Remove active class from all tabs
        document.querySelectorAll('[data-dashboard-tab]').forEach(tab => {
            tab.classList.remove('bg-primary-500', 'text-white');
            tab.classList.add('text-gray-600', 'dark:text-gray-400');
        });

        // Show selected tab content
        const selectedContent = document.querySelector(`[data-tab-content="${tabName}"]`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }

        // Add active class to selected tab
        const selectedTab = document.querySelector(`[data-dashboard-tab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.remove('text-gray-600', 'dark:text-gray-400');
            selectedTab.classList.add('bg-primary-500', 'text-white');
        }
    }

    // Update progress
    updateProgress(chapterId, data) {
        if (!this.userProgress[chapterId]) {
            this.userProgress[chapterId] = {
                subject: data.subject,
                chapterName: data.chapterName,
                completed: false,
                studyTime: 0,
                quizScores: [],
                lastStudied: null,
                lastQuizAttempt: null,
                lastQuizScore: null
            };
        }

        // Update with new data
        Object.assign(this.userProgress[chapterId], data);
        
        // Update daily study time
        const today = new Date().toDateString();
        if (!this.userProgress[chapterId].dailyStudyTime) {
            this.userProgress[chapterId].dailyStudyTime = {};
        }
        this.userProgress[chapterId].dailyStudyTime[today] = 
            (this.userProgress[chapterId].dailyStudyTime[today] || 0) + (data.studyTime || 0);

        this.saveUserData();
        this.updateDashboardStats();
    }
}

// Initialize student dashboard
window.studentDashboard = new StudentDashboard(); 