// Real-time Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.userPreferences = {};
        this.websocket = null;
        this.notificationSound = null;
        this.init();
    }

    init() {
        this.loadUserPreferences();
        this.loadNotifications();
        this.setupEventListeners();
        this.setupWebSocket();
        this.setupNotificationSound();
        this.startPeriodicChecks();
    }

    setupEventListeners() {
        // Notification bell click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-bell')) {
                this.toggleNotificationPanel();
            }
            if (e.target.classList.contains('mark-read-btn')) {
                const notificationId = e.target.dataset.notificationId;
                this.markAsRead(notificationId);
            }
            if (e.target.classList.contains('mark-all-read-btn')) {
                this.markAllAsRead();
            }
            if (e.target.classList.contains('notification-settings-btn')) {
                this.showNotificationSettings();
            }
        });

        // Handle notification clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-item')) {
                const notificationId = e.target.closest('.notification-item').dataset.notificationId;
                this.handleNotificationClick(notificationId);
            }
        });
    }

    setupWebSocket() {
        // Simulate WebSocket connection for real-time notifications
        // In a real implementation, this would connect to your backend
        this.websocket = {
            send: (data) => {
                console.log('WebSocket message sent:', data);
            },
            onmessage: (event) => {
                // Simulate incoming notifications
                this.simulateIncomingNotification();
            }
        };

        // Simulate periodic notifications
        setInterval(() => {
            this.simulateIncomingNotification();
        }, 30000); // Every 30 seconds
    }

    simulateIncomingNotification() {
        const notificationTypes = [
            'new_content',
            'quiz_reminder',
            'achievement',
            'system_update',
            'study_reminder'
        ];

        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const notification = this.createNotification(randomType);
        
        if (this.shouldShowNotification(notification)) {
            this.addNotification(notification);
        }
    }

    createNotification(type) {
        const notifications = {
            new_content: {
                title: 'New Content Available',
                message: 'New chapter has been added to Mathematics',
                type: 'info',
                icon: 'fas fa-book',
                action: 'view_content',
                priority: 'normal'
            },
            quiz_reminder: {
                title: 'Daily Quiz Reminder',
                message: 'Complete today\'s quiz to earn XP points',
                type: 'reminder',
                icon: 'fas fa-question-circle',
                action: 'take_quiz',
                priority: 'high'
            },
            achievement: {
                title: 'Achievement Unlocked!',
                message: 'You\'ve completed 10 quizzes in a row!',
                type: 'success',
                icon: 'fas fa-trophy',
                action: 'view_achievement',
                priority: 'normal'
            },
            system_update: {
                title: 'System Update',
                message: 'New features have been added to the platform',
                type: 'info',
                icon: 'fas fa-cog',
                action: 'view_update',
                priority: 'low'
            },
            study_reminder: {
                title: 'Study Reminder',
                message: 'Time for your scheduled study session',
                type: 'reminder',
                icon: 'fas fa-clock',
                action: 'start_study',
                priority: 'high'
            }
        };

        return {
            id: Date.now() + Math.random(),
            ...notifications[type],
            timestamp: new Date().toISOString(),
            read: false,
            delivered: false
        };
    }

    setupNotificationSound() {
        // Create audio element for notification sounds
        this.notificationSound = new Audio();
        this.notificationSound.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        this.notificationSound.volume = 0.3;
    }

    startPeriodicChecks() {
        // Check for new notifications every 10 seconds
        setInterval(() => {
            this.checkForNewNotifications();
        }, 10000);

        // Check for scheduled notifications every minute
        setInterval(() => {
            this.checkScheduledNotifications();
        }, 60000);
    }

    checkForNewNotifications() {
        // In a real implementation, this would check the server for new notifications
        // For now, we'll simulate this with random notifications
        if (Math.random() < 0.1) { // 10% chance every 10 seconds
            this.simulateIncomingNotification();
        }
    }

    checkScheduledNotifications() {
        const now = new Date();
        const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
        
        const dueNotifications = scheduledNotifications.filter(notification => {
            const scheduledTime = new Date(notification.scheduledTime);
            return scheduledTime <= now && !notification.delivered;
        });

        dueNotifications.forEach(notification => {
            this.addNotification(notification);
            notification.delivered = true;
        });

        // Update scheduled notifications
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationBadge();
        
        if (this.shouldShowPopup(notification)) {
            this.showPopupNotification(notification);
        }
        
        if (this.shouldPlaySound(notification)) {
            this.playNotificationSound();
        }
        
        this.updateNotificationPanel();
    }

    shouldShowNotification(notification) {
        const preferences = this.userPreferences[notification.type] || {};
        return preferences.enabled !== false;
    }

    shouldShowPopup(notification) {
        const preferences = this.userPreferences[notification.type] || {};
        return preferences.popup !== false && notification.priority !== 'low';
    }

    shouldPlaySound(notification) {
        const preferences = this.userPreferences[notification.type] || {};
        return preferences.sound !== false;
    }

    showPopupNotification(notification) {
        const popup = document.createElement('div');
        popup.className = `fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50 transform transition-all duration-300 translate-x-full`;
        popup.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <i class="${notification.icon} text-lg ${this.getNotificationColor(notification.type)}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${notification.title}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${notification.message}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">${this.formatTimestamp(notification.timestamp)}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(popup);

        // Animate in
        setTimeout(() => {
            popup.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            popup.classList.add('translate-x-full');
            setTimeout(() => popup.remove(), 300);
        }, 5000);
    }

    playNotificationSound() {
        if (this.notificationSound) {
            this.notificationSound.play().catch(e => console.log('Could not play notification sound:', e));
        }
    }

    toggleNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.toggle('hidden');
            this.updateNotificationPanel();
        }
    }

    updateNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        if (!panel) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;
        const recentNotifications = this.notifications.slice(0, 10);

        panel.innerHTML = `
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Notifications</h3>
                    <div class="flex space-x-2">
                        <button class="mark-all-read-btn text-sm text-primary-500 hover:text-primary-600">
                            Mark all read
                        </button>
                        <button class="notification-settings-btn text-sm text-gray-500 hover:text-gray-600">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}
                </div>
            </div>
            
            <div class="max-h-96 overflow-y-auto">
                ${recentNotifications.length > 0 ? recentNotifications.map(notification => `
                    <div class="notification-item p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}" 
                         data-notification-id="${notification.id}">
                        <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0">
                                <i class="${notification.icon} text-lg ${this.getNotificationColor(notification.type)}"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">${notification.title}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${notification.message}</p>
                                <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">${this.formatTimestamp(notification.timestamp)}</p>
                            </div>
                            ${!notification.read ? `
                                <button class="mark-read-btn text-xs text-primary-500 hover:text-primary-600" data-notification-id="${notification.id}">
                                    Mark read
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('') : `
                    <div class="p-8 text-center text-gray-500 dark:text-gray-400">
                        <i class="fas fa-bell-slash text-3xl mb-2"></i>
                        <p>No notifications yet</p>
                    </div>
                `}
            </div>
            
            ${recentNotifications.length > 0 ? `
                <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onclick="window.notificationSystem.showAllNotifications()" class="w-full text-sm text-primary-500 hover:text-primary-600">
                        View all notifications
                    </button>
                </div>
            ` : ''}
        `;
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id == notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
            this.updateNotificationPanel();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateNotificationBadge();
        this.updateNotificationPanel();
    }

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id == notificationId);
        if (!notification) return;

        // Mark as read
        this.markAsRead(notificationId);

        // Handle different action types
        switch (notification.action) {
            case 'view_content':
                this.navigateToContent();
                break;
            case 'take_quiz':
                this.navigateToQuiz();
                break;
            case 'view_achievement':
                this.showAchievement();
                break;
            case 'view_update':
                this.showSystemUpdate();
                break;
            case 'start_study':
                this.startStudySession();
                break;
        }
    }

    navigateToContent() {
        // Navigate to content page
        if (window.app && window.app.showSection) {
            window.app.showSection('subjects');
        }
    }

    navigateToQuiz() {
        // Navigate to quiz page
        if (window.app && window.app.showSection) {
            window.app.showSection('quiz');
        }
    }

    showAchievement() {
        const modalContent = `
            <div class="p-6 text-center">
                <i class="fas fa-trophy text-6xl text-yellow-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Achievement Unlocked!</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">You've completed 10 quizzes in a row!</p>
                <button onclick="window.app.closeModal()" class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                    Awesome!
                </button>
            </div>
        `;
        window.app.showModal(modalContent);
    }

    showSystemUpdate() {
        const modalContent = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">System Update</h3>
                <div class="space-y-4">
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">New Features</h4>
                        <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Enhanced quiz system with adaptive learning</li>
                            <li>• AI-powered study recommendations</li>
                            <li>• Improved dark mode experience</li>
                            <li>• Better mobile responsiveness</li>
                        </ul>
                    </div>
                    <button onclick="window.app.closeModal()" class="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">
                        Got it!
                    </button>
                </div>
            </div>
        `;
        window.app.showModal(modalContent);
    }

    startStudySession() {
        // Start a study session
        if (window.app && window.app.showSection) {
            window.app.showSection('study');
        }
    }

    showNotificationSettings() {
        const modalContent = `
            <div class="p-6 max-w-md">
                <h3 class="text-xl font-bold mb-4">Notification Settings</h3>
                <div class="space-y-4">
                    ${Object.entries(this.getNotificationTypes()).map(([type, config]) => `
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center space-x-2">
                                    <i class="${config.icon} ${this.getNotificationColor(type)}"></i>
                                    <span class="font-medium">${config.label}</span>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" 
                                           ${this.userPreferences[type]?.enabled !== false ? 'checked' : ''}
                                           onchange="window.notificationSystem.updatePreference('${type}', 'enabled', this.checked)">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${config.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        window.app.showModal(modalContent);
    }

    getNotificationTypes() {
        return {
            new_content: {
                label: 'New Content',
                description: 'Get notified when new chapters or subjects are added',
                icon: 'fas fa-book'
            },
            quiz_reminder: {
                label: 'Quiz Reminders',
                description: 'Daily reminders to complete quizzes',
                icon: 'fas fa-question-circle'
            },
            achievement: {
                label: 'Achievements',
                description: 'Celebrate your learning milestones',
                icon: 'fas fa-trophy'
            },
            system_update: {
                label: 'System Updates',
                description: 'Important platform updates and announcements',
                icon: 'fas fa-cog'
            },
            study_reminder: {
                label: 'Study Reminders',
                description: 'Scheduled study session reminders',
                icon: 'fas fa-clock'
            }
        };
    }

    updatePreference(type, setting, value) {
        if (!this.userPreferences[type]) {
            this.userPreferences[type] = {};
        }
        this.userPreferences[type][setting] = value;
        this.saveUserPreferences();
    }

    getNotificationColor(type) {
        const colors = {
            success: 'text-green-500',
            error: 'text-red-500',
            warning: 'text-yellow-500',
            info: 'text-blue-500',
            reminder: 'text-purple-500'
        };
        return colors[type] || 'text-gray-500';
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

    showAllNotifications() {
        const modalContent = `
            <div class="p-6 max-w-2xl">
                <h3 class="text-xl font-bold mb-4">All Notifications</h3>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${this.notifications.map(notification => `
                        <div class="notification-item p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}" 
                             data-notification-id="${notification.id}">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0">
                                    <i class="${notification.icon} text-lg ${this.getNotificationColor(notification.type)}"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${notification.title}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${notification.message}</p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">${this.formatTimestamp(notification.timestamp)}</p>
                                </div>
                                ${!notification.read ? `
                                    <button class="mark-read-btn text-xs text-primary-500 hover:text-primary-600" data-notification-id="${notification.id}">
                                        Mark read
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        window.app.showModal(modalContent);
    }

    scheduleNotification(notification, scheduledTime) {
        const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
        scheduledNotifications.push({
            ...notification,
            scheduledTime: scheduledTime.toISOString(),
            delivered: false
        });
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('notificationPreferences');
        if (saved) {
            this.userPreferences = JSON.parse(saved);
        }
    }

    saveUserPreferences() {
        localStorage.setItem('notificationPreferences', JSON.stringify(this.userPreferences));
    }

    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
        }
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }
}

// Initialize notification system
window.notificationSystem = new NotificationSystem(); 