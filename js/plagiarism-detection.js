// Plagiarism Detection System
class PlagiarismDetection {
    constructor() {
        this.plagiarismData = {};
        this.init();
    }

    init() {
        this.loadPlagiarismData();
        this.setupEventListeners();
    }

    loadPlagiarismData() {
        const saved = localStorage.getItem('plagiarismDetectionData');
        if (saved) {
            this.plagiarismData = JSON.parse(saved);
        } else {
            this.plagiarismData = {
                scannedDocuments: [],
                knownSources: [],
                metrics: {
                    totalScanned: 0,
                    averageSimilarity: 0,
                    plagiarismDetected: 0
                },
                settings: {
                    similarityThreshold: 0.7,
                    minTextLength: 50
                }
            };
            this.savePlagiarismData();
        }
    }

    savePlagiarismData() {
        localStorage.setItem('plagiarismDetectionData', JSON.stringify(this.plagiarismData));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'plagiarismBtn') {
                this.showPlagiarismDashboard();
            }
            if (e.target.id === 'scanDocumentBtn') {
                this.showDocumentScanForm();
            }
        });
    }

    async scanDocument(text, documentName, author) {
        const scanResult = await this.performScan(text);
        
        const scanRecord = {
            id: Date.now(),
            documentName: documentName,
            author: author,
            textLength: text.length,
            scanResult: scanResult,
            timestamp: Date.now(),
            status: scanResult.similarity > this.plagiarismData.settings.similarityThreshold ? 'plagiarism_detected' : 'clean'
        };

        this.plagiarismData.scannedDocuments.push(scanRecord);
        this.updateMetrics();
        this.savePlagiarismData();

        return scanRecord;
    }

    async performScan(text) {
        // Simulate scanning process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const similarities = [];
        const matches = [];

        // Check against known sources
        this.plagiarismData.knownSources.forEach(source => {
            const similarity = this.calculateSimilarity(text, source.content);
            if (similarity > 0.3) {
                similarities.push(similarity);
                matches.push({
                    source: source.title,
                    author: source.author,
                    similarity: similarity
                });
            }
        });

        const overallSimilarity = similarities.length > 0 ? 
            similarities.reduce((a, b) => a + b, 0) / similarities.length : 0;

        return {
            similarity: overallSimilarity,
            matches: matches,
            recommendations: this.generateRecommendations(overallSimilarity, matches)
        };
    }

    calculateSimilarity(text1, text2) {
        const words1 = text1.toLowerCase().split(/\s+/);
        const words2 = text2.toLowerCase().split(/\s+/);
        
        const commonWords = words1.filter(word => words2.includes(word));
        const totalWords = new Set([...words1, ...words2]);
        
        return commonWords.length / totalWords.size;
    }

    generateRecommendations(similarity, matches) {
        const recommendations = [];

        if (similarity > 0.8) {
            recommendations.push('High similarity detected. Consider rewriting significant portions.');
        } else if (similarity > 0.6) {
            recommendations.push('Moderate similarity found. Review and paraphrase matched sections.');
        } else if (similarity > 0.3) {
            recommendations.push('Low similarity detected. Add proper citations where needed.');
        } else {
            recommendations.push('Document appears original. Continue with current approach.');
        }

        if (matches.length > 0) {
            recommendations.push(`Found ${matches.length} potential matches. Review each one.`);
        }

        return recommendations;
    }

    updateMetrics() {
        const documents = this.plagiarismData.scannedDocuments;
        this.plagiarismData.metrics.totalScanned = documents.length;
        
        if (documents.length > 0) {
            const similarities = documents.map(d => d.scanResult.similarity);
            this.plagiarismData.metrics.averageSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
            
            const plagiarismCount = documents.filter(d => d.status === 'plagiarism_detected').length;
            this.plagiarismData.metrics.plagiarismDetected = plagiarismCount;
        }
    }

    showPlagiarismDashboard() {
        const recentScans = this.plagiarismData.scannedDocuments
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);

        const modalContent = `
            <div class="p-6 max-w-6xl">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Plagiarism Detection</h3>
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-red-500">${this.plagiarismData.metrics.plagiarismDetected}</div>
                            <div class="text-xs text-gray-500">Plagiarism Cases</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-500">${this.plagiarismData.metrics.totalScanned}</div>
                            <div class="text-xs text-gray-500">Documents Scanned</div>
                        </div>
                    </div>
                </div>

                <!-- Scan Controls -->
                <div class="mb-6 p-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="text-lg font-semibold mb-2">Academic Integrity Scanner</h4>
                            <p class="text-sm opacity-90">Check documents for plagiarism and ensure academic integrity</p>
                        </div>
                        <div class="flex space-x-3">
                            <button id="scanDocumentBtn" class="bg-white hover:bg-gray-100 text-red-600 px-4 py-2 rounded-lg flex items-center space-x-2">
                                <i class="fas fa-search"></i>
                                <span>Scan Document</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Plagiarism Overview -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.plagiarismData.metrics.plagiarismDetected}</div>
                                <div class="text-sm opacity-90">Plagiarism Cases</div>
                            </div>
                            <i class="fas fa-exclamation-triangle text-3xl opacity-80"></i>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${this.plagiarismData.metrics.totalScanned}</div>
                                <div class="text-sm opacity-90">Documents Scanned</div>
                            </div>
                            <i class="fas fa-file-alt text-3xl opacity-80"></i>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold">${(this.plagiarismData.metrics.averageSimilarity * 100).toFixed(1)}%</div>
                                <div class="text-sm opacity-90">Avg Similarity</div>
                            </div>
                            <i class="fas fa-percentage text-3xl opacity-80"></i>
                        </div>
                    </div>
                </div>

                <!-- Recent Scans -->
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recent Document Scans</h4>
                    <div class="space-y-3">
                        ${recentScans.map(scan => `
                            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-${scan.status === 'plagiarism_detected' ? 'exclamation-triangle text-red-500' : 'check-circle text-green-500'} text-xl"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white">${scan.documentName}</div>
                                        <div class="text-sm text-gray-600 dark:text-gray-400">
                                            ${scan.author} • ${scan.textLength} characters
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm font-semibold ${scan.scanResult.similarity > 0.7 ? 'text-red-500' : scan.scanResult.similarity > 0.3 ? 'text-yellow-500' : 'text-green-500'}">
                                        ${(scan.scanResult.similarity * 100).toFixed(1)}% similarity
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">
                                        ${new Date(scan.timestamp).toLocaleDateString()}
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

    showDocumentScanForm() {
        const modalContent = `
            <div class="p-6 max-w-2xl">
                <h3 class="text-xl font-bold mb-4">Scan Document for Plagiarism</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Name</label>
                        <input type="text" id="documentName" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="e.g., Essay on Climate Change">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
                        <input type="text" id="documentAuthor" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Student name">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Content</label>
                        <textarea id="documentContent" rows="10" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Paste your document content here..."></textarea>
                    </div>
                </div>

                <div class="flex space-x-3 mt-6">
                    <button id="scanDocumentSubmit" class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                        <i class="fas fa-search mr-2"></i>Scan for Plagiarism
                    </button>
                    <button onclick="this.closest('.modal').remove()" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Scan Document');
        this.setupScanFormHandlers();
    }

    setupScanFormHandlers() {
        setTimeout(() => {
            const scanSubmit = document.getElementById('scanDocumentSubmit');
            if (scanSubmit) {
                scanSubmit.addEventListener('click', async () => {
                    const documentName = document.getElementById('documentName').value;
                    const author = document.getElementById('documentAuthor').value;
                    const content = document.getElementById('documentContent').value;

                    if (!documentName || !author || !content) {
                        alert('Please fill in all fields');
                        return;
                    }

                    if (content.length < this.plagiarismData.settings.minTextLength) {
                        alert(`Content must be at least ${this.plagiarismData.settings.minTextLength} characters long`);
                        return;
                    }

                    try {
                        const result = await this.scanDocument(content, documentName, author);
                        this.showScanResult(result);
                    } catch (error) {
                        alert('Error scanning document: ' + error.message);
                    }
                });
            }
        }, 100);
    }

    showScanResult(scanResult) {
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">Scan Results</h3>
                    <div class="text-sm text-gray-500">
                        ${scanResult.status === 'plagiarism_detected' ? '⚠️ Plagiarism Detected' : '✅ Clean Document'}
                    </div>
                </div>

                <div class="mb-6 p-4 ${scanResult.status === 'plagiarism_detected' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'} rounded-lg">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-${scanResult.status === 'plagiarism_detected' ? 'exclamation-triangle text-red-500' : 'check-circle text-green-500'}"></i>
                        <span class="font-semibold ${scanResult.status === 'plagiarism_detected' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}">
                            ${scanResult.status === 'plagiarism_detected' ? 'Plagiarism Detected' : 'Document is Original'}
                        </span>
                    </div>
                    <div class="mt-2 text-sm ${scanResult.status === 'plagiarism_detected' ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}">
                        Similarity Score: ${(scanResult.scanResult.similarity * 100).toFixed(1)}%
                    </div>
                </div>

                ${scanResult.scanResult.matches.length > 0 ? `
                    <div class="mb-6">
                        <h4 class="text-lg font-semibold mb-4">Detected Matches</h4>
                        <div class="space-y-3">
                            ${scanResult.scanResult.matches.map(match => `
                                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="font-semibold text-gray-900 dark:text-white">${match.source}</div>
                                            <div class="text-sm text-gray-600 dark:text-gray-400">${match.author}</div>
                                        </div>
                                        <div class="text-sm text-red-500 font-semibold">${(match.similarity * 100).toFixed(1)}% match</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-4">Recommendations</h4>
                    <div class="space-y-2">
                        ${scanResult.scanResult.recommendations.map(rec => `
                            <div class="flex items-start space-x-2">
                                <i class="fas fa-lightbulb text-yellow-500 mt-1"></i>
                                <span class="text-sm text-gray-700 dark:text-gray-300">${rec}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button onclick="this.closest('.modal').remove()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                        Close
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalContent, 'Scan Results');
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

    getPlagiarismStats() {
        return {
            totalScanned: this.plagiarismData.metrics.totalScanned,
            plagiarismDetected: this.plagiarismData.metrics.plagiarismDetected,
            averageSimilarity: this.plagiarismData.metrics.averageSimilarity
        };
    }
}

// Initialize the Plagiarism Detection system
window.plagiarismDetection = new PlagiarismDetection(); 