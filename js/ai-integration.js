// AI Integration with Google Gemini API
class AIIntegration {
    constructor() {
        this.apiKey = null; // Will be set from environment or user input
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.chatHistory = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Try to get API key from localStorage or environment
        this.apiKey = localStorage.getItem('gemini_api_key') || process.env.GEMINI_API_KEY;
        if (this.apiKey) {
            this.isInitialized = true;
        }
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('gemini_api_key', apiKey);
        this.isInitialized = true;
    }

    async makeRequest(prompt, options = {}) {
        if (!this.isInitialized) {
            throw new Error('AI not initialized. Please set API key first.');
        }

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
            }
        };

        try {
            const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('AI request failed:', error);
            throw error;
        }
    }

    // AI Quiz Generation
    async generateQuizQuestions(chapterContent, subject, chapterName, options = {}) {
        const prompt = `
        Generate 5 quiz questions for ${subject} chapter "${chapterName}" based on this content:
        
        ${chapterContent}
        
        Requirements:
        - Mix of multiple choice, true/false, and fill-in-the-blanks
        - Include difficulty levels (easy, medium, hard)
        - Provide detailed explanations for each answer
        - Support both English and Nepali languages
        - Make questions engaging and educational
        
        Format the response as JSON:
        {
            "questions": [
                {
                    "id": 1,
                    "type": "multiple_choice|true_false|fill_blank",
                    "difficulty": "easy|medium|hard",
                    "question": "Question text",
                    "question_nepali": "नेपाली प्रश्न",
                    "options": ["A", "B", "C", "D"],
                    "correct_answer": "A",
                    "explanation": "Detailed explanation",
                    "explanation_nepali": "नेपाली व्याख्या"
                }
            ]
        }
        `;

        try {
            const response = await this.makeRequest(prompt, { temperature: 0.8 });
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to generate quiz questions:', error);
            return this.generateFallbackQuestions(chapterName, subject);
        }
    }

    generateFallbackQuestions(chapterName, subject) {
        // Fallback questions if AI fails
        return {
            questions: [
                {
                    id: 1,
                    type: "multiple_choice",
                    difficulty: "easy",
                    question: `What is the main topic of ${chapterName} in ${subject}?`,
                    question_nepali: `${subject} मा ${chapterName} को मुख्य विषय के हो?`,
                    options: ["Basic concepts", "Advanced topics", "Historical background", "Future applications"],
                    correct_answer: "A",
                    explanation: "This chapter covers the fundamental concepts and principles.",
                    explanation_nepali: "यो अध्याय मौलिक अवधारणाहरू र सिद्धान्तहरू समावेश गर्दछ।"
                }
            ]
        };
    }

    // AI Answer Enhancement
    async enhanceAnswer(originalAnswer, question, subject) {
        const prompt = `
        Enhance this answer for a ${subject} question:
        
        Question: ${question}
        Original Answer: ${originalAnswer}
        
        Please provide:
        1. A more detailed explanation
        2. Related concepts and examples
        3. Step-by-step reasoning
        4. Common mistakes to avoid
        5. Practice tips
        
        Format as JSON:
        {
            "enhanced_answer": "Detailed answer",
            "examples": ["Example 1", "Example 2"],
            "step_by_step": ["Step 1", "Step 2", "Step 3"],
            "common_mistakes": ["Mistake 1", "Mistake 2"],
            "practice_tips": ["Tip 1", "Tip 2"]
        }
        `;

        try {
            const response = await this.makeRequest(prompt, { temperature: 0.6 });
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to enhance answer:', error);
            return {
                enhanced_answer: originalAnswer,
                examples: [],
                step_by_step: [],
                common_mistakes: [],
                practice_tips: []
            };
        }
    }

    // AI Study Planner
    async generateStudyPlan(userData, examDate, subjects) {
        const prompt = `
        Create a personalized study plan for a student with these details:
        
        Exam Date: ${examDate}
        Available Time: ${userData.availableHours} hours per day
        Weak Subjects: ${userData.weakSubjects.join(', ')}
        Strong Subjects: ${userData.strongSubjects.join(', ')}
        Subjects to Study: ${subjects.join(', ')}
        
        Generate a detailed study schedule that:
        1. Prioritizes weak subjects
        2. Includes regular revision
        3. Balances all subjects
        4. Includes practice tests
        5. Provides daily goals
        
        Format as JSON:
        {
            "weekly_plan": [
                {
                    "day": "Monday",
                    "subjects": [
                        {
                            "subject": "Mathematics",
                            "topics": ["Algebra", "Geometry"],
                            "duration": 2,
                            "activities": ["Study", "Practice", "Quiz"]
                        }
                    ]
                }
            ],
            "daily_goals": ["Goal 1", "Goal 2"],
            "revision_schedule": ["Week 1: All subjects", "Week 2: Weak subjects"]
        }
        `;

        try {
            const response = await this.makeRequest(prompt, { temperature: 0.7 });
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to generate study plan:', error);
            return this.generateFallbackStudyPlan(examDate, subjects);
        }
    }

    generateFallbackStudyPlan(examDate, subjects) {
        const weeksUntilExam = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24 * 7));
        
        return {
            weekly_plan: subjects.map(subject => ({
                day: "Daily",
                subjects: [{
                    subject: subject,
                    topics: ["Core concepts", "Practice problems"],
                    duration: 2,
                    activities: ["Study", "Practice"]
                }]
            })),
            daily_goals: ["Complete assigned topics", "Take practice quiz"],
            revision_schedule: [`Week ${weeksUntilExam}: Final revision`]
        };
    }

    // AI Chatbot Assistant
    async chatWithAssistant(message, context = {}) {
        const systemPrompt = `
        You are an educational assistant for Nepali Class 9 and 10 students. 
        You help with subjects like Mathematics, Science, English, and Nepali.
        
        Context: ${JSON.stringify(context)}
        
        Provide helpful, accurate, and encouraging responses. 
        If you don't know something, say so and suggest where to find the information.
        Support both English and Nepali languages.
        `;

        const fullPrompt = `${systemPrompt}\n\nStudent: ${message}\n\nAssistant:`;

        try {
            const response = await this.makeRequest(fullPrompt, { temperature: 0.8 });
            
            // Store in chat history
            this.chatHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            });
            
            this.chatHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date()
            });

            return response;
        } catch (error) {
            console.error('Chatbot failed:', error);
            return "I'm sorry, I'm having trouble connecting right now. Please try again later or check your internet connection.";
        }
    }

    // Smart Content Scraping
    async scrapeAndStructureContent(url, subject) {
        const prompt = `
        I want to scrape educational content from this URL: ${url}
        Subject: ${subject}
        
        Please analyze the content and structure it into:
        1. Chapter divisions
        2. Key concepts
        3. Questions and answers
        4. Important formulas or definitions
        
        Format as JSON:
        {
            "chapters": [
                {
                    "title": "Chapter Title",
                    "content": "Chapter content",
                    "key_concepts": ["Concept 1", "Concept 2"],
                    "questions": [
                        {
                            "question": "Question text",
                            "answer": "Answer text",
                            "type": "multiple_choice|true_false|subjective"
                        }
                    ]
                }
            ]
        }
        
        Note: Since I can't actually access the URL, provide a template structure based on typical ${subject} content.
        `;

        try {
            const response = await this.makeRequest(prompt, { temperature: 0.6 });
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to scrape content:', error);
            return {
                chapters: [],
                error: "Failed to process content"
            };
        }
    }

    // Adaptive Learning Suggestions
    async getAdaptiveSuggestions(userPerformance, currentSubject) {
        const prompt = `
        Based on this student's performance data:
        ${JSON.stringify(userPerformance)}
        
        Current subject: ${currentSubject}
        
        Provide adaptive learning suggestions:
        1. Which topics need more focus
        2. Recommended difficulty level
        3. Suggested study materials
        4. Practice exercises
        5. Revision schedule
        
        Format as JSON:
        {
            "focus_areas": ["Topic 1", "Topic 2"],
            "recommended_difficulty": "easy|medium|hard",
            "study_materials": ["Material 1", "Material 2"],
            "practice_exercises": ["Exercise 1", "Exercise 2"],
            "revision_schedule": "Daily|Weekly|Monthly"
        }
        `;

        try {
            const response = await this.makeRequest(prompt, { temperature: 0.7 });
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to get adaptive suggestions:', error);
            return {
                focus_areas: ["Core concepts"],
                recommended_difficulty: "medium",
                study_materials: ["Textbook", "Practice questions"],
                practice_exercises: ["Chapter exercises"],
                revision_schedule: "Weekly"
            };
        }
    }

    // AI Question Generation from Text
    async generateQuestionsFromText(text, subject, questionType = 'mixed') {
        const prompt = `
        Generate questions from this educational text:
        
        Text: ${text}
        Subject: ${subject}
        Question Type: ${questionType}
        
        Create 10 questions including:
        - Multiple choice questions
        - True/False questions
        - Fill-in-the-blanks
        - Short answer questions
        
        Format as JSON:
        {
            "questions": [
                {
                    "id": 1,
                    "type": "multiple_choice|true_false|fill_blank|short_answer",
                    "question": "Question text",
                    "options": ["A", "B", "C", "D"],
                    "correct_answer": "A",
                    "explanation": "Explanation",
                    "difficulty": "easy|medium|hard"
                }
            ]
        }
        `;

        try {
            const response = await this.makeRequest(prompt, { temperature: 0.8 });
            return JSON.parse(response);
        } catch (error) {
            console.error('Failed to generate questions from text:', error);
            return { questions: [] };
        }
    }

    // Get chat history
    getChatHistory() {
        return this.chatHistory;
    }

    // Clear chat history
    clearChatHistory() {
        this.chatHistory = [];
    }

    // Check if AI is available
    isAvailable() {
        return this.isInitialized && this.apiKey;
    }

    // Get API key status (without exposing the key)
    getApiKeyStatus() {
        return {
            isSet: !!this.apiKey,
            isInitialized: this.isInitialized
        };
    }
}

// Initialize AI integration
window.aiIntegration = new AIIntegration(); 