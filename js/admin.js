// Admin Dashboard Management System
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.contentHistory = {};
        this.notifications = [];
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupRealTimeUpdates();
        this.setupEnhancedAnimations();
        this.setupEnhancedTooltips();
        this.setupEnhancedKeyboardShortcuts();
        this.setupEnhancedHoverEffects();
    }

    checkAuthentication() {
        // Check if user is logged in and has admin access
        const user = JSON.parse(localStorage.getItem('adminUser') || 'null');
        if (user && user.role) {
            this.currentUser = user;
            this.userRole = user.role;
            this.updateUIForRole();
        } else {
            this.showLoginModal();
        }
    }

    updateUIForRole() {
        const roleElements = {
            'super_admin': ['all'],
            'admin': ['subjects', 'chapters', 'questions', 'videos', 'users', 'analytics'],
            'editor': ['subjects', 'chapters', 'questions'],
            'reviewer': ['questions', 'analytics']
        };

        const allowedFeatures = roleElements[this.userRole] || [];
        
        // Hide/show navigation items based on role
        document.querySelectorAll('.nav-item').forEach(item => {
            const feature = item.getAttribute('data-feature');
            if (feature && !allowedFeatures.includes('all') && !allowedFeatures.includes(feature)) {
                item.style.display = 'none';
            }
        });
    }

    showLoginModal() {
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Admin Login</h3>
                <form id="adminLoginForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" id="adminEmail" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Password</label>
                        <input type="password" id="adminPassword" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <button type="submit" class="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold">
                        Login
                    </button>
                </form>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupLoginForm();
    }

    setupLoginForm() {
        const form = document.getElementById('adminLoginForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });
    }

    async handleAdminLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        // Simulate admin authentication
        const adminUsers = {
            'admin@nepaledu.com': { role: 'admin', name: 'Admin User' },
            'super@nepaledu.com': { role: 'super_admin', name: 'Super Admin' },
            'editor@nepaledu.com': { role: 'editor', name: 'Editor User' },
            'reviewer@nepaledu.com': { role: 'reviewer', name: 'Reviewer User' }
        };

        if (adminUsers[email] && password === 'admin123') {
            this.currentUser = { email, ...adminUsers[email] };
            this.userRole = adminUsers[email].role;
            localStorage.setItem('adminUser', JSON.stringify(this.currentUser));
            
            window.app.closeModal();
            this.updateUIForRole();
            this.loadDashboardData();
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials!', 'error');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // CRUD Operations
        this.setupCRUDEventListeners();
        
        // Bulk Upload
        this.setupBulkUpload();
        
        // Content Scraping
        this.setupContentScraping();
        
        // Notifications
        this.setupNotifications();
    }

    setupCRUDEventListeners() {
        // Add buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addSubjectBtn') this.showAddSubjectModal();
            if (e.target.id === 'addChapterBtn') this.showAddChapterModal();
            if (e.target.id === 'addQuestionBtn') this.showAddQuestionModal();
            if (e.target.id === 'addVideoBtn') this.showAddVideoModal();
            if (e.target.id === 'addUserBtn') this.showAddUserModal();
        });

        // Edit/Delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                const id = e.target.dataset.id;
                const type = e.target.dataset.type;
                this.editItem(type, id);
            }
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.dataset.id;
                const type = e.target.dataset.type;
                this.deleteItem(type, id);
            }
        });
    }

    setupBulkUpload() {
        const bulkUploadBtn = document.getElementById('bulkUploadBtn');
        if (bulkUploadBtn) {
            bulkUploadBtn.addEventListener('click', () => this.showBulkUploadModal());
        }
    }

    setupContentScraping() {
        const scrapeBtn = document.getElementById('scrapeContentBtn');
        if (scrapeBtn) {
            scrapeBtn.addEventListener('click', () => this.showContentScrapingModal());
        }
    }

    setupNotifications() {
        // Check for new notifications every 30 seconds
        setInterval(() => {
            this.checkForNotifications();
        }, 30000);
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            document.getElementById('pageTitle').textContent = this.getSectionTitle(sectionName);
        }

        // Load section data
        this.loadSectionData(sectionName);
    }

    getSectionTitle(sectionName) {
        const titles = {
            'dashboard': 'Dashboard',
            'subjects': 'Manage Subjects',
            'chapters': 'Manage Chapters',
            'questions': 'Manage Questions',
            'videos': 'Manage Videos',
            'users': 'Manage Users',
            'analytics': 'Analytics',
            'settings': 'Settings'
        };
        return titles[sectionName] || 'Dashboard';
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'subjects':
                this.loadSubjectsTable();
                break;
            case 'chapters':
                this.loadChaptersTable();
                break;
            case 'questions':
                this.loadQuestionsTable();
                break;
            case 'videos':
                this.loadVideosGrid();
                break;
            case 'users':
                this.loadUsersTable();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    // CRUD Operations
    showAddSubjectModal() {
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Add New Subject</h3>
                <form id="addSubjectForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Subject Name</label>
                        <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Color Theme</label>
                        <select name="color" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="primary">Blue</option>
                            <option value="secondary">Green</option>
                            <option value="purple">Purple</option>
                            <option value="yellow">Yellow</option>
                        </select>
                    </div>
                    <div class="flex space-x-4">
                        <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold">Add Subject</button>
                        <button type="button" onclick="window.app.closeModal()" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupFormSubmission('addSubjectForm', 'subject');
    }

    showAddChapterModal() {
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Add New Chapter</h3>
                <form id="addChapterForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Subject</label>
                        <select name="subjectId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Select Subject</option>
                            ${this.getSubjectsOptions()}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Chapter Name</label>
                        <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                    <div class="flex space-x-4">
                        <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold">Add Chapter</button>
                        <button type="button" onclick="window.app.closeModal()" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupFormSubmission('addChapterForm', 'chapter');
    }

    showAddQuestionModal() {
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Add New Question</h3>
                <form id="addQuestionForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Chapter</label>
                        <select name="chapterId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="">Select Chapter</option>
                            ${this.getChaptersOptions()}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Question Type</label>
                        <select name="type" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                            <option value="fill_blank">Fill in the Blank</option>
                            <option value="short_answer">Short Answer</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Question Text</label>
                        <textarea name="question" rows="3" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                    <div id="optionsContainer" class="space-y-2">
                        <label class="block text-sm font-medium">Options</label>
                        <input type="text" name="option1" placeholder="Option A" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <input type="text" name="option2" placeholder="Option B" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <input type="text" name="option3" placeholder="Option C" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <input type="text" name="option4" placeholder="Option D" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Correct Answer</label>
                        <input type="text" name="correctAnswer" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Explanation</label>
                        <textarea name="explanation" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                    <div class="flex space-x-4">
                        <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold">Add Question</button>
                        <button type="button" onclick="window.app.closeModal()" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupFormSubmission('addQuestionForm', 'question');
    }

    setupFormSubmission(formId, type) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, type);
            });
        }
    }

    async handleFormSubmission(form, type) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Save to localStorage for now (in real app, this would be an API call)
            const items = JSON.parse(localStorage.getItem(`${type}s`) || '[]');
            const newItem = {
                id: Date.now(),
                ...data,
                createdAt: new Date().toISOString(),
                createdBy: this.currentUser.email
            };

            items.push(newItem);
            localStorage.setItem(`${type}s`, JSON.stringify(items));

            // Save to version history
            this.saveToVersionHistory(type, newItem);

            window.app.closeModal();
            this.showNotification(`${type} added successfully!`, 'success');
            this.loadSectionData(this.getCurrentSection());
        } catch (error) {
            this.showNotification(`Failed to add ${type}`, 'error');
        }
    }

    // Bulk Upload
    showBulkUploadModal() {
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Bulk Content Upload</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Content Type</label>
                        <select id="bulkContentType" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="subjects">Subjects</option>
                            <option value="chapters">Chapters</option>
                            <option value="questions">Questions</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Upload File (CSV/JSON)</label>
                        <input type="file" id="bulkUploadFile" accept=".csv,.json" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Or Paste JSON Data</label>
                        <textarea id="bulkJsonData" rows="6" placeholder="Paste your JSON data here..." class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                    <div class="flex space-x-4">
                        <button onclick="window.adminDashboard.processBulkUpload()" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold">Upload</button>
                        <button onclick="window.app.closeModal()" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    async processBulkUpload() {
        const contentType = document.getElementById('bulkContentType').value;
        const file = document.getElementById('bulkUploadFile').files[0];
        const jsonData = document.getElementById('bulkJsonData').value;

        try {
            let data = [];

            if (file) {
                if (file.name.endsWith('.csv')) {
                    data = await this.parseCSV(file);
                } else if (file.name.endsWith('.json')) {
                    data = JSON.parse(await file.text());
                }
            } else if (jsonData) {
                data = JSON.parse(jsonData);
            }

            if (data.length > 0) {
                // Save bulk data
                const existing = JSON.parse(localStorage.getItem(`${contentType}s`) || '[]');
                const newItems = data.map(item => ({
                    ...item,
                    id: Date.now() + Math.random(),
                    createdAt: new Date().toISOString(),
                    createdBy: this.currentUser.email
                }));

                localStorage.setItem(`${contentType}s`, JSON.stringify([...existing, ...newItems]));

                // Save to version history
                this.saveToVersionHistory(contentType, newItems);

                window.app.closeModal();
                this.showNotification(`${newItems.length} ${contentType} uploaded successfully!`, 'success');
                this.loadSectionData(this.getCurrentSection());
            }
        } catch (error) {
            this.showNotification('Failed to process upload. Please check your file format.', 'error');
        }
    }

    async parseCSV(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split('\n');
                const headers = lines[0].split(',');
                const data = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header.trim()] = values[index]?.trim() || '';
                    });
                    return obj;
                });
                resolve(data);
            };
            reader.readAsText(file);
        });
    }

    // Content Scraping
    showContentScrapingModal() {
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Smart Content Scraping</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">URL to Scrape</label>
                        <input type="url" id="scrapeUrl" placeholder="https://example.com/educational-content" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Subject</label>
                        <select id="scrapeSubject" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="Nepali">Nepali</option>
                        </select>
                    </div>
                    <div class="flex space-x-4">
                        <button onclick="window.adminDashboard.processContentScraping()" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold">Scrape & Structure</button>
                        <button onclick="window.app.closeModal()" class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    async processContentScraping() {
        const url = document.getElementById('scrapeUrl').value;
        const subject = document.getElementById('scrapeSubject').value;

        if (!url) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }

        try {
            this.showNotification('Scraping content...', 'info');

            if (window.aiIntegration && window.aiIntegration.isAvailable()) {
                const scrapedData = await window.aiIntegration.scrapeAndStructureContent(url, subject);
                
                if (scrapedData.chapters && scrapedData.chapters.length > 0) {
                    // Save scraped content
                    const existing = JSON.parse(localStorage.getItem('chapters') || '[]');
                    const newChapters = scrapedData.chapters.map(chapter => ({
                        ...chapter,
                        id: Date.now() + Math.random(),
                        subject: subject,
                        createdAt: new Date().toISOString(),
                        createdBy: this.currentUser.email,
                        source: url
                    }));

                    localStorage.setItem('chapters', JSON.stringify([...existing, ...newChapters]));

                    window.app.closeModal();
                    this.showNotification(`${newChapters.length} chapters scraped successfully!`, 'success');
                    this.loadSectionData('chapters');
                } else {
                    this.showNotification('No content found to scrape', 'warning');
                }
            } else {
                this.showNotification('AI integration not available', 'error');
            }
        } catch (error) {
            this.showNotification('Failed to scrape content', 'error');
        }
    }

    // Content Versioning
    saveToVersionHistory(type, item) {
        if (!this.contentHistory[type]) {
            this.contentHistory[type] = [];
        }

        this.contentHistory[type].push({
            item: item,
            timestamp: new Date().toISOString(),
            action: 'created',
            user: this.currentUser.email
        });

        localStorage.setItem('contentHistory', JSON.stringify(this.contentHistory));
    }

    showVersionHistory(type, itemId) {
        const history = this.contentHistory[type] || [];
        const itemHistory = history.filter(h => h.item.id == itemId);

        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Version History</h3>
                <div class="space-y-4">
                    ${itemHistory.map(version => `
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">${version.action}</span>
                                <span class="text-sm text-gray-500">${new Date(version.timestamp).toLocaleString()}</span>
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">By: ${version.user}</div>
                            <button onclick="window.adminDashboard.revertToVersion('${type}', ${version.item.id})" class="mt-2 text-primary-500 hover:text-primary-600 text-sm">Revert to this version</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    revertToVersion(type, itemId) {
        // Implementation for reverting to a previous version
        this.showNotification('Version reverted successfully!', 'success');
        window.app.closeModal();
    }

    // Real-time Notifications
    setupRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.checkForNewContent();
            this.updateAnalytics();
        }, 60000); // Check every minute
    }

    checkForNewContent() {
        // Check for new user registrations, quiz completions, etc.
        const newUsers = Math.floor(Math.random() * 5);
        if (newUsers > 0) {
            this.addNotification(`${newUsers} new users registered`, 'info');
        }
    }

    addNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.showNotificationBadge();
        this.saveNotifications();
    }

    showNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    saveNotifications() {
        localStorage.setItem('adminNotifications', JSON.stringify(this.notifications));
    }

    loadNotifications() {
        const saved = localStorage.getItem('adminNotifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
        }
    }

    // Utility Methods
    getSubjectsOptions() {
        const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
        return subjects.map(subject => 
            `<option value="${subject.id}">${subject.name}</option>`
        ).join('');
    }

    getChaptersOptions() {
        const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
        return chapters.map(chapter => 
            `<option value="${chapter.id}">${chapter.name}</option>`
        ).join('');
    }

    getCurrentSection() {
        const activeSection = document.querySelector('.page-section:not(.hidden)');
        return activeSection ? activeSection.id : 'dashboard';
    }

    loadDashboardData() {
        this.loadNotifications();
        this.showNotificationBadge();
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

    // Table Loading Methods
    loadSubjectsTable() {
        const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
        const tbody = document.getElementById('subjectsTableBody');
        
        if (tbody) {
            tbody.innerHTML = subjects.map(subject => `
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4">${subject.name}</td>
                    <td class="py-3 px-4">${subject.chapters || 0}</td>
                    <td class="py-3 px-4">${subject.questions || 0}</td>
                    <td class="py-3 px-4">${subject.videos || 0}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">Active</span>
                    </td>
                    <td class="py-3 px-4">
                        <button class="edit-btn text-blue-500 hover:text-blue-700 mr-2" data-id="${subject.id}" data-type="subject">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn text-red-500 hover:text-red-700" data-id="${subject.id}" data-type="subject">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadChaptersTable() {
        const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
        const tbody = document.getElementById('chaptersTableBody');
        
        if (tbody) {
            tbody.innerHTML = chapters.map(chapter => `
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4">${chapter.name}</td>
                    <td class="py-3 px-4">${chapter.subject || 'N/A'}</td>
                    <td class="py-3 px-4">${chapter.questions || 0}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">Active</span>
                    </td>
                    <td class="py-3 px-4">
                        <button class="edit-btn text-blue-500 hover:text-blue-700 mr-2" data-id="${chapter.id}" data-type="chapter">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn text-red-500 hover:text-red-700" data-id="${chapter.id}" data-type="chapter">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadQuestionsTable() {
        const questions = JSON.parse(localStorage.getItem('questions') || '[]');
        const tbody = document.getElementById('questionsTableBody');
        
        if (tbody) {
            tbody.innerHTML = questions.map(question => `
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4">${question.question.substring(0, 50)}...</td>
                    <td class="py-3 px-4">${question.chapter || 'N/A'}</td>
                    <td class="py-3 px-4">${question.type}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">Active</span>
                    </td>
                    <td class="py-3 px-4">
                        <button class="edit-btn text-blue-500 hover:text-blue-700 mr-2" data-id="${question.id}" data-type="question">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn text-red-500 hover:text-red-700" data-id="${question.id}" data-type="question">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadVideosGrid() {
        const videos = JSON.parse(localStorage.getItem('videos') || '[]');
        const grid = document.getElementById('videosGrid');
        
        if (grid) {
            grid.innerHTML = videos.map(video => `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div class="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <i class="fas fa-play text-4xl text-gray-400"></i>
                    </div>
                    <div class="p-4">
                        <h4 class="font-semibold mb-2">${video.title}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${video.subject} - ${video.chapter}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-gray-500">${video.duration}</span>
                            <div class="flex space-x-2">
                                <button class="text-blue-500 hover:text-blue-700">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-500 hover:text-red-700">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    loadUsersTable() {
        const users = [
            { name: 'Ram Kumar', email: 'ram@example.com', level: 5, xp: 1250, status: 'active' },
            { name: 'Sita Sharma', email: 'sita@example.com', level: 4, xp: 980, status: 'active' },
            { name: 'Hari Thapa', email: 'hari@example.com', level: 3, xp: 750, status: 'inactive' }
        ];
        
        const tbody = document.getElementById('usersTableBody');
        
        if (tbody) {
            tbody.innerHTML = users.map(user => `
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4">${user.name}</td>
                    <td class="py-3 px-4">${user.email}</td>
                    <td class="py-3 px-4">${user.level}</td>
                    <td class="py-3 px-4">${user.xp}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 ${user.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'} rounded-full text-xs">${user.status}</span>
                    </td>
                    <td class="py-3 px-4">
                        <button class="text-blue-500 hover:text-blue-700 mr-2">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-700">
                            <i class="fas fa-ban"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadAnalytics() {
        // Load analytics charts and data
        this.loadUserGrowthChart();
        this.loadSubjectChart();
    }

    loadUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Users',
                        data: [1200, 1900, 3000, 5000, 2000, 3000],
                        borderColor: 'rgb(59, 130, 246)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }
    }

    loadSubjectChart() {
        const ctx = document.getElementById('subjectChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Mathematics', 'Science', 'English', 'Nepali'],
                    datasets: [{
                        data: [30, 25, 20, 25],
                        backgroundColor: [
                            'rgb(59, 130, 246)',
                            'rgb(34, 197, 94)',
                            'rgb(168, 85, 247)',
                            'rgb(251, 191, 36)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    }
                }
            });
        }
    }

    editItem(type, id) {
        // Implementation for editing items
        this.showNotification(`Editing ${type} ${id}`, 'info');
    }

    deleteItem(type, id) {
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            // Implementation for deleting items
            this.showNotification(`${type} deleted successfully!`, 'success');
            this.loadSectionData(this.getCurrentSection());
        }
    }

    // Enhanced animations for admin panel
    setupEnhancedAnimations() {
        // Sidebar animations
        this.setupSidebarAnimations();
        
        // Widget animations
        this.setupWidgetAnimations();
        
        // Table animations
        this.setupTableAnimations();
        
        // Chart animations
        this.setupChartAnimations();
    }

    setupSidebarAnimations() {
        const sidebar = document.getElementById('sidebar');
        const navItems = document.querySelectorAll('.nav-item');
        
        // Animate nav items on load
        navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });

        // Sidebar toggle animation
        const sidebarToggle = document.getElementById('sidebarToggle');
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.getElementById('mainContent').classList.toggle('expanded');
            
            // Animate toggle button
            sidebarToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                sidebarToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    setupWidgetAnimations() {
        const widgets = document.querySelectorAll('.admin-widget');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        }, { threshold: 0.1 });

        widgets.forEach(widget => {
            observer.observe(widget);
        });
    }

    setupTableAnimations() {
        const tableRows = document.querySelectorAll('.admin-table tbody tr');
        
        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    setupChartAnimations() {
        const charts = document.querySelectorAll('.chart-container');
        
        charts.forEach(chart => {
            chart.addEventListener('mouseenter', () => {
                chart.style.transform = 'scale(1.02)';
            });
            
            chart.addEventListener('mouseleave', () => {
                chart.style.transform = 'scale(1)';
            });
        });
    }

    // Enhanced tooltip system for admin
    setupEnhancedTooltips() {
        const tooltipElements = document.querySelectorAll('[data-admin-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showAdminTooltip(e.target, e.target.getAttribute('data-admin-tooltip'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideAdminTooltip();
            });
        });
    }

    showAdminTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'admin-custom-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        // Animate in
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        }, 10);

        this.currentAdminTooltip = tooltip;
    }

    hideAdminTooltip() {
        if (this.currentAdminTooltip) {
            this.currentAdminTooltip.style.opacity = '0';
            this.currentAdminTooltip.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (this.currentAdminTooltip && this.currentAdminTooltip.parentNode) {
                    this.currentAdminTooltip.parentNode.removeChild(this.currentAdminTooltip);
                }
                this.currentAdminTooltip = null;
            }, 300);
        }
    }

    // Enhanced keyboard shortcuts for admin
    setupEnhancedKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S for save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentSection();
            }
            
            // Ctrl/Cmd + N for new item
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showAddItemModal();
            }
            
            // Ctrl/Cmd + F for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.querySelector('input[type="text"]').focus();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllAdminModals();
            }
        });
    }

    saveCurrentSection() {
        const currentSection = this.getCurrentSection();
        this.showEnhancedNotification(`Saving ${currentSection}...`, 'info');
        
        // Simulate save operation
        setTimeout(() => {
            this.showEnhancedNotification(`${currentSection} saved successfully!`, 'success');
        }, 1000);
    }

    showAddItemModal() {
        const currentSection = this.getCurrentSection();
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">Add New ${currentSection.slice(0, -1)}</h3>
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 admin-input">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 admin-input"></textarea>
                    </div>
                    <div class="flex space-x-3">
                        <button type="submit" class="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold admin-btn">
                            Add ${currentSection.slice(0, -1)}
                        </button>
                        <button type="button" onclick="this.closest('.admin-modal-overlay').remove()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold admin-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.showEnhancedAdminModal(modalContent);
    }

    closeAllAdminModals() {
        document.querySelectorAll('.admin-modal-overlay').forEach(modal => {
            this.closeEnhancedAdminModal(modal);
        });
    }

    // Enhanced hover effects for admin
    setupEnhancedHoverEffects() {
        // Add hover effects to interactive elements
        document.querySelectorAll('.admin-btn, .nav-item, .admin-widget').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Enhanced table row hover effects
        document.querySelectorAll('.admin-table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                row.style.transform = 'scale(1.01)';
            });
            
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
                row.style.transform = 'scale(1)';
            });
        });
    }

    // Enhanced notification system for admin
    showEnhancedNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <i class="fas ${this.getAdminNotificationIcon(type)} text-lg"></i>
                <span>${message}</span>
                <button class="ml-auto text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, duration);
    }

    getAdminNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle text-green-500',
            error: 'fa-exclamation-circle text-red-500',
            warning: 'fa-exclamation-triangle text-yellow-500',
            info: 'fa-info-circle text-blue-500'
        };
        return icons[type] || icons.info;
    }

    // Enhanced modal system for admin
    showEnhancedAdminModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'admin-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="admin-modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.querySelector('.admin-modal-content').classList.add('show');
        }, 10);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeEnhancedAdminModal(modal);
            }
        });

        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeEnhancedAdminModal(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        return modal;
    }

    closeEnhancedAdminModal(modal) {
        const content = modal.querySelector('.admin-modal-content');
        content.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Enhanced loading states for admin
    showAdminLoadingState(element) {
        element.classList.add('admin-loading');
        element.style.pointerEvents = 'none';
    }

    hideAdminLoadingState(element) {
        element.classList.remove('admin-loading');
        element.style.pointerEvents = 'auto';
    }

    // Enhanced search with debouncing for admin
    setupEnhancedAdminSearch() {
        let searchTimeout;
        const searchInput = document.querySelector('.admin-search input');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performAdminSearch(e.target.value);
                }, 300);
            });
        }
    }

    performAdminSearch(query) {
        // Implement admin search functionality
        console.log('Admin search:', query);
        this.showEnhancedNotification(`Searching for: ${query}`, 'info');
    }
}

// Initialize admin dashboard
window.adminDashboard = new AdminDashboard(); 