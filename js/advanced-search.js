// Advanced Search System
class AdvancedSearchSystem {
    constructor() {
        this.searchHistory = [];
        this.savedSearches = [];
        this.searchIndex = {};
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.loadSearchHistory();
        this.loadSavedSearches();
        this.buildSearchIndex();
        this.setupEventListeners();
        this.createSearchInterface();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'advancedSearchBtn') {
                this.showAdvancedSearchModal();
            }
            if (e.target.classList.contains('search-history-item')) {
                const query = e.target.dataset.query;
                this.performSearch(query);
            }
            if (e.target.classList.contains('saved-search-item')) {
                const searchId = e.target.dataset.searchId;
                this.loadSavedSearch(searchId);
            }
            if (e.target.classList.contains('save-search-btn')) {
                this.saveCurrentSearch();
            }
            if (e.target.classList.contains('clear-filters-btn')) {
                this.clearFilters();
            }
        });

        // Search input events
        document.addEventListener('input', (e) => {
            if (e.target.id === 'searchInput') {
                this.handleSearchInput(e.target.value);
            }
        });

        // Filter changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('search-filter')) {
                this.handleFilterChange(e.target);
            }
        });
    }

    createSearchInterface() {
        // Add advanced search button to header if not exists
        const header = document.querySelector('.header') || document.querySelector('header');
        if (header && !document.getElementById('advancedSearchBtn')) {
            const searchBtn = document.createElement('button');
            searchBtn.id = 'advancedSearchBtn';
            searchBtn.className = 'bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold ml-4';
            searchBtn.innerHTML = '<i class="fas fa-search-plus mr-2"></i>Advanced Search';
            header.appendChild(searchBtn);
        }
    }

    showAdvancedSearchModal() {
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Advanced Search</h3>
                    <div class="flex space-x-2">
                        <button class="save-search-btn bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-save mr-1"></i>Save Search
                        </button>
                        <button onclick="window.app.closeModal()" class="text-gray-500 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Search Input -->
                <div class="mb-6">
                    <div class="relative">
                        <input type="text" id="searchInput" placeholder="Search for subjects, chapters, questions, or concepts..." 
                               class="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <button id="aiSearchBtn" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600">
                            <i class="fas fa-magic"></i>
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <!-- Content Type Filter -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Content Type</label>
                        <select class="search-filter w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" data-filter="contentType">
                            <option value="">All Types</option>
                            <option value="subjects">Subjects</option>
                            <option value="chapters">Chapters</option>
                            <option value="questions">Questions</option>
                            <option value="videos">Videos</option>
                            <option value="notes">Notes</option>
                        </select>
                    </div>

                    <!-- Subject Filter -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Subject</label>
                        <select class="search-filter w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" data-filter="subject">
                            <option value="">All Subjects</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="english">English</option>
                            <option value="nepali">Nepali</option>
                        </select>
                    </div>

                    <!-- Difficulty Filter -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Difficulty</label>
                        <select class="search-filter w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" data-filter="difficulty">
                            <option value="">All Levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                <!-- Additional Filters -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <!-- Date Range -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Date Range</label>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="date" class="search-filter px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" data-filter="dateFrom">
                            <input type="date" class="search-filter px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" data-filter="dateTo">
                        </div>
                    </div>

                    <!-- Tags -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Tags</label>
                        <input type="text" class="search-filter w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                               placeholder="Enter tags separated by commas" data-filter="tags">
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-between items-center mb-6">
                    <div class="flex space-x-2">
                        <button onclick="window.advancedSearch.clearFilters()" class="clear-filters-btn bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold">
                            <i class="fas fa-times mr-2"></i>Clear Filters
                        </button>
                        <button onclick="window.advancedSearch.performSearch()" class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold">
                            <i class="fas fa-search mr-2"></i>Search
                        </button>
                    </div>
                    <div class="text-sm text-gray-500">
                        <span id="resultCount">0</span> results found
                    </div>
                </div>

                <!-- Search History and Saved Searches -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Search History -->
                    <div>
                        <h4 class="font-semibold mb-3">Recent Searches</h4>
                        <div id="searchHistory" class="space-y-2 max-h-32 overflow-y-auto">
                            ${this.renderSearchHistory()}
                        </div>
                    </div>

                    <!-- Saved Searches -->
                    <div>
                        <h4 class="font-semibold mb-3">Saved Searches</h4>
                        <div id="savedSearches" class="space-y-2 max-h-32 overflow-y-auto">
                            ${this.renderSavedSearches()}
                        </div>
                    </div>
                </div>

                <!-- Search Results -->
                <div id="searchResults" class="mt-6 hidden">
                    <h4 class="font-semibold mb-3">Search Results</h4>
                    <div id="resultsContainer" class="space-y-4">
                        <!-- Results will be populated here -->
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupSearchModalEventListeners();
    }

    setupSearchModalEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const aiSearchBtn = document.getElementById('aiSearchBtn');

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        if (aiSearchBtn) {
            aiSearchBtn.addEventListener('click', () => {
                this.performAISearch();
            });
        }
    }

    handleSearchInput(value) {
        // Real-time search suggestions
        if (value.length >= 2) {
            this.showSearchSuggestions(value);
        } else {
            this.hideSearchSuggestions();
        }
    }

    showSearchSuggestions(query) {
        const suggestions = this.getSearchSuggestions(query);
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (!suggestionsContainer) {
            const container = document.createElement('div');
            container.id = 'searchSuggestions';
            container.className = 'absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 mt-1';
            document.getElementById('searchInput').parentElement.appendChild(container);
        }

        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" 
                     onclick="window.advancedSearch.selectSuggestion('${suggestion.text}')">
                    <i class="${suggestion.icon} mr-2 text-gray-400"></i>
                    ${suggestion.text}
                    <span class="text-xs text-gray-500 ml-2">${suggestion.type}</span>
                </div>
            `).join('');
            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    }

    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.add('hidden');
        }
    }

    selectSuggestion(text) {
        document.getElementById('searchInput').value = text;
        this.hideSearchSuggestions();
        this.performSearch();
    }

    getSearchSuggestions(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();

        // Search in subjects
        const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
        subjects.forEach(subject => {
            if (subject.name.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: subject.name,
                    type: 'Subject',
                    icon: 'fas fa-book'
                });
            }
        });

        // Search in chapters
        const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
        chapters.forEach(chapter => {
            if (chapter.name.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: chapter.name,
                    type: 'Chapter',
                    icon: 'fas fa-list-ol'
                });
            }
        });

        // Search in questions
        const questions = JSON.parse(localStorage.getItem('questions') || '[]');
        questions.forEach(question => {
            if (question.question.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: question.question.substring(0, 50) + '...',
                    type: 'Question',
                    icon: 'fas fa-question-circle'
                });
            }
        });

        return suggestions.slice(0, 5); // Limit to 5 suggestions
    }

    handleFilterChange(element) {
        const filterName = element.dataset.filter;
        const filterValue = element.value;
        
        if (filterValue) {
            this.currentFilters[filterName] = filterValue;
        } else {
            delete this.currentFilters[filterName];
        }
    }

    async performSearch(query = null) {
        const searchQuery = query || document.getElementById('searchInput')?.value || '';
        
        if (!searchQuery.trim() && Object.keys(this.currentFilters).length === 0) {
            this.showNotification('Please enter a search query or select filters', 'warning');
            return;
        }

        try {
            // Show loading state
            this.showLoadingState();

            // Perform the search
            const results = await this.executeSearch(searchQuery, this.currentFilters);
            
            // Display results
            this.displaySearchResults(results, searchQuery);
            
            // Add to search history
            this.addToSearchHistory(searchQuery);
            
        } catch (error) {
            this.showNotification('Search failed: ' + error.message, 'error');
        } finally {
            this.hideLoadingState();
        }
    }

    async executeSearch(query, filters) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        // Search in different content types
        const searchTypes = filters.contentType ? [filters.contentType] : ['subjects', 'chapters', 'questions', 'videos'];

        for (const type of searchTypes) {
            const items = JSON.parse(localStorage.getItem(type) || '[]');
            
            for (const item of items) {
                if (this.matchesSearchCriteria(item, query, filters)) {
                    results.push({
                        ...item,
                        type: type,
                        relevance: this.calculateRelevance(item, query)
                    });
                }
            }
        }

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);

        return results;
    }

    matchesSearchCriteria(item, query, filters) {
        // Text search
        if (query) {
            const searchableText = this.getSearchableText(item);
            if (!searchableText.toLowerCase().includes(query.toLowerCase())) {
                return false;
            }
        }

        // Filter matching
        if (filters.subject && item.subject && item.subject.toLowerCase() !== filters.subject.toLowerCase()) {
            return false;
        }

        if (filters.difficulty && item.difficulty && item.difficulty !== filters.difficulty) {
            return false;
        }

        if (filters.tags && item.tags) {
            const itemTags = Array.isArray(item.tags) ? item.tags : item.tags.split(',');
            const filterTags = filters.tags.split(',').map(tag => tag.trim().toLowerCase());
            const hasMatchingTag = filterTags.some(tag => 
                itemTags.some(itemTag => itemTag.toLowerCase().includes(tag))
            );
            if (!hasMatchingTag) return false;
        }

        if (filters.dateFrom && item.createdAt) {
            const itemDate = new Date(item.createdAt);
            const filterDate = new Date(filters.dateFrom);
            if (itemDate < filterDate) return false;
        }

        if (filters.dateTo && item.createdAt) {
            const itemDate = new Date(item.createdAt);
            const filterDate = new Date(filters.dateTo);
            if (itemDate > filterDate) return false;
        }

        return true;
    }

    getSearchableText(item) {
        const searchableFields = ['name', 'title', 'question', 'description', 'content'];
        return searchableFields.map(field => item[field] || '').join(' ');
    }

    calculateRelevance(item, query) {
        if (!query) return 1;

        const searchableText = this.getSearchableText(item).toLowerCase();
        const lowerQuery = query.toLowerCase();
        let relevance = 0;

        // Exact match gets highest score
        if (searchableText.includes(lowerQuery)) {
            relevance += 10;
        }

        // Partial matches
        const queryWords = lowerQuery.split(' ');
        queryWords.forEach(word => {
            if (searchableText.includes(word)) {
                relevance += 5;
            }
        });

        // Title/name matches get bonus
        if (item.name && item.name.toLowerCase().includes(lowerQuery)) {
            relevance += 3;
        }

        if (item.title && item.title.toLowerCase().includes(lowerQuery)) {
            relevance += 3;
        }

        return relevance;
    }

    displaySearchResults(results, query) {
        const resultsContainer = document.getElementById('resultsContainer');
        const resultCount = document.getElementById('resultCount');
        const searchResults = document.getElementById('searchResults');

        if (resultCount) {
            resultCount.textContent = results.length;
        }

        if (resultsContainer) {
            if (results.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i class="fas fa-search text-4xl mb-4"></i>
                        <p class="text-lg font-semibold mb-2">No results found</p>
                        <p>Try adjusting your search terms or filters</p>
                    </div>
                `;
            } else {
                resultsContainer.innerHTML = results.map(result => `
                    <div class="search-result-item border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" 
                         onclick="window.advancedSearch.handleResultClick('${result.type}', '${result.id}')">
                        <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0">
                                <i class="${this.getResultIcon(result.type)} text-lg ${this.getResultColor(result.type)}"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-gray-900 dark:text-white">${result.name || result.title || result.question?.substring(0, 50) + '...'}</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${result.description || result.content?.substring(0, 100) + '...' || ''}</p>
                                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span class="capitalize">${result.type}</span>
                                    ${result.subject ? `<span>${result.subject}</span>` : ''}
                                    ${result.difficulty ? `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">${result.difficulty}</span>` : ''}
                                    ${result.createdAt ? `<span>${new Date(result.createdAt).toLocaleDateString()}</span>` : ''}
                                </div>
                            </div>
                            <div class="flex-shrink-0">
                                <span class="text-xs text-gray-400">${Math.round(result.relevance * 10)}% match</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (searchResults) {
            searchResults.classList.remove('hidden');
        }
    }

    getResultIcon(type) {
        const icons = {
            subjects: 'fas fa-book',
            chapters: 'fas fa-list-ol',
            questions: 'fas fa-question-circle',
            videos: 'fas fa-video',
            notes: 'fas fa-sticky-note'
        };
        return icons[type] || 'fas fa-file';
    }

    getResultColor(type) {
        const colors = {
            subjects: 'text-blue-500',
            chapters: 'text-green-500',
            questions: 'text-purple-500',
            videos: 'text-red-500',
            notes: 'text-yellow-500'
        };
        return colors[type] || 'text-gray-500';
    }

    handleResultClick(type, id) {
        // Navigate to the specific content
        switch (type) {
            case 'subjects':
                if (window.app && window.app.showSection) {
                    window.app.showSection('subjects');
                }
                break;
            case 'chapters':
                if (window.app && window.app.showSection) {
                    window.app.showSection('chapters');
                }
                break;
            case 'questions':
                if (window.app && window.app.showSection) {
                    window.app.showSection('quiz');
                }
                break;
            case 'videos':
                if (window.app && window.app.showSection) {
                    window.app.showSection('videos');
                }
                break;
        }
        
        window.app.closeModal();
    }

    async performAISearch() {
        const query = document.getElementById('searchInput')?.value;
        if (!query) {
            this.showNotification('Please enter a search query first', 'warning');
            return;
        }

        try {
            this.showNotification('Using AI to enhance your search...', 'info');
            
            if (window.aiIntegration && window.aiIntegration.isAvailable()) {
                const enhancedQuery = await window.aiIntegration.enhanceSearchQuery(query);
                document.getElementById('searchInput').value = enhancedQuery;
                this.performSearch();
            } else {
                this.showNotification('AI integration not available', 'warning');
            }
        } catch (error) {
            this.showNotification('AI search failed: ' + error.message, 'error');
        }
    }

    addToSearchHistory(query) {
        if (!query.trim()) return;

        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift({
            query: query,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        this.saveSearchHistory();
        this.updateSearchHistoryDisplay();
    }

    saveCurrentSearch() {
        const query = document.getElementById('searchInput')?.value;
        if (!query) {
            this.showNotification('Please enter a search query first', 'warning');
            return;
        }

        const searchName = prompt('Enter a name for this saved search:');
        if (!searchName) return;

        const savedSearch = {
            id: Date.now() + Math.random(),
            name: searchName,
            query: query,
            filters: { ...this.currentFilters },
            timestamp: new Date().toISOString()
        };

        this.savedSearches.push(savedSearch);
        this.saveSavedSearches();
        this.updateSavedSearchesDisplay();
        
        this.showNotification('Search saved successfully!', 'success');
    }

    loadSavedSearch(searchId) {
        const savedSearch = this.savedSearches.find(search => search.id == searchId);
        if (!savedSearch) return;

        // Load the search
        document.getElementById('searchInput').value = savedSearch.query;
        
        // Load filters
        this.currentFilters = { ...savedSearch.filters };
        this.updateFilterDisplay();
        
        // Perform the search
        this.performSearch();
    }

    updateFilterDisplay() {
        // Update filter inputs with current values
        Object.entries(this.currentFilters).forEach(([filterName, value]) => {
            const filterElement = document.querySelector(`[data-filter="${filterName}"]`);
            if (filterElement) {
                filterElement.value = value;
            }
        });
    }

    clearFilters() {
        this.currentFilters = {};
        
        // Clear all filter inputs
        document.querySelectorAll('.search-filter').forEach(element => {
            element.value = '';
        });
        
        this.showNotification('Filters cleared', 'info');
    }

    renderSearchHistory() {
        return this.searchHistory.map(item => `
            <div class="search-history-item text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 cursor-pointer" 
                 data-query="${item.query}">
                <i class="fas fa-history mr-2"></i>
                ${item.query}
                <span class="text-xs text-gray-400 ml-2">${this.formatTimestamp(item.timestamp)}</span>
            </div>
        `).join('');
    }

    renderSavedSearches() {
        return this.savedSearches.map(search => `
            <div class="saved-search-item text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 cursor-pointer" 
                 data-search-id="${search.id}">
                <i class="fas fa-bookmark mr-2"></i>
                ${search.name}
                <span class="text-xs text-gray-400 ml-2">${this.formatTimestamp(search.timestamp)}</span>
            </div>
        `).join('');
    }

    updateSearchHistoryDisplay() {
        const container = document.getElementById('searchHistory');
        if (container) {
            container.innerHTML = this.renderSearchHistory();
        }
    }

    updateSavedSearchesDisplay() {
        const container = document.getElementById('savedSearches');
        if (container) {
            container.innerHTML = this.renderSavedSearches();
        }
    }

    showLoadingState() {
        const searchBtn = document.querySelector('button[onclick*="performSearch"]');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Searching...';
            searchBtn.disabled = true;
        }
    }

    hideLoadingState() {
        const searchBtn = document.querySelector('button[onclick*="performSearch"]');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Search';
            searchBtn.disabled = false;
        }
    }

    buildSearchIndex() {
        // Build a search index for faster searching
        // This is a simplified version - in a real app, you'd use a proper search engine
        this.searchIndex = {
            subjects: this.buildIndexForType('subjects'),
            chapters: this.buildIndexForType('chapters'),
            questions: this.buildIndexForType('questions'),
            videos: this.buildIndexForType('videos')
        };
    }

    buildIndexForType(type) {
        const items = JSON.parse(localStorage.getItem(type) || '[]');
        const index = {};
        
        items.forEach(item => {
            const text = this.getSearchableText(item);
            const words = text.toLowerCase().split(/\s+/);
            
            words.forEach(word => {
                if (word.length > 2) { // Only index words longer than 2 characters
                    if (!index[word]) {
                        index[word] = [];
                    }
                    index[word].push(item.id);
                }
            });
        });
        
        return index;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }

    loadSearchHistory() {
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
            this.searchHistory = JSON.parse(saved);
        }
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    loadSavedSearches() {
        const saved = localStorage.getItem('savedSearches');
        if (saved) {
            this.savedSearches = JSON.parse(saved);
        }
    }

    saveSavedSearches() {
        localStorage.setItem('savedSearches', JSON.stringify(this.savedSearches));
    }

    showNotification(message, type = 'info') {
        if (window.adminDashboard && window.adminDashboard.showNotification) {
            window.adminDashboard.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `fixed top-20 right-4 bg-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
}

// Initialize advanced search system
window.advancedSearch = new AdvancedSearchSystem(); 