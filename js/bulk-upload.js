// Bulk Upload System for Educational Content
class BulkUploadSystem {
    constructor() {
        this.supportedFormats = ['csv', 'json', 'xlsx'];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createUploadInterface();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'bulkUploadBtn') {
                this.showBulkUploadModal();
            }
            if (e.target.id === 'downloadTemplateBtn') {
                this.downloadTemplate();
            }
            if (e.target.id === 'validateDataBtn') {
                this.validateUploadedData();
            }
        });
    }

    createUploadInterface() {
        // Add bulk upload button to admin dashboard if not exists
        const adminHeader = document.querySelector('.admin-header');
        if (adminHeader && !document.getElementById('bulkUploadBtn')) {
            const bulkUploadBtn = document.createElement('button');
            bulkUploadBtn.id = 'bulkUploadBtn';
            bulkUploadBtn.className = 'bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold';
            bulkUploadBtn.innerHTML = '<i class="fas fa-upload mr-2"></i>Bulk Upload';
            adminHeader.appendChild(bulkUploadBtn);
        }
    }

    showBulkUploadModal() {
        const modalContent = `
            <div class="p-6 max-w-4xl">
                <h3 class="text-xl font-bold mb-4">Bulk Content Upload</h3>
                
                <!-- Step Indicator -->
                <div class="flex items-center justify-center mb-6">
                    <div class="flex items-center">
                        <div class="step-indicator active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Select Type</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-indicator" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Upload File</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-indicator" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Validate</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-indicator" data-step="4">
                            <span class="step-number">4</span>
                            <span class="step-label">Import</span>
                        </div>
                    </div>
                </div>

                <!-- Step 1: Content Type Selection -->
                <div id="step1" class="step-content">
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="content-type-card" data-type="subjects">
                            <div class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <i class="fas fa-book text-3xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold">Subjects</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Upload multiple subjects at once</p>
                            </div>
                        </div>
                        <div class="content-type-card" data-type="chapters">
                            <div class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <i class="fas fa-list-ol text-3xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold">Chapters</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Upload chapters with subject mapping</p>
                            </div>
                        </div>
                        <div class="content-type-card" data-type="questions">
                            <div class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <i class="fas fa-question-circle text-3xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold">Questions</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Upload questions with answers</p>
                            </div>
                        </div>
                        <div class="content-type-card" data-type="videos">
                            <div class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <i class="fas fa-video text-3xl text-primary-500 mb-2"></i>
                                <h4 class="font-semibold">Videos</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Upload video metadata</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <button onclick="window.app.closeModal()" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">
                            Cancel
                        </button>
                        <button id="nextStep1" class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold" disabled>
                            Next <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>

                <!-- Step 2: File Upload -->
                <div id="step2" class="step-content hidden">
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold">Upload File</h4>
                            <button id="downloadTemplateBtn" class="text-primary-500 hover:text-primary-600 text-sm">
                                <i class="fas fa-download mr-1"></i>Download Template
                            </button>
                        </div>
                        
                        <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                            <p class="text-lg font-semibold mb-2">Drop your file here or click to browse</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Supported formats: CSV, JSON, XLSX (Max 10MB)
                            </p>
                            <input type="file" id="bulkUploadFile" accept=".csv,.json,.xlsx" class="hidden">
                            <button onclick="document.getElementById('bulkUploadFile').click()" class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded-lg font-semibold">
                                Choose File
                            </button>
                        </div>
                        
                        <div id="filePreview" class="mt-4 hidden">
                            <h5 class="font-semibold mb-2">File Preview:</h5>
                            <div id="previewContent" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto"></div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <button onclick="this.previousStep()" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">
                            <i class="fas fa-arrow-left mr-2"></i>Previous
                        </button>
                        <button id="nextStep2" class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold" disabled>
                            Next <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>

                <!-- Step 3: Validation -->
                <div id="step3" class="step-content hidden">
                    <div class="mb-6">
                        <h4 class="font-semibold mb-4">Data Validation</h4>
                        <div id="validationResults" class="space-y-4">
                            <!-- Validation results will be populated here -->
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <button onclick="this.previousStep()" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">
                            <i class="fas fa-arrow-left mr-2"></i>Previous
                        </button>
                        <button id="nextStep3" class="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold" disabled>
                            Next <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>

                <!-- Step 4: Import -->
                <div id="step4" class="step-content hidden">
                    <div class="mb-6">
                        <h4 class="font-semibold mb-4">Import Summary</h4>
                        <div id="importSummary" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <!-- Import summary will be populated here -->
                        </div>
                    </div>
                    
                    <div class="flex justify-between">
                        <button onclick="this.previousStep()" class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-semibold">
                            <i class="fas fa-arrow-left mr-2"></i>Previous
                        </button>
                        <button id="importBtn" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold">
                            <i class="fas fa-check mr-2"></i>Import Data
                        </button>
                    </div>
                </div>
            </div>
        `;

        window.app.showModal(modalContent);
        this.setupBulkUploadEventListeners();
    }

    setupBulkUploadEventListeners() {
        // Content type selection
        document.querySelectorAll('.content-type-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.content-type-card').forEach(c => 
                    c.querySelector('div').classList.remove('border-primary-500', 'bg-primary-50')
                );
                card.querySelector('div').classList.add('border-primary-500', 'bg-primary-50');
                document.getElementById('nextStep1').disabled = false;
                this.selectedContentType = card.dataset.type;
            });
        });

        // File upload
        const fileInput = document.getElementById('bulkUploadFile');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // Step navigation
        document.getElementById('nextStep1').addEventListener('click', () => this.nextStep(2));
        document.getElementById('nextStep2').addEventListener('click', () => this.nextStep(3));
        document.getElementById('nextStep3').addEventListener('click', () => this.nextStep(4));
        document.getElementById('importBtn').addEventListener('click', () => this.processImport());
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size
        if (file.size > this.maxFileSize) {
            this.showNotification('File size exceeds 10MB limit', 'error');
            return;
        }

        // Validate file type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!this.supportedFormats.includes(fileExtension)) {
            this.showNotification('Unsupported file format', 'error');
            return;
        }

        try {
            this.uploadedData = await this.parseFile(file);
            this.showFilePreview(this.uploadedData);
            document.getElementById('nextStep2').disabled = false;
        } catch (error) {
            this.showNotification('Error parsing file: ' + error.message, 'error');
        }
    }

    async parseFile(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        switch (fileExtension) {
            case 'csv':
                return await this.parseCSV(file);
            case 'json':
                return await this.parseJSON(file);
            case 'xlsx':
                return await this.parseExcel(file);
            default:
                throw new Error('Unsupported file format');
        }
    }

    async parseCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.trim());
                    const data = lines.slice(1).map(line => {
                        const values = line.split(',').map(v => v.trim());
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = values[index] || '';
                        });
                        return obj;
                    });
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    async parseJSON(file) {
        const text = await file.text();
        return JSON.parse(text);
    }

    async parseExcel(file) {
        // For Excel files, we'll use a simple CSV-like approach
        // In a real implementation, you'd use a library like SheetJS
        return await this.parseCSV(file);
    }

    showFilePreview(data) {
        const previewDiv = document.getElementById('filePreview');
        const contentDiv = document.getElementById('previewContent');
        
        if (data && data.length > 0) {
            const preview = data.slice(0, 5); // Show first 5 rows
            contentDiv.innerHTML = `
                <div class="text-sm">
                    <p class="mb-2"><strong>Total rows:</strong> ${data.length}</p>
                    <p class="mb-2"><strong>Columns:</strong> ${Object.keys(data[0]).join(', ')}</p>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-xs">
                            <thead>
                                <tr class="border-b">
                                    ${Object.keys(preview[0]).map(key => `<th class="text-left py-1">${key}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${preview.map(row => `
                                    <tr class="border-b">
                                        ${Object.values(row).map(value => `<td class="py-1">${value}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            previewDiv.classList.remove('hidden');
        }
    }

    nextStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.add('hidden');
        });

        // Show current step
        document.getElementById(`step${stepNumber}`).classList.remove('hidden');

        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            if (index + 1 <= stepNumber) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Handle step-specific actions
        if (stepNumber === 3) {
            this.validateUploadedData();
        } else if (stepNumber === 4) {
            this.showImportSummary();
        }
    }

    previousStep() {
        const currentStep = this.getCurrentStep();
        if (currentStep > 1) {
            this.nextStep(currentStep - 1);
        }
    }

    getCurrentStep() {
        for (let i = 1; i <= 4; i++) {
            if (!document.getElementById(`step${i}`).classList.contains('hidden')) {
                return i;
            }
        }
        return 1;
    }

    validateUploadedData() {
        if (!this.uploadedData || !this.selectedContentType) {
            this.showNotification('No data to validate', 'error');
            return;
        }

        const validationResults = this.performValidation(this.uploadedData, this.selectedContentType);
        this.displayValidationResults(validationResults);
        
        const hasErrors = validationResults.errors.length > 0;
        document.getElementById('nextStep3').disabled = hasErrors;
    }

    performValidation(data, contentType) {
        const results = {
            valid: [],
            errors: [],
            warnings: []
        };

        const validators = {
            subjects: this.validateSubjects,
            chapters: this.validateChapters,
            questions: this.validateQuestions,
            videos: this.validateVideos
        };

        const validator = validators[contentType];
        if (validator) {
            data.forEach((item, index) => {
                const validation = validator(item, index);
                if (validation.isValid) {
                    results.valid.push({ item, index });
                } else {
                    results.errors.push({ item, index, errors: validation.errors });
                }
            });
        }

        return results;
    }

    validateSubjects(item, index) {
        const errors = [];
        
        if (!item.name || item.name.trim() === '') {
            errors.push('Subject name is required');
        }
        
        if (item.name && item.name.length > 100) {
            errors.push('Subject name must be less than 100 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateChapters(item, index) {
        const errors = [];
        
        if (!item.name || item.name.trim() === '') {
            errors.push('Chapter name is required');
        }
        
        if (!item.subjectId && !item.subject) {
            errors.push('Subject is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateQuestions(item, index) {
        const errors = [];
        
        if (!item.question || item.question.trim() === '') {
            errors.push('Question text is required');
        }
        
        if (!item.type) {
            errors.push('Question type is required');
        }
        
        if (item.type === 'multiple_choice' && (!item.options || item.options.length < 2)) {
            errors.push('Multiple choice questions must have at least 2 options');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateVideos(item, index) {
        const errors = [];
        
        if (!item.title || item.title.trim() === '') {
            errors.push('Video title is required');
        }
        
        if (!item.url && !item.youtubeId) {
            errors.push('Video URL or YouTube ID is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    displayValidationResults(results) {
        const container = document.getElementById('validationResults');
        
        container.innerHTML = `
            <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">${results.valid.length}</div>
                    <div class="text-sm">Valid Items</div>
                </div>
                <div class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">${results.errors.length}</div>
                    <div class="text-sm">Errors</div>
                </div>
                <div class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">${results.warnings.length}</div>
                    <div class="text-sm">Warnings</div>
                </div>
            </div>
            
            ${results.errors.length > 0 ? `
                <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h5 class="font-semibold text-red-800 dark:text-red-200 mb-2">Validation Errors:</h5>
                    <div class="space-y-2 max-h-64 overflow-y-auto">
                        ${results.errors.map(error => `
                            <div class="text-sm">
                                <span class="font-medium">Row ${error.index + 1}:</span>
                                <ul class="ml-4 list-disc">
                                    ${error.errors.map(err => `<li>${err}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    showImportSummary() {
        const container = document.getElementById('importSummary');
        const validCount = this.uploadedData ? this.uploadedData.length : 0;
        
        container.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="font-medium">Content Type:</span>
                    <span class="capitalize">${this.selectedContentType}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-medium">Items to Import:</span>
                    <span>${validCount}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-medium">Estimated Time:</span>
                    <span>${Math.ceil(validCount / 10)} seconds</span>
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                        <i class="fas fa-info-circle mr-2"></i>
                        This will add new items to your existing content. Duplicate items will be skipped.
                    </p>
                </div>
            </div>
        `;
    }

    async processImport() {
        if (!this.uploadedData || !this.selectedContentType) {
            this.showNotification('No data to import', 'error');
            return;
        }

        try {
            const importBtn = document.getElementById('importBtn');
            importBtn.disabled = true;
            importBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Importing...';

            const results = await this.performImport(this.uploadedData, this.selectedContentType);
            
            this.showNotification(`Successfully imported ${results.success} items`, 'success');
            window.app.closeModal();
            
            // Refresh the current admin section
            if (window.adminDashboard) {
                window.adminDashboard.loadSectionData(window.adminDashboard.getCurrentSection());
            }
        } catch (error) {
            this.showNotification('Import failed: ' + error.message, 'error');
        } finally {
            const importBtn = document.getElementById('importBtn');
            importBtn.disabled = false;
            importBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Import Data';
        }
    }

    async performImport(data, contentType) {
        const results = { success: 0, skipped: 0, failed: 0 };
        
        for (const item of data) {
            try {
                const existing = JSON.parse(localStorage.getItem(`${contentType}s`) || '[]');
                
                // Check for duplicates
                const isDuplicate = existing.some(existingItem => 
                    existingItem.name === item.name || existingItem.id === item.id
                );
                
                if (isDuplicate) {
                    results.skipped++;
                    continue;
                }
                
                // Add new item
                const newItem = {
                    id: Date.now() + Math.random(),
                    ...item,
                    createdAt: new Date().toISOString(),
                    createdBy: 'bulk-upload'
                };
                
                existing.push(newItem);
                localStorage.setItem(`${contentType}s`, JSON.stringify(existing));
                results.success++;
                
                // Add delay to prevent UI freezing
                await new Promise(resolve => setTimeout(resolve, 10));
            } catch (error) {
                results.failed++;
            }
        }
        
        return results;
    }

    downloadTemplate() {
        const contentType = this.selectedContentType || 'subjects';
        const templates = {
            subjects: [
                { name: 'Subject Name', description: 'Subject Description', color: 'primary' },
                { name: 'Mathematics', description: 'Advanced mathematics for Class 9-10', color: 'blue' },
                { name: 'Science', description: 'Physics, Chemistry, and Biology', color: 'green' }
            ],
            chapters: [
                { name: 'Chapter Name', subjectId: 'Subject ID', description: 'Chapter Description' },
                { name: 'Algebra', subjectId: '1', description: 'Basic algebraic concepts' },
                { name: 'Geometry', subjectId: '1', description: 'Geometric shapes and theorems' }
            ],
            questions: [
                { question: 'Question Text', type: 'multiple_choice', options: '["A", "B", "C", "D"]', correctAnswer: 'A', explanation: 'Explanation' },
                { question: 'What is 2+2?', type: 'multiple_choice', options: '["3", "4", "5", "6"]', correctAnswer: '4', explanation: 'Basic addition' }
            ],
            videos: [
                { title: 'Video Title', url: 'Video URL', subject: 'Subject', chapter: 'Chapter', duration: '10:30' },
                { title: 'Introduction to Algebra', url: 'https://youtube.com/watch?v=abc123', subject: 'Mathematics', chapter: 'Algebra', duration: '15:45' }
            ]
        };

        const template = templates[contentType];
        const csv = this.convertToCSV(template);
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contentType}_template.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
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

// Initialize bulk upload system
window.bulkUploadSystem = new BulkUploadSystem(); 