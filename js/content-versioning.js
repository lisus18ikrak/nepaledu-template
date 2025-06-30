// Content Versioning System
class ContentVersioningSystem {
    constructor() {
        this.versionHistory = {};
        this.maxVersions = 50; // Keep last 50 versions per item
        this.init();
    }

    init() {
        this.loadVersionHistory();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('version-history-btn')) {
                const itemId = e.target.dataset.itemId;
                const itemType = e.target.dataset.itemType;
                this.showVersionHistory(itemType, itemId);
            }
            if (e.target.classList.contains('revert-version-btn')) {
                const versionId = e.target.dataset.versionId;
                const itemType = e.target.dataset.itemType;
                this.revertToVersion(itemType, versionId);
            }
            if (e.target.classList.contains('compare-versions-btn')) {
                const version1 = e.target.dataset.version1;
                const version2 = e.target.dataset.version2;
                const itemType = e.target.dataset.itemType;
                this.compareVersions(itemType, version1, version2);
            }
        });
    }

    loadVersionHistory() {
        const saved = localStorage.getItem('contentVersionHistory');
        if (saved) {
            this.versionHistory = JSON.parse(saved);
        }
    }

    saveVersionHistory() {
        localStorage.setItem('contentVersionHistory', JSON.stringify(this.versionHistory));
    }

    createVersion(itemType, itemId, itemData, action = 'updated', userId = 'system') {
        if (!this.versionHistory[itemType]) {
            this.versionHistory[itemType] = {};
        }
        
        if (!this.versionHistory[itemType][itemId]) {
            this.versionHistory[itemType][itemId] = [];
        }

        const version = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            action: action,
            userId: userId,
            data: JSON.parse(JSON.stringify(itemData)), // Deep copy
            changes: this.detectChanges(itemType, itemId, itemData),
            versionNumber: this.versionHistory[itemType][itemId].length + 1
        };

        this.versionHistory[itemType][itemId].push(version);

        // Keep only the last maxVersions
        if (this.versionHistory[itemType][itemId].length > this.maxVersions) {
            this.versionHistory[itemType][itemId] = this.versionHistory[itemType][itemId].slice(-this.maxVersions);
        }

        this.saveVersionHistory();
        return version;
    }

    detectChanges(itemType, itemId, newData) {
        const previousVersion = this.getPreviousVersion(itemType, itemId);
        if (!previousVersion) {
            return { type: 'created', fields: Object.keys(newData) };
        }

        const changes = {
            type: 'updated',
            fields: [],
            details: {}
        };

        const oldData = previousVersion.data;
        
        for (const key in newData) {
            if (oldData[key] !== newData[key]) {
                changes.fields.push(key);
                changes.details[key] = {
                    old: oldData[key],
                    new: newData[key]
                };
            }
        }

        return changes;
    }

    getPreviousVersion(itemType, itemId) {
        if (!this.versionHistory[itemType] || !this.versionHistory[itemType][itemId]) {
            return null;
        }
        
        const versions = this.versionHistory[itemType][itemId];
        return versions.length > 0 ? versions[versions.length - 1] : null;
    }

    getVersion(itemType, itemId, versionId) {
        if (!this.versionHistory[itemType] || !this.versionHistory[itemType][itemId]) {
            return null;
        }
        
        return this.versionHistory[itemType][itemId].find(v => v.id == versionId);
    }

    showVersionHistory(itemType, itemId) {
        const versions = this.versionHistory[itemType]?.[itemId] || [];
        
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Version History</h3>
                    <div class="flex space-x-2">
                        <button class="text-primary-500 hover:text-primary-600 text-sm">
                            <i class="fas fa-download mr-1"></i>Export
                        </button>
                        <button onclick="window.app.closeModal()" class="text-gray-500 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <div class="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span class="font-medium">Total Versions:</span>
                            <span class="ml-2">${versions.length}</span>
                        </div>
                        <div>
                            <span class="font-medium">Last Modified:</span>
                            <span class="ml-2">${versions.length > 0 ? new Date(versions[versions.length - 1].timestamp).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div>
                            <span class="font-medium">Created:</span>
                            <span class="ml-2">${versions.length > 0 ? new Date(versions[0].timestamp).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 max-h-96 overflow-y-auto">
                    ${versions.map((version, index) => `
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        ${version.versionNumber}
                                    </div>
                                    <div>
                                        <div class="font-semibold">${this.getActionLabel(version.action)}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">
                                            ${new Date(version.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    ${index > 0 ? `
                                        <button class="compare-versions-btn text-blue-500 hover:text-blue-700 text-sm" 
                                                data-item-type="${itemType}" 
                                                data-version1="${version.id}" 
                                                data-version2="${versions[index - 1].id}">
                                            <i class="fas fa-exchange-alt mr-1"></i>Compare
                                        </button>
                                    ` : ''}
                                    <button class="revert-version-btn text-green-500 hover:text-green-700 text-sm" 
                                            data-item-type="${itemType}" 
                                            data-version-id="${version.id}">
                                        <i class="fas fa-undo mr-1"></i>Revert
                                    </button>
                                </div>
                            </div>
                            
                            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                By: ${version.userId}
                            </div>
                            
                            ${version.changes ? this.renderChanges(version.changes) : ''}
                            
                            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button onclick="window.contentVersioning.showVersionDetails('${itemType}', '${itemId}', '${version.id}')" 
                                        class="text-primary-500 hover:text-primary-600 text-sm">
                                    <i class="fas fa-eye mr-1"></i>View Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    renderChanges(changes) {
        if (changes.type === 'created') {
            return `
                <div class="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div class="text-green-800 dark:text-green-200 text-sm">
                        <i class="fas fa-plus mr-1"></i>Created with fields: ${changes.fields.join(', ')}
                    </div>
                </div>
            `;
        }

        if (changes.type === 'updated' && changes.fields.length > 0) {
            return `
                <div class="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div class="text-blue-800 dark:text-blue-200 text-sm mb-2">
                        <i class="fas fa-edit mr-1"></i>Updated fields: ${changes.fields.join(', ')}
                    </div>
                    <div class="space-y-1">
                        ${changes.fields.map(field => `
                            <div class="text-xs">
                                <span class="font-medium">${field}:</span>
                                <span class="line-through text-red-600">${changes.details[field].old || 'empty'}</span>
                                <span class="mx-1">→</span>
                                <span class="text-green-600">${changes.details[field].new || 'empty'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return '';
    }

    getActionLabel(action) {
        const labels = {
            'created': 'Created',
            'updated': 'Updated',
            'deleted': 'Deleted',
            'restored': 'Restored'
        };
        return labels[action] || action;
    }

    showVersionDetails(itemType, itemId, versionId) {
        const version = this.getVersion(itemType, itemId, versionId);
        if (!version) return;

        const modalContent = `
            <div class="p-6 max-w-2xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold">Version Details</h3>
                    <button onclick="window.app.closeModal()" class="text-gray-500 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="font-medium">Version:</span>
                            <span class="ml-2">${version.versionNumber}</span>
                        </div>
                        <div>
                            <span class="font-medium">Action:</span>
                            <span class="ml-2">${this.getActionLabel(version.action)}</span>
                        </div>
                        <div>
                            <span class="font-medium">User:</span>
                            <span class="ml-2">${version.userId}</span>
                        </div>
                        <div>
                            <span class="font-medium">Date:</span>
                            <span class="ml-2">${new Date(version.timestamp).toLocaleString()}</span>
                        </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 class="font-semibold mb-3">Data Snapshot</h4>
                        <pre class="text-xs overflow-x-auto">${JSON.stringify(version.data, null, 2)}</pre>
                    </div>

                    ${version.changes ? `
                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 class="font-semibold mb-3">Changes Made</h4>
                            ${this.renderChanges(version.changes)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    async revertToVersion(itemType, versionId) {
        if (!confirm('Are you sure you want to revert to this version? This action cannot be undone.')) {
            return;
        }

        try {
            // Find the version
            let targetVersion = null;
            let targetItemId = null;

            for (const itemId in this.versionHistory[itemType]) {
                const version = this.versionHistory[itemType][itemId].find(v => v.id == versionId);
                if (version) {
                    targetVersion = version;
                    targetItemId = itemId;
                    break;
                }
            }

            if (!targetVersion) {
                throw new Error('Version not found');
            }

            // Update the current data
            const currentData = JSON.parse(localStorage.getItem(`${itemType}s`) || '[]');
            const itemIndex = currentData.findIndex(item => item.id == targetItemId);
            
            if (itemIndex !== -1) {
                currentData[itemIndex] = {
                    ...targetVersion.data,
                    id: targetItemId,
                    updatedAt: new Date().toISOString(),
                    updatedBy: 'version-revert'
                };
                
                localStorage.setItem(`${itemType}s`, JSON.stringify(currentData));
                
                // Create a new version entry for the revert
                this.createVersion(itemType, targetItemId, currentData[itemIndex], 'restored', 'system');
                
                this.showNotification('Successfully reverted to version ' + targetVersion.versionNumber, 'success');
                
                // Refresh the current view
                if (window.adminDashboard) {
                    window.adminDashboard.loadSectionData(window.adminDashboard.getCurrentSection());
                }
            }
        } catch (error) {
            this.showNotification('Failed to revert version: ' + error.message, 'error');
        }
    }

    compareVersions(itemType, version1Id, version2Id) {
        let version1 = null;
        let version2 = null;
        let itemId = null;

        // Find both versions
        for (const id in this.versionHistory[itemType]) {
            const v1 = this.versionHistory[itemType][id].find(v => v.id == version1Id);
            const v2 = this.versionHistory[itemType][id].find(v => v.id == version2Id);
            if (v1 && v2) {
                version1 = v1;
                version2 = v2;
                itemId = id;
                break;
            }
        }

        if (!version1 || !version2) {
            this.showNotification('One or both versions not found', 'error');
            return;
        }

        const differences = this.findDifferences(version1.data, version2.data);
        
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold">Version Comparison</h3>
                    <button onclick="window.app.closeModal()" class="text-gray-500 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <h4 class="font-semibold text-blue-800 dark:text-blue-200">Version ${version1.versionNumber}</h4>
                        <div class="text-sm text-blue-600 dark:text-blue-300">
                            ${new Date(version1.timestamp).toLocaleString()}
                        </div>
                    </div>
                    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <h4 class="font-semibold text-green-800 dark:text-green-200">Version ${version2.versionNumber}</h4>
                        <div class="text-sm text-green-600 dark:text-green-300">
                            ${new Date(version2.timestamp).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 class="font-semibold mb-3">Differences</h4>
                    ${differences.length > 0 ? `
                        <div class="space-y-2">
                            ${differences.map(diff => `
                                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    <div class="font-medium text-sm mb-1">${diff.field}</div>
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div class="bg-red-100 dark:bg-red-900/20 p-2 rounded">
                                            <span class="text-red-800 dark:text-red-200">${diff.old || 'empty'}</span>
                                        </div>
                                        <div class="bg-green-100 dark:bg-green-900/20 p-2 rounded">
                                            <span class="text-green-800 dark:text-green-200">${diff.new || 'empty'}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                            No differences found between these versions
                        </div>
                    `}
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
    }

    findDifferences(obj1, obj2) {
        const differences = [];
        const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

        for (const key of allKeys) {
            if (obj1[key] !== obj2[key]) {
                differences.push({
                    field: key,
                    old: obj1[key],
                    new: obj2[key]
                });
            }
        }

        return differences;
    }

    getVersionStats(itemType) {
        const stats = {
            totalItems: 0,
            totalVersions: 0,
            averageVersionsPerItem: 0,
            mostActiveItem: null,
            recentActivity: []
        };

        if (this.versionHistory[itemType]) {
            for (const itemId in this.versionHistory[itemType]) {
                const versions = this.versionHistory[itemType][itemId];
                stats.totalItems++;
                stats.totalVersions += versions.length;

                if (!stats.mostActiveItem || versions.length > stats.mostActiveItem.versions) {
                    stats.mostActiveItem = { itemId, versions: versions.length };
                }

                // Add recent activity
                const latestVersion = versions[versions.length - 1];
                if (latestVersion) {
                    stats.recentActivity.push({
                        itemId,
                        action: latestVersion.action,
                        timestamp: latestVersion.timestamp,
                        userId: latestVersion.userId
                    });
                }
            }

            stats.averageVersionsPerItem = stats.totalItems > 0 ? (stats.totalVersions / stats.totalItems).toFixed(1) : 0;
            stats.recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            stats.recentActivity = stats.recentActivity.slice(0, 10); // Top 10 recent activities
        }

        return stats;
    }

    showNotification(message, type = 'info') {
        if (window.adminDashboard && window.adminDashboard.showNotification) {
            window.adminDashboard.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `fixed top-20 right-4 bg-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
}

// Initialize content versioning system
window.contentVersioning = new ContentVersioningSystem(); 