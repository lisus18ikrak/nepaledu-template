// NepalEdu - Free Educational Website Template
// --------------------------------------------------
// This is the main JavaScript file. Edit functions and logic below to customize features.
// See README.md for more info.

// Main Application JavaScript
class NepalEduApp {
    constructor() {
        this.currentUser = null;
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.searchResults = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDarkMode();
        this.setupScrollProgress();
        this.setupCursorEffect();
        this.loadUserData();
        this.initializeSearch();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // User menu
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        userMenuBtn.addEventListener('click', () => this.toggleUserMenu());

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('focus', () => this.expandSearchBar());
        searchInput.addEventListener('blur', () => this.collapseSearchBar());

        // Modal close
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        searchInput.focus();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleDarkMode();
                        break;
                }
            }
        });

        // Chatbot UI
        const chatbotBtn = document.getElementById('chatbotBtn');
        const chatbotModal = document.getElementById('chatbotModal');
        const closeChatbot = document.getElementById('closeChatbot');
        chatbotBtn.addEventListener('click', () => chatbotModal.classList.remove('hidden'));
        closeChatbot.addEventListener('click', () => chatbotModal.classList.add('hidden'));

        // Study Planner UI
        const studyPlannerModal = document.getElementById('studyPlannerModal');
        const closeStudyPlanner = document.getElementById('closeStudyPlanner');
        document.querySelectorAll('[data-open-study-planner]').forEach(btn =>
            btn.addEventListener('click', () => studyPlannerModal.classList.remove('hidden'))
        );
        closeStudyPlanner.addEventListener('click', () => studyPlannerModal.classList.add('hidden'));

        // Adaptive Suggestions UI
        const adaptiveSuggestionsModal = document.getElementById('adaptiveSuggestionsModal');
        const closeAdaptiveSuggestions = document.getElementById('closeAdaptiveSuggestions');
        document.querySelectorAll('[data-open-adaptive-suggestions]').forEach(btn =>
            btn.addEventListener('click', () => adaptiveSuggestionsModal.classList.remove('hidden'))
        );
        closeAdaptiveSuggestions.addEventListener('click', () => adaptiveSuggestionsModal.classList.add('hidden'));

        // Flashcards UI
        const flashcardsModal = document.getElementById('flashcardsModal');
        const closeFlashcards = document.getElementById('closeFlashcards');
        document.querySelectorAll('[data-open-flashcards]').forEach(btn =>
            btn.addEventListener('click', () => flashcardsModal.classList.remove('hidden'))
        );
        closeFlashcards.addEventListener('click', () => flashcardsModal.classList.add('hidden'));

        // Advanced Search UI
        const advancedSearchBar = document.getElementById('advancedSearchBar');
        const advancedSearchBtn = document.getElementById('advancedSearchBtn');
        const advancedSearchResults = document.getElementById('advancedSearchResults');
        advancedSearchBtn.addEventListener('click', () => {
            const query = document.getElementById('advancedSearchInput').value;
            const subject = document.getElementById('searchSubjectFilter').value;
            const type = document.getElementById('searchTypeFilter').value;
            const difficulty = document.getElementById('searchDifficultyFilter').value;
            this.performAdvancedSearch(query, subject, type, difficulty);
        });
    }

    initializeDarkMode() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.documentElement.classList.toggle('dark', this.isDarkMode);
        localStorage.setItem('darkMode', this.isDarkMode);
        
        // Animate the toggle
        const toggle = document.getElementById('darkModeToggle');
        toggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            toggle.style.transform = 'rotate(0deg)';
        }, 300);
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('hidden');
    }

    setupScrollProgress() {
        const progressBar = document.getElementById('progressBar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    setupCursorEffect() {
        const cursor = document.getElementById('cursorGlow');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Add hover effect for interactive elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('button, a, .floating-card, .nav-link')) {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('button, a, .floating-card, .nav-link')) {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)';
            }
        });
    }

    loadUserData() {
        // Load user data from localStorage or API
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUserInterface();
        }
    }

    updateUserInterface() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (this.currentUser) {
            userMenuBtn.innerHTML = `
                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-white"></i>
                </div>
                <span class="hidden sm:block">${this.currentUser.name}</span>
            `;
        }
    }

    initializeSearch() {
        this.searchData = {
            subjects: [],
            chapters: [],
            questions: [],
            pastPapers: []
        };
        
        // Load search data (in a real app, this would come from an API)
        this.loadSearchData();
    }

    async loadSearchData() {
        // Simulate loading search data
        this.searchData = {
            subjects: [
                { id: 1, name: 'Mathematics', type: 'subject' },
                { id: 2, name: 'Science', type: 'subject' },
                { id: 3, name: 'English', type: 'subject' },
                { id: 4, name: 'Nepali', type: 'subject' }
            ],
            chapters: [
                { id: 1, name: 'Algebra', subject: 'Mathematics', type: 'chapter' },
                { id: 2, name: 'Geometry', subject: 'Mathematics', type: 'chapter' },
                { id: 3, name: 'Physics', subject: 'Science', type: 'chapter' },
                { id: 4, name: 'Chemistry', subject: 'Science', type: 'chapter' }
            ],
            questions: [
                { id: 1, text: 'Solve the quadratic equation', chapter: 'Algebra', type: 'question' },
                { id: 2, text: 'Find the area of a circle', chapter: 'Geometry', type: 'question' }
            ]
        };
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        const results = this.performSearch(query);
        this.displaySearchResults(results, query);
    }

    performSearch(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        // Search in subjects
        this.searchData.subjects.forEach(subject => {
            if (subject.name.toLowerCase().includes(searchTerm)) {
                results.push({ ...subject, relevance: 1 });
            }
        });

        // Search in chapters
        this.searchData.chapters.forEach(chapter => {
            if (chapter.name.toLowerCase().includes(searchTerm) || 
                chapter.subject.toLowerCase().includes(searchTerm)) {
                results.push({ ...chapter, relevance: 0.8 });
            }
        });

        // Search in questions
        this.searchData.questions.forEach(question => {
            if (question.text.toLowerCase().includes(searchTerm) || 
                question.chapter.toLowerCase().includes(searchTerm)) {
                results.push({ ...question, relevance: 0.6 });
            }
        });

        // Sort by relevance
        return results.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
    }

    displaySearchResults(results, query) {
        const searchInput = document.getElementById('searchInput');
        const searchContainer = searchInput.parentElement;

        // Remove existing results
        const existingResults = searchContainer.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }

        if (results.length === 0) {
            return;
        }

        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50';

        const resultsList = document.createElement('div');
        resultsList.className = 'py-2';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors';
            
            let icon = '';
            let color = '';
            
            switch (result.type) {
                case 'subject':
                    icon = 'fas fa-book';
                    color = 'text-primary-500';
                    break;
                case 'chapter':
                    icon = 'fas fa-file-alt';
                    color = 'text-secondary-500';
                    break;
                case 'question':
                    icon = 'fas fa-question-circle';
                    color = 'text-purple-500';
                    break;
            }

            resultItem.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="${icon} ${color}"></i>
                    <div>
                        <div class="font-medium">${result.name || result.text}</div>
                        ${result.subject ? `<div class="text-sm text-gray-500">${result.subject}</div>` : ''}
                    </div>
                </div>
            `;

            resultItem.addEventListener('click', () => {
                this.handleSearchResultClick(result);
                this.hideSearchResults();
            });

            resultsList.appendChild(resultItem);
        });

        resultsContainer.appendChild(resultsList);
        searchContainer.appendChild(resultsContainer);
    }

    hideSearchResults() {
        const searchContainer = document.getElementById('searchInput').parentElement;
        const existingResults = searchContainer.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
    }

    handleSearchResultClick(result) {
        // Handle navigation to the selected result
        switch (result.type) {
            case 'subject':
                this.navigateToSubject(result.id);
                break;
            case 'chapter':
                this.navigateToChapter(result.id);
                break;
            case 'question':
                this.navigateToQuestion(result.id);
                break;
        }
    }

    navigateToSubject(subjectId) {
        // Navigate to subject page
        console.log(`Navigating to subject ${subjectId}`);
        // In a real app, this would navigate to the subject page
    }

    navigateToChapter(chapterId) {
        // Navigate to chapter page
        console.log(`Navigating to chapter ${chapterId}`);
        // In a real app, this would navigate to the chapter page
    }

    navigateToQuestion(questionId) {
        // Navigate to question page
        console.log(`Navigating to question ${questionId}`);
        // In a real app, this would navigate to the question page
    }

    expandSearchBar() {
        const searchBar = document.querySelector('.search-bar');
        searchBar.style.transform = 'scale(1.02)';
    }

    collapseSearchBar() {
        const searchBar = document.querySelector('.search-bar');
        searchBar.style.transform = 'scale(1)';
    }

    smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupAnimations() {
        // GSAP ScrollTrigger animations
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations
        gsap.from('.hero-content h1', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-content p', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-content .btn', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            delay: 0.6,
            ease: 'back.out(1.7)'
        });

        // Floating cards animation
        gsap.from('.floating-card', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.floating-card',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        // Subject cards animation
        gsap.from('.subject-card', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.subjects-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        // Stats animation
        gsap.from('.stat-item', {
            duration: 1,
            scale: 0,
            opacity: 0,
            stagger: 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.stats-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        // Features animation
        gsap.from('.feature-item', {
            duration: 0.8,
            x: -50,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        // Testimonials animation
        gsap.from('.testimonial-card', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.testimonials-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        // Parallax effect for hero background
        gsap.to('.hero-bg', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Floating animation for cards
        gsap.to('.floating-card', {
            y: -10,
            duration: 2,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1
        });

        // Counter animation for stats
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                onEnter: () => updateCounter()
            });
        });
    }

    // Enhanced tooltip system
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
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

        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.style.opacity = '0';
            this.currentTooltip.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.parentNode.removeChild(this.currentTooltip);
                }
                this.currentTooltip = null;
            }, 300);
        }
    }

    // Enhanced scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    // Enhanced loading states
    showLoadingState(element) {
        element.classList.add('loading-skeleton');
        element.style.pointerEvents = 'none';
    }

    hideLoadingState(element) {
        element.classList.remove('loading-skeleton');
        element.style.pointerEvents = 'auto';
    }

    // Enhanced notification system
    showEnhancedNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3 p-4 rounded-lg shadow-lg">
                <i class="fas ${this.getNotificationIcon(type)} text-lg"></i>
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

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle text-green-500',
            error: 'fa-exclamation-circle text-red-500',
            warning: 'fa-exclamation-triangle text-yellow-500',
            info: 'fa-info-circle text-blue-500'
        };
        return icons[type] || icons.info;
    }

    // Enhanced modal system
    showEnhancedModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.querySelector('.modal-content').classList.add('show');
        }, 10);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeEnhancedModal(modal);
            }
        });

        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeEnhancedModal(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        return modal;
    }

    closeEnhancedModal(modal) {
        const content = modal.querySelector('.modal-content');
        content.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Enhanced search with debouncing
    setupEnhancedSearch() {
        let searchTimeout;
        const searchInput = document.getElementById('searchInput');
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });
    }

    // Enhanced keyboard shortcuts
    setupEnhancedKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
            
            // Ctrl/Cmd + D for dark mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleDarkMode();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            this.closeEnhancedModal(modal);
        });
    }

    // Enhanced hover effects
    setupEnhancedHoverEffects() {
        // Add hover effects to interactive elements
        document.querySelectorAll('button, a, .floating-card, .subject-card').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    showModal(content) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = content;
        modalOverlay.classList.remove('hidden');
        
        // Animate modal
        gsap.fromTo(modalContent,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3 }
        );
    }

    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        
        gsap.to(modalContent, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                modalOverlay.classList.add('hidden');
            }
        });
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('hidden');
    }

    // User authentication methods
    async login(email, password) {
        this.showLoading();
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.currentUser = {
                id: 1,
                name: 'Student User',
                email: email,
                xp: 1250,
                level: 5,
                avatar: null
            };
            
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            this.updateUserInterface();
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            this.hideLoading();
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('user');
        this.updateUserInterface();
    }

    // Progress tracking
    updateProgress(chapterId, completed) {
        if (!this.currentUser) return;
        
        let progress = JSON.parse(localStorage.getItem('progress') || '{}');
        progress[chapterId] = completed;
        localStorage.setItem('progress', JSON.stringify(progress));
        
        // Award XP for completion
        if (completed) {
            this.awardXP(50);
        }
    }

    awardXP(amount) {
        if (!this.currentUser) return;
        
        this.currentUser.xp += amount;
        this.currentUser.level = Math.floor(this.currentUser.xp / 250) + 1;
        
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.updateUserInterface();
        
        // Show XP notification
        this.showXPNotification(amount);
    }

    showXPNotification(amount) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-star"></i>
                <span>+${amount} XP earned!</span>
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

    // Advanced Search Logic
    performAdvancedSearch(query, subject, type, difficulty) {
        // Example: search in subjects, chapters, questions
        let results = [];
        if (window.subjectsManager) {
            results = window.subjectsManager.subjects.flatMap(subjectObj => {
                if (subject && subjectObj.name !== subject) return [];
                return subjectObj.chapters.filter(chapter => {
                    if (type && chapter.type !== type) return false;
                    if (difficulty && chapter.difficulty !== difficulty) return false;
                    return chapter.name.toLowerCase().includes(query.toLowerCase());
                }).map(chapter => ({
                    type: 'chapter',
                    name: chapter.name,
                    subject: subjectObj.name
                }));
            });
        }
        // Show results
        const advancedSearchResults = document.getElementById('advancedSearchResults');
        if (results.length === 0) {
            advancedSearchResults.innerHTML = '<div class="text-gray-500">No results found.</div>';
        } else {
            advancedSearchResults.innerHTML = results.map(r => `
                <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div class="font-semibold">${r.name}</div>
                    <div class="text-sm text-gray-500">${r.subject}</div>
                </div>
            `).join('');
        }
        advancedSearchResults.classList.remove('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NepalEduApp();
}); 
