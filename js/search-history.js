// Search History and Suggestions System
class SearchHistory {
    constructor() {
        this.searchData = {};
        this.init();
    }

    init() {
        this.loadSearchData();
        this.setupEventListeners();
    }

    loadSearchData() {
        const saved = localStorage.getItem('searchHistoryData');
        if (saved) {
            this.searchData = JSON.parse(saved);
        } else {
            this.searchData = {
                searchHistory: [],
                popularSearches: [],
                settings: {
                    maxHistoryItems: 50,
                    maxSuggestions: 8,
                    enableAutoComplete: true
                }
            };
            this.saveSearchData();
        }
    }

    saveSearchData() {
        localStorage.setItem('searchHistoryData', JSON.stringify(this.searchData));
    }

    setupEventListeners() {
        // Listen for search input changes
        document.addEventListener('input', (e) => {
            if (e.target.id === 'searchInput') {
                this.handleSearchInput(e.target.value);
            }
        });

        // Listen for search button clicks
        document.addEventListener('click', (e) => {
            if (e.target.id === 'searchBtn') {
                const searchInput = document.getElementById('searchInput');
                if (searchInput && searchInput.value.trim()) {
                    this.performSearch(searchInput.value.trim());
                }
            }
            if (e.target.id === 'searchHistoryBtn') {
                this.showSearchHistory();
            }
            if (e.target.classList.contains('suggestion-item')) {
                const query = e.target.dataset.query;
                this.performSearch(query);
            }
            if (e.target.classList.contains('history-item')) {
                const query = e.target.dataset.query;
                this.performSearch(query);
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.id === 'searchInput') {
                this.handleKeyboardNavigation(e);
            }
        });
    }

    handleSearchInput(query) {
        if (!this.searchData.settings.enableAutoComplete) return;

        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        const suggestions = this.generateSuggestions(query);
        this.showSuggestions(suggestions, query);
    }

    generateSuggestions(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();

        // Add recent searches that match
        this.searchData.searchHistory
            .filter(item => item.query.toLowerCase().includes(lowerQuery))
            .slice(0, 3)
            .forEach(item => {
                suggestions.push({
                    type: 'recent',
                    query: item.query,
                    icon: 'fas fa-history',
                    color: 'text-blue-500'
                });
            });

        // Add popular searches that match
        this.searchData.popularSearches
            .filter(item => item.query.toLowerCase().includes(lowerQuery))
            .slice(0, 3)
            .forEach(item => {
                suggestions.push({
                    type: 'popular',
                    query: item.query,
                    icon: 'fas fa-fire',
                    color: 'text-orange-500'
                });
            });

        // Add related searches
        const relatedSearches = this.getRelatedSearches(query);
        relatedSearches.slice(0, 2).forEach(item => {
            suggestions.push({
                type: 'related',
                query: item,
                icon: 'fas fa-lightbulb',
                color: 'text-green-500'
            });
        });

        return suggestions.slice(0, this.searchData.settings.maxSuggestions);
    }

    getRelatedSearches(query) {
        const relatedMap = {
            'math': ['algebra', 'geometry', 'calculus', 'trigonometry'],
            'science': ['physics', 'chemistry', 'biology', 'experiments'],
            'english': ['grammar', 'literature', 'vocabulary', 'writing'],
            'nepali': ['भाषा', 'साहित्य', 'व्याकरण', 'कविता'],
            'history': ['ancient', 'medieval', 'modern', 'nepal'],
            'algebra': ['equations', 'polynomials', 'functions', 'graphs'],
            'geometry': ['shapes', 'angles', 'area', 'perimeter'],
            'physics': ['motion', 'forces', 'energy', 'waves'],
            'chemistry': ['atoms', 'molecules', 'reactions', 'elements']
        };

        const lowerQuery = query.toLowerCase();
        for (const [key, related] of Object.entries(relatedMap)) {
            if (lowerQuery.includes(key)) {
                return related;
            }
        }

        return [];
    }

    showSuggestions(suggestions, query) {
        let suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.id = 'searchSuggestions';
            suggestionsContainer.className = 'absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto';
            
            const searchContainer = document.querySelector('.search-bar');
            if (searchContainer) {
                searchContainer.style.position = 'relative';
                searchContainer.appendChild(suggestionsContainer);
            }
        }

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestionsContainer.innerHTML = `
            <div class="p-2">
                ${suggestions.map(suggestion => `
                    <div class="suggestion-item flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer" data-query="${suggestion.query}">
                        <i class="${suggestion.icon} ${suggestion.color}"></i>
                        <span class="flex-1 text-gray-900 dark:text-white">${suggestion.query}</span>
                        <span class="text-xs text-gray-500 capitalize">${suggestion.type}</span>
                    </div>
                `).join('')}
            </div>
        `;

        suggestionsContainer.style.display = 'block';
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    handleKeyboardNavigation(e) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer || suggestionsContainer.style.display === 'none') return;

        const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
        const currentIndex = Array.from(suggestionItems).findIndex(item => item.classList.contains('bg-gray-100', 'dark:bg-gray-700'));

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < suggestionItems.length - 1 ? currentIndex + 1 : 0;
                this.highlightSuggestion(suggestionItems, nextIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : suggestionItems.length - 1;
                this.highlightSuggestion(suggestionItems, prevIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0) {
                    const selectedItem = suggestionItems[currentIndex];
                    const query = selectedItem.dataset.query;
                    this.performSearch(query);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }

    highlightSuggestion(items, index) {
        items.forEach((item, i) => {
            item.classList.remove('bg-gray-100', 'dark:bg-gray-700');
            if (i === index) {
                item.classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) return;

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }

        this.hideSuggestions();
        this.recordSearch(query);

        // Simulate search results
        const results = this.simulateSearchResults(query);
        this.displaySearchResults(query, results);
    }

    recordSearch(query) {
        const searchRecord = {
            id: Date.now(),
            query: query,
            timestamp: Date.now(),
            results: 0
        };

        // Remove duplicate recent searches
        this.searchData.searchHistory = this.searchData.searchHistory.filter(
            item => item.query.toLowerCase() !== query.toLowerCase()
        );

        // Add new search at the beginning
        this.searchData.searchHistory.unshift(searchRecord);

        // Limit history size
        if (this.searchData.searchHistory.length > this.searchData.settings.maxHistoryItems) {
            this.searchData.searchHistory = this.searchData.searchHistory.slice(0, this.searchData.settings.maxHistoryItems);
        }

        this.updatePopularSearches();
        this.saveSearchData();
    }

    updatePopularSearches() {
        const frequency = {};
        this.searchData.searchHistory.forEach(item => {
            frequency[item.query] = (frequency[item.query] || 0) + 1;
        });

        this.searchData.popularSearches = Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([query, count]) => ({ query, count }));
    }

    simulateSearchResults(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        const subjects = ['mathematics', 'science', 'english', 'nepali', 'social_studies'];
        const topics = ['algebra', 'geometry', 'physics', 'chemistry', 'grammar', 'literature'];

        subjects.forEach(subject => {
            if (lowerQuery.includes(subject) || subject.includes(lowerQuery)) {
                results.push({
                    type: 'subject',
                    title: `${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
                    description: `Explore ${subject} topics and lessons`,
                    url: `/subjects/${subject}`,
                    relevance: 0.9
                });
            }
        });

        topics.forEach(topic => {
            if (lowerQuery.includes(topic) || topic.includes(lowerQuery)) {
                results.push({
                    type: 'topic',
                    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
                    description: `Learn about ${topic} concepts and applications`,
                    url: `/topics/${topic}`,
                    relevance: 0.8
                });
            }
        });

        if (results.length === 0) {
            results.push({
                type: 'general',
                title: 'Search Results',
                description: `Showing results for "${query}"`,
                url: `/search?q=${encodeURIComponent(query)}`,
                relevance: 0.5
            });
        }

        return results;
    }

    displaySearchResults(query, results) {
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Search Results</h3>
                    <div class="text-sm text-gray-500">
                        ${results.length} results for "${query}"
                    </div>
                </div>

                <div class="space-y-4">
                    ${results.map((result, index) => `
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div class="flex items-start space-x-4">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                                        ${index + 1}
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                                        <a href="${result.url}" class="hover:text-blue-600 dark:hover:text-blue-400">
                                            ${result.title}
                                        </a>
                                    </h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        ${result.description}
                                    </p>
                                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                                        <span class="capitalize">${result.type}</span>
                                        <span>•</span>
                                        <span>Relevance: ${(result.relevance * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            Search completed in ${Math.random() * 1000 + 100}ms
                        </div>
                        <button onclick="this.closest('.modal').remove()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Search Results');
    }

    showSearchHistory() {
        const recentSearches = this.searchData.searchHistory.slice(0, 10);
        const popularSearches = this.searchData.popularSearches;

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Search History & Suggestions</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-500">${this.searchData.searchHistory.length}</div>
                            <div class="text-xs text-gray-500">Total Searches</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-500">${recentSearches.length}</div>
                            <div class="text-xs text-gray-500">Recent Searches</div>
                        </div>
                    </div>
                </div>

                <!-- Search Controls -->
                <div class="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-lg font-semibold mb-2">Smart Search</h4>
                            <p class="text-sm opacity-90">Enhanced search with history, suggestions, and trends</p>
                        </div>
                        <div class="flex space-x-3">
                            <button onclick="window.searchHistory.clearHistory()" class="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2">
                                <i class="fas fa-trash"></i>
                                <span>Clear History</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Search Overview -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.searchData.searchHistory.length}</div>
                                <div class="text-sm opacity-90">Total Searches</div>
                            </div>
                            <i class="fas fa-search text-3xl opacity-80"></i>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${recentSearches.length}</div>
                                <div class="text-sm opacity-90">Recent Searches</div>
                            </div>
                            <i class="fas fa-history text-3xl opacity-80"></i>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${popularSearches.length}</div>
                                <div class="text-sm opacity-90">Popular Searches</div>
                            </div>
                            <i class="fas fa-fire text-3xl opacity-80"></i>
                        </div>
                    </div>
                </div>

                <!-- Search Sections -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Recent Searches -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 class="font-semibold mb-4 flex items-center space-x-2">
                            <i class="fas fa-history text-blue-500"></i>
                            <span>Recent Searches</span>
                        </h4>
                        <div class="space-y-2">
                            ${recentSearches.map(search => `
                                <div class="history-item flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer" data-query="${search.query}">
                                    <div class="flex items-center space-x-3">
                                        <i class="fas fa-search text-gray-400"></i>
                                        <span class="text-gray-900 dark:text-white">${search.query}</span>
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        ${new Date(search.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Popular Searches -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 class="font-semibold mb-4 flex items-center space-x-2">
                            <i class="fas fa-fire text-orange-500"></i>
                            <span>Popular Searches</span>
                        </h4>
                        <div class="space-y-2">
                            ${popularSearches.map(search => `
                                <div class="suggestion-item flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer" data-query="${search.query}">
                                    <div class="flex items-center space-x-3">
                                        <i class="fas fa-fire text-orange-500"></i>
                                        <span class="text-gray-900 dark:text-white">${search.query}</span>
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        ${search.count} searches
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.showModal(modalContent);
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all search history? This action cannot be undone.')) {
            this.searchData.searchHistory = [];
            this.searchData.popularSearches = [];
            this.saveSearchData();
            
            // Refresh the modal
            this.showSearchHistory();
        }
    }

    showModal(content, title = 'Search History') {
        const modal = document.createElement('div');
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
    getSearchStats() {
        return {
            totalSearches: this.searchData.searchHistory.length,
            recentSearches: this.searchData.searchHistory.slice(0, 10).length,
            popularSearches: this.searchData.popularSearches.length
        };
    }

    getRecentSearches() {
        return this.searchData.searchHistory.slice(0, 10);
    }

    getPopularSearches() {
        return this.searchData.popularSearches;
    }
}

// Initialize the Search History system
window.searchHistory = new SearchHistory(); 