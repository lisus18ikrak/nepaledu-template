// SEO Router System for NepalEdu
class SEORouter {
    constructor() {
        this.routes = {
            '/': 'home',
            '/subjects': 'subjects',
            '/subjects/mathematics': 'subject-detail',
            '/subjects/science': 'subject-detail',
            '/subjects/english': 'subject-detail',
            '/subjects/nepali': 'subject-detail',
            '/quiz': 'quiz',
            '/dashboard': 'dashboard',
            '/leaderboard': 'leaderboard'
        };
        
        this.currentRoute = null;
        this.init();
    }
    
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
        
        // Handle initial route
        this.handleRoute(window.location.pathname);
        
        // Intercept all internal links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = new URL(e.target.href).pathname;
                this.navigateTo(path);
            }
        });
    }
    
    handleRoute(path) {
        // Hide all sections first
        this.hideAllSections();
        
        // Handle dynamic routes
        if (path.startsWith('/subjects/') && path.includes('/chapters/')) {
            this.showChapterDetail(path);
            return;
        }
        
        if (path.startsWith('/subjects/') && path.includes('/questions/')) {
            this.showQuestionDetail(path);
            return;
        }
        
        // Handle static routes
        const section = this.routes[path] || 'home';
        this.showSection(section);
        
        // Update navigation
        this.updateNavigation(path);
        
        // Update page title and meta
        this.updatePageMeta(path);
        
        this.currentRoute = path;
    }
    
    navigateTo(path) {
        // Update browser history
        window.history.pushState({}, '', path);
        
        // Handle the route
        this.handleRoute(path);
    }
    
    hideAllSections() {
        const sections = ['home', 'subjects', 'subject-detail', 'chapter-detail', 'question-detail', 'quiz', 'dashboard', 'leaderboard'];
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                element.style.display = 'none';
            }
        });
    }
    
    showSection(sectionName) {
        const section = document.getElementById(sectionName);
        if (section) {
            section.style.display = 'block';
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Trigger animations
            this.animateSection(section);
        }
    }
    
    showChapterDetail(path) {
        this.showSection('chapter-detail');
        this.loadChapterContent(path);
    }
    
    showQuestionDetail(path) {
        this.showSection('question-detail');
        this.loadQuestionContent(path);
    }
    
    loadChapterContent(path) {
        const pathParts = path.split('/');
        const subjectId = pathParts[2];
        const chapterId = pathParts[4];
        
        const section = document.getElementById('chapter-detail');
        if (section) {
            section.innerHTML = `
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <div class="breadcrumb mb-6">
                        <a href="/">Home</a> > 
                        <a href="/subjects">Subjects</a> > 
                        <a href="/subjects/${subjectId}">${this.getSubjectName(subjectId)}</a> > 
                        Chapter ${chapterId}
                    </div>
                    
                    <h1 class="text-3xl font-bold mb-8">Chapter ${chapterId} - ${this.getSubjectName(subjectId)}</h1>
                    
                    <div class="content-card">
                        <h2 class="text-2xl font-semibold mb-4">Chapter Overview</h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            This chapter covers essential concepts in ${this.getSubjectName(subjectId)}. 
                            You'll find detailed explanations, examples, and practice questions.
                        </p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 class="text-lg font-semibold mb-3">Key Topics</h3>
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>• Fundamental concepts</li>
                                    <li>• Step-by-step solutions</li>
                                    <li>• Practice problems</li>
                                    <li>• Real-world applications</li>
                                </ul>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h3 class="text-lg font-semibold mb-3">Learning Resources</h3>
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>• Textbook solutions</li>
                                    <li>• Video explanations</li>
                                    <li>• Practice quizzes</li>
                                    <li>• Past paper questions</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="mt-8">
                            <h3 class="text-xl font-semibold mb-4">Questions in this Chapter</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <a href="/subjects/${subjectId}/chapters/${chapterId}/questions/q1" 
                                   class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
                                    <h4 class="font-semibold mb-2">Question 1</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-300">Basic concept question</p>
                                </a>
                                <a href="/subjects/${subjectId}/chapters/${chapterId}/questions/q2" 
                                   class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
                                    <h4 class="font-semibold mb-2">Question 2</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-300">Application question</p>
                                </a>
                                <a href="/subjects/${subjectId}/chapters/${chapterId}/questions/q3" 
                                   class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
                                    <h4 class="font-semibold mb-2">Question 3</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-300">Advanced problem</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    loadQuestionContent(path) {
        const pathParts = path.split('/');
        const subjectId = pathParts[2];
        const chapterId = pathParts[4];
        const questionId = pathParts[6];
        
        const section = document.getElementById('question-detail');
        if (section) {
            section.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <div class="breadcrumb mb-6">
                        <a href="/">Home</a> > 
                        <a href="/subjects">Subjects</a> > 
                        <a href="/subjects/${subjectId}">${this.getSubjectName(subjectId)}</a> > 
                        <a href="/subjects/${subjectId}/chapters/${chapterId}">Chapter ${chapterId}</a> > 
                        Question ${questionId}
                    </div>
                    
                    <div class="content-card">
                        <h1 class="text-2xl font-bold mb-6">Question ${questionId}</h1>
                        
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                            <h2 class="text-lg font-semibold mb-4">Question</h2>
                            <p class="text-gray-800 dark:text-gray-200 mb-4">
                                ${this.getQuestionText(subjectId, chapterId, questionId)}
                            </p>
                        </div>
                        
                        <div class="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                            <h2 class="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">Solution</h2>
                            <p class="text-green-700 dark:text-green-300 mb-4" id="student-answer-text">
                                ${this.getQuestionAnswer(subjectId, chapterId, questionId)}
                            </p>
                            <button id="enhanceStudentAnswerBtn" class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold mb-2">
                                <i class="fas fa-magic mr-2"></i>Enhance with AI
                            </button>
                            <div id="enhancedStudentAnswer" class="mt-2 text-green-800 dark:text-green-200"></div>
                        </div>
                        
                        <script>
                        document.getElementById('enhanceStudentAnswerBtn').onclick = async function() {
                            const answer = document.getElementById('student-answer-text').innerText;
                            const resultDiv = document.getElementById('enhancedStudentAnswer');
                            resultDiv.innerHTML = 'Enhancing...';
                            const res = await fetch('ai_enhance.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'text=' + encodeURIComponent(answer) });
                            const data = await res.text();
                            resultDiv.innerHTML = data;
                        };
                        </script>
                        
                        <div class="mt-8 flex justify-between">
                            <a href="/subjects/${subjectId}/chapters/${chapterId}" 
                               class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
                                ← Back to Chapter
                            </a>
                            <a href="/subjects/${subjectId}/chapters/${chapterId}/questions/${this.getNextQuestionId(questionId)}" 
                               class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg">
                                Next Question →
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    getSubjectName(subjectId) {
        const subjects = {
            'mathematics': 'Mathematics',
            'science': 'Science',
            'english': 'English',
            'nepali': 'Nepali'
        };
        return subjects[subjectId] || subjectId;
    }
    
    getQuestionText(subjectId, chapterId, questionId) {
        // This would typically come from a database
        const questions = {
            'mathematics': {
                'chapter-1': {
                    'q1': 'What is the definition of a prime number?',
                    'q2': 'Solve the equation: 2x + 5 = 13',
                    'q3': 'Find the area of a circle with radius 7cm'
                }
            },
            'science': {
                'chapter-1': {
                    'q1': 'What are the three states of matter?',
                    'q2': 'Define photosynthesis',
                    'q3': 'Explain the water cycle'
                }
            }
        };
        
        return questions[subjectId]?.[chapterId]?.[questionId] || 'Question text not available';
    }
    
    getQuestionAnswer(subjectId, chapterId, questionId) {
        // This would typically come from a database
        const answers = {
            'mathematics': {
                'chapter-1': {
                    'q1': 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.',
                    'q2': 'x = 4 (Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4)',
                    'q3': 'Area = πr² = π × 7² = 49π cm² ≈ 153.94 cm²'
                }
            },
            'science': {
                'chapter-1': {
                    'q1': 'The three states of matter are solid, liquid, and gas.',
                    'q2': 'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.',
                    'q3': 'The water cycle is the continuous movement of water on, above, and below the surface of the Earth.'
                }
            }
        };
        
        return answers[subjectId]?.[chapterId]?.[questionId] || 'Answer not available';
    }
    
    getNextQuestionId(currentId) {
        const num = parseInt(currentId.replace('q', ''));
        return `q${num + 1}`;
    }
    
    updateNavigation(path) {
        // Update active navigation link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-primary-500');
            if (link.getAttribute('href') === path) {
                link.classList.add('text-primary-500');
            }
        });
    }
    
    updatePageMeta(path) {
        const titles = {
            '/': 'NepalEdu - Class 9 & 10 Learning Platform',
            '/subjects': 'All Subjects - NepalEdu',
            '/subjects/mathematics': 'Mathematics - NepalEdu',
            '/subjects/science': 'Science - NepalEdu',
            '/subjects/english': 'English - NepalEdu',
            '/subjects/nepali': 'Nepali - NepalEdu',
            '/quiz': 'Daily Quiz - NepalEdu',
            '/dashboard': 'Student Dashboard - NepalEdu'
        };
        
        const descriptions = {
            '/': 'Complete educational platform for Nepali Class 9 and 10 students with textbook solutions, past papers, and interactive learning tools.',
            '/subjects': 'Explore all subjects including Mathematics, Science, English, and Nepali with comprehensive study materials.',
            '/subjects/mathematics': 'Master Mathematics with step-by-step solutions, practice problems, and interactive learning tools.',
            '/subjects/science': 'Learn Science concepts with detailed explanations, experiments, and real-world applications.',
            '/subjects/english': 'Improve English skills with grammar lessons, literature analysis, and communication practice.',
            '/subjects/nepali': 'Study Nepali language, literature, and culture with comprehensive learning materials.',
            '/quiz': 'Test your knowledge with our daily quizzes and track your progress.',
            '/dashboard': 'Monitor your learning progress, access bookmarks, and manage your study plans.'
        };
        
        // Update title
        document.title = titles[path] || 'NepalEdu - Class 9 & 10 Learning Platform';
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptions[path] || descriptions['/']);
        }
        
        // Update canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', `https://nepaledu.com${path}`);
        }
    }
    
    animateSection(section) {
        // Add entrance animation
        gsap.from(section, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out'
        });
    }
}

// Initialize SEO Router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.seoRouter = new SEORouter();
}); 