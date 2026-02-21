lucide.createIcons();

            // View Management
            const heroSection = document.getElementById('hero-section');
            const interactiveContainer = document.getElementById('interactive-container');

            
            function openMode(mode) {
                // Hide Hero
                heroSection.style.display = 'none';
                
                // Show Container
                interactiveContainer.classList.remove('hidden');
                
                // Hide all modes first
                document.querySelectorAll('[id^="mode-"]').forEach(el => {
                    el.classList.add('hidden');
                    el.classList.remove('active');
                });

                // Show specific mode with slight delay for animation
                const targetMode = document.getElementById(`mode-${mode}`);
                if(targetMode) {
                    targetMode.classList.remove('hidden');
                    // Trigger reflow
                    void targetMode.offsetWidth; 
                    targetMode.classList.add('active');
                }

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function resetView() {
                // Show Hero
                heroSection.style.display = 'block';
                
                // Hide Container
                interactiveContainer.classList.add('hidden');
                
                // Reset internal mode states if needed
                document.querySelectorAll('[id^="mode-"]').forEach(el => {
                    el.classList.add('hidden');
                });
            }


           function resetViewMental() {
    if (confirm('Are you sure you want to close? Your progress will be lost.')) {
        resetAssessment();
    }

    document.querySelectorAll('.mentalPanel').forEach(el => {
        el.classList.remove('hidden');
    });

    document.querySelectorAll('.mentalCheck').forEach(el => {
        el.classList.add('hidden');
    });

    document.querySelectorAll('[id^="mode-"]').forEach(el => {
        el.classList.add('hidden');
    });
    
    const mentalPanel = document.getElementById('mode-mental');
    if (mentalPanel) mentalPanel.classList.remove('hidden');
}
            function clearSearch() {
                const input = document.querySelector('input[type="text"]');
                if(input) input.value = '';
            }

            // LOGIN PANEL CONTROL
function openLogin() {
    document.getElementById("loginPanel").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginPanel").style.display = "none";
}

// SIMPLE ADMIN LOGIN
function loginAdmin(event) {
    event.preventDefault();

    const username = document.getElementById("adminUser").value;
    const password = document.getElementById("adminPass").value;
    const msg = document.getElementById("loginMsg");

    // demo credentials (you can change later)
    const adminUser = "admin";
    const adminPass = "1234";

    if (username === adminUser && password === adminPass) {
        msg.style.color = "green";
        msg.innerText = "Login successful!";
        setTimeout(() => {
            closeLogin();
            alert("Welcome Admin!");
        }, 1000);
    } else {
        msg.style.color = "red";
        msg.innerText = "Invalid username or password";
    }
}
            
            //FAQ SECTION
            const faqData = [
            {
                id: 1,
                category: 'general',
                question: "What is a normal body temperature?",
                answer: "A normal body temperature ranges from <strong>97°F to 99°F (36.1°C to 37.2°C)</strong>. It varies throughout the day and can be affected by activity, age, and hormones. Temperatures above 100.4°F (38°C) indicate a fever.",
                icon: "fa-temperature-half"
            },
            {
                id: 2,
                category: 'lifestyle',
                question: "How many hours should I sleep each night?",
                answer: "Teenagers (13-18 years) need <strong>8-10 hours</strong> of sleep per night. School-age children (6-12 years) need 9-12 hours. Quality sleep improves memory, mood, and immune function. Try to maintain a consistent sleep schedule even on weekends.",
                icon: "fa-moon"
            },
            {
                id: 3,
                category: 'medication',
                question: "Can I take paracetamol (acetaminophen) on an empty stomach?",
                answer: "Yes, paracetamol can generally be taken on an empty stomach and is gentler on the stomach than ibuprofen or aspirin. However:<br>• Always follow the dosage instructions<br>• Do not exceed 3,000-4,000mg per day (adult max)<br>• Take with food if you experience any stomach discomfort<br>• Never mix with alcohol",
                icon: "fa-pills"
            },
            {
                id: 4,
                category: 'everyday',
                question: "Why do I feel dizzy when standing up?",
                answer: "This is often <strong>orthostatic hypotension</strong> - a sudden drop in blood pressure when standing. Common causes include:<br>• Dehydration<br>• Standing up too quickly<br>• Low blood sugar<br>• Anemia<br><br>To prevent it: Stand up slowly, stay hydrated, and eat regular meals. If dizziness is frequent or severe, consult the nurse.",
                icon: "fa-person-falling"
            },
            {
                id: 5,
                category: 'everyday',
                question: "How much water should I drink daily?",
                answer: "Teenagers should drink about <strong>8-10 cups (2-2.5 liters)</strong> of water daily. Needs vary based on:<br>• Physical activity level<br>• Weather/climate<br>• Body size<br><br>Signs you're drinking enough: Pale yellow urine, rarely feeling thirsty, and regular bathroom breaks every 3-4 hours.",
                icon: "fa-glass-water"
            },
            {
                id: 6,
                category: 'everyday',
                question: "What are the signs of dehydration?",
                answer: "Watch for these warning signs:<br>• Thirst and dry mouth<br>• Dark yellow or amber urine<br>• Headache or dizziness<br>• Fatigue or confusion<br>• Dry skin<br>• Rapid heartbeat<br><br><strong>Immediate action:</strong> Drink water or electrolyte solutions slowly. Seek help if symptoms are severe or include vomiting.",
                icon: "fa-droplet-slash"
            },
            {
                id: 7,
                category: 'general',
                question: "What is a normal resting heart rate?",
                answer: "For teenagers, a normal resting heart rate is between <strong>60-100 beats per minute</strong>. Athletes may have lower rates (40-60 bpm). Factors affecting heart rate include fitness level, emotions, medications, and caffeine intake.",
                icon: "fa-heart-pulse"
            },
            {
                id: 8,
                category: 'lifestyle',
                question: "How can I improve my concentration during class?",
                answer: "Try these evidence-based strategies:<br>• <strong>Sleep well</strong> - 8+ hours improves focus<br>• <strong>Hydrate</strong> - Even mild dehydration affects cognition<br>• <strong>Eat brain foods</strong> - nuts, berries, fish, whole grains<br>• <strong>Move regularly</strong> - 5-minute walks boost attention<br>• <strong>Limit distractions</strong> - keep phone away<br>• <strong>Practice mindfulness</strong> - 2-minute breathing exercises help",
                icon: "fa-brain"
            },
            {
                id: 9,
                category: 'medication',
                question: "Is it safe to share prescription medication?",
                answer: "<strong>Never share prescription medications.</strong> This is dangerous because:<br>• Dosages are personalized to individual needs<br>• You may have allergies or interactions<br>• It's illegal and against school policy<br>• What helps one person can harm another<br><br>Always consult the school nurse before taking any medication at school.",
                icon: "fa-triangle-exclamation"
            },
            {
                id: 10,
                category: 'everyday',
                question: "Why do I get headaches during school?",
                answer: "Common school-related headache triggers:<br>• <strong>Eye strain</strong> - from screens or reading; try the 20-20-20 rule<br>• <strong>Dehydration</strong> - keep a water bottle handy<br>• <strong>Stress/tension</strong> - practice shoulder/neck stretches<br>• <strong>Poor posture</strong> - adjust chair and desk height<br>• <strong>Skipped meals</strong> - eat regular, balanced snacks<br>• <strong>Lack of sleep</strong> - prioritize 8+ hours",
                icon: "fa-head-side-virus"
            },
            {
                id: 11,
                category: 'lifestyle',
                question: "How can I boost my immune system naturally?",
                answer: "Support your immune system with:<br>• <strong>Nutrition</strong> - vitamin C (citrus), vitamin D (sunlight), zinc (nuts), probiotics (yogurt)<br>• <strong>Sleep</strong> - 8-10 hours for teens<br>• <strong>Exercise</strong> - 60 minutes of moderate activity daily<br>• <strong>Hygiene</strong> - regular hand washing<br>• <strong>Stress management</strong> - chronic stress weakens immunity<br>• <strong>Vaccinations</strong> - stay up to date with flu and routine vaccines",
                icon: "fa-shield-virus"
            },
            {
                id: 12,
                category: 'general',
                question: "When should I stay home from school due to illness?",
                answer: "Stay home if you have:<br>• Fever over 100.4°F (38°C) - stay home until fever-free for 24 hours without medication<br>• Vomiting or diarrhea - stay home until symptom-free for 24 hours<br>• Persistent cough or sore throat<br>• Eye infections (pink eye)<br>• Contagious conditions like strep throat or flu<br><br>Returning too early can spread illness and slow your recovery.",
                icon: "fa-house-medical"
            },
            {
                id: 13,
                category: 'medication',
                question: "Can I take ibuprofen for menstrual cramps?",
                answer: "Yes, ibuprofen is effective for menstrual cramps and is safe for most teenagers when used correctly:<br>• Take with food to protect your stomach<br>• Follow package dosage instructions<br>• Start at the first sign of cramps for best effect<br>• Do not exceed 1,200mg per day (OTC limit)<br>• Avoid if you have stomach ulcers, kidney disease, or are dehydrated<br><br>The school nurse can provide guidance and a quiet space if needed.",
                icon: "fa-capsules"
            },
            {
                id: 14,
                category: 'everyday',
                question: "Why do my hands get cold and sweaty when I'm nervous?",
                answer: "This is your body's <strong>'fight or flight'</strong> response. When anxious, adrenaline causes:<br>• Blood vessels in hands/feet to constrict (cold)<br>• Sweat glands to activate (sweaty palms)<br>• Increased heart rate<br><br>To manage it:<br>• Practice deep breathing (4-7-8 technique)<br>• Warm your hands to signal safety to your brain<br>• Use positive self-talk<br>• Prepare thoroughly to build confidence",
                icon: "fa-hand-dots"
            },
            {
                id: 15,
                category: 'lifestyle',
                question: "What's the best way to wash my hands?",
                answer: "Proper handwashing takes 20 seconds and prevents 80% of infections:<br>1. Wet hands with clean, running water<br>2. Apply soap and lather thoroughly<br>3. Scrub all surfaces: palms, backs, between fingers, under nails<br>4. Scrub for 20 seconds (sing 'Happy Birthday' twice)<br>5. Rinse completely under running water<br>6. Dry with a clean towel or air dryer<br><br>Use hand sanitizer (60%+ alcohol) when soap isn't available.",
                icon: "fa-hands-bubbles"
            }
        ];

        // State
        let currentCategory = 'all';
        let searchTerm = '';

        // DOM Elements
        const faqContainer = document.getElementById('faq-container');
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search');
        const searchStats = document.getElementById('search-stats');
        const noResults = document.getElementById('no-results');
        const categoryCards = document.querySelectorAll('.category-card');
        const scrollTopBtn = document.getElementById('scroll-top');
        const modal = document.getElementById('nurse-modal');

        // Initialize
        renderFAQs();

        // Event Listeners
        searchInput.addEventListener('input', handleSearch);
        clearSearchBtn.addEventListener('click', clearSearch);
        
        categoryCards.forEach(card => {
            card.addEventListener('click', () => selectCategory(card.dataset.category));
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Functions
        function renderFAQs() {
            let filtered = faqData;

            // Filter by category
            if (currentCategory !== 'all') {
                filtered = filtered.filter(item => item.category === currentCategory);
            }

            // Filter by search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filtered = filtered.filter(item => 
                    item.question.toLowerCase().includes(term) || 
                    item.answer.toLowerCase().includes(term)
                );
            }

            // Update stats
            if (searchTerm) {
                searchStats.textContent = `Found ${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchTerm}"`;
            } else if (currentCategory !== 'all') {
                const catName = categoryCards.find(c => c.dataset.category === currentCategory).querySelector('h3').textContent;
                searchStats.textContent = `Showing ${filtered.length} questions in ${catName}`;
            } else {
                searchStats.textContent = `Showing all ${faqData.length} questions`;
            }

            // Show/hide no results
            if (filtered.length === 0) {
                faqContainer.innerHTML = '';
                noResults.classList.remove('hidden');
                noResults.classList.add('no-results');
                setTimeout(() => noResults.classList.remove('no-results'), 500);
            } else {
                noResults.classList.add('hidden');
                
                faqContainer.innerHTML = filtered.map((item, index) => `
                    <div class="accordion-item glass-card rounded-2xl overflow-hidden fade-in" style="animation-delay: ${index * 0.05}s">
                        <button class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-colors" onclick="toggleAccordion(${item.id})">
                            <div class="flex items-center gap-4 pr-4">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                    <i class="fas ${item.icon}"></i>
                                </div>
                                <h3 class="font-semibold text-slate-800 text-base md:text-lg leading-snug">${highlightText(item.question)}</h3>
                            </div>
                            <i class="fas fa-chevron-down accordion-icon text-slate-400 flex-shrink-0" id="icon-${item.id}"></i>
                        </button>
                        <div class="accordion-content" id="content-${item.id}">
                            <div class="px-6 pb-6 pt-2 border-t border-slate-100">
                                <div class="pl-14 text-slate-600 leading-relaxed space-y-2">
                                    ${highlightText(item.answer)}
                                </div>
                                <div class="pl-14 mt-4 flex items-center gap-2 text-xs text-slate-400">
                                    <i class="fas fa-tag"></i>
                                    <span class="capitalize">${item.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        function toggleAccordion(id) {
            const content = document.getElementById(`content-${id}`);
            const icon = document.getElementById(`icon-${id}`);
            
            // Close all others (optional - remove if you want multiple open)
            document.querySelectorAll('.accordion-content').forEach(el => {
                if (el.id !== `content-${id}`) {
                    el.classList.remove('open');
                }
            });
            document.querySelectorAll('.accordion-icon').forEach(el => {
                if (el.id !== `icon-${id}`) {
                    el.classList.remove('rotate');
                }
            });
            
            // Toggle current
            content.classList.toggle('open');
            icon.classList.toggle('rotate');
        }

        function selectCategory(category) {
            currentCategory = category;
            
            // Update UI
            categoryCards.forEach(card => {
                if (card.dataset.category === category) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            renderFAQs();
            
            // Scroll to FAQ section on mobile
            if (window.innerWidth < 768) {
                faqContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function handleSearch(e) {
            searchTerm = e.target.value.trim();
            
            if (searchTerm) {
                clearSearchBtn.classList.remove('hidden');
            } else {
                clearSearchBtn.classList.add('hidden');
            }
            
            renderFAQs();
        }

        function clearSearch() {
            searchInput.value = '';
            searchTerm = '';
            clearSearchBtn.classList.add('hidden');
            renderFAQs();
            searchInput.focus();
        }

        function highlightText(text) {
            if (!searchTerm) return text;
            
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }

        function resetFilters() {
            currentCategory = 'all';
            searchTerm = '';
            searchInput.value = '';
            clearSearchBtn.classList.add('hidden');
            
            categoryCards.forEach(card => {
                card.classList.remove('active');
                if (card.dataset.category === 'all') {
                    card.classList.add('active');
                }
            });
            
            renderFAQs();
        }

        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
            
 // Questions Data
            const questions = [
                { id: 1, text: "I feel overwhelmed by school tasks.", category: "academic_stress" },
                { id: 2, text: "I find it hard to relax.", category: "relaxation" },
                { id: 3, text: "I feel tired even after sleeping.", category: "fatigue" },
                { id: 4, text: "I worry about many things.", category: "anxiety" },
                { id: 5, text: "I overthink situations.", category: "rumination" },
                { id: 6, text: "I feel nervous without clear reason.", category: "general_anxiety" },
                { id: 7, text: "I feel sad or down.", category: "mood" },
                { id: 8, text: "I lose interest in activities I enjoy.", category: "anhedonia" },
                { id: 9, text: "I feel confident handling problems.", category: "self_efficacy", reverse: true },
                { id: 10, text: "I feel supported by friends or family.", category: "social_support", reverse: true }
            ];

            // Response labels for AI context
            const responseLabels = ["Never", "Rarely", "Sometimes", "Often", "Always"];

            // State
            let currentQuestion = 0;
            let answers = new Array(10).fill(null);

            // DOM Elements
            const questionText = document.getElementById('question-text');
            const currentNum = document.getElementById('current-num');
            const totalNum = document.getElementById('total-num');
            const progressBar = document.getElementById('progress-bar');
            const progressPercent = document.getElementById('progress-percent');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');
            const optionsContainer = document.getElementById('options-container');
            const questionnaireSection = document.getElementById('questionnaire-section');
            const loadingSection = document.getElementById('loading-section');
            const resultsSection = document.getElementById('results-section');
            const aiResultContent = document.getElementById('ai-result-content');

            // Initialize
            totalNum.textContent = questions.length;
            renderQuestion();

            // Event Listeners
            prevBtn.addEventListener('click', goPrevious);
            nextBtn.addEventListener('click', goNext);
            submitBtn.addEventListener('click', submitAssessment);

            // Radio button change listeners
            document.querySelectorAll('input[name="answer"]').forEach(radio => {
                radio.addEventListener('change', handleAnswer);
            });

            function renderQuestion() {
                const q = questions[currentQuestion];
                questionText.textContent = q.text;
                currentNum.textContent = currentQuestion + 1;
            
                const progress = ((currentQuestion + 1) / questions.length) * 100;
                progressBar.style.width = `${progress}%`;
                progressPercent.textContent = `${Math.round(progress)}%`;

                document.querySelectorAll('input[name="answer"]').forEach(radio => {
                    radio.checked = false;
                    radio.closest('.option-card').classList.remove('selected');
                });

                if (answers[currentQuestion] !== null) {
                    const radio = document.querySelector(`input[value="${answers[currentQuestion]}"]`);
                    if (radio) {
                        radio.checked = true;
                        radio.closest('.option-card').classList.add('selected');
                    }
                }

                updateButtons();

                const container = document.getElementById('question-container');
                container.classList.remove('slide-up');
                void container.offsetWidth;
                container.classList.add('slide-up');
            }

            function handleAnswer(e) {
                const value = parseInt(e.target.value);
                answers[currentQuestion] = value;
            
                document.querySelectorAll('.option-card').forEach(card => {
                    card.classList.remove('selected');
                });
                e.target.closest('.option-card').classList.add('selected');

                updateButtons();
            }

            function updateButtons() {
                if (currentQuestion === 0) {
                    prevBtn.disabled = true;
                    prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
                } else {
                    prevBtn.disabled = false;
                    prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                }

                const hasAnswer = answers[currentQuestion] !== null;
                const isLast = currentQuestion === questions.length - 1;

                if (isLast) {
                    nextBtn.classList.add('hidden');
                    submitBtn.classList.remove('hidden');
                    if (hasAnswer) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    } else {
                        submitBtn.disabled = true;
                        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    }
                } else {
                    nextBtn.classList.remove('hidden');
                    submitBtn.classList.add('hidden');
                    if (hasAnswer) {
                        nextBtn.disabled = false;
                        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    } else {
                        nextBtn.disabled = true;
                        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    }
                }
            }

            function goNext() {
                if (currentQuestion < questions.length - 1) {
                    currentQuestion++;
                    renderQuestion();
                }
            }

            function goPrevious() {
                if (currentQuestion > 0) {
                    currentQuestion--;
                    renderQuestion();
                }
            }

            async function submitAssessment() {
                // Show loading
                questionnaireSection.classList.remove('visible-section');
                questionnaireSection.classList.add('hidden-section');
                loadingSection.classList.remove('hidden-section');
                loadingSection.classList.add('visible-section');

                try {
                    const result = await getAIAnalysis();
                    displayResults(result);
                } catch (error) {
                    console.error("Error:", error);
                    aiResultContent.innerHTML = `
                        <div class="text-red-600 text-center">
                            <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
                            <p>Sorry, we couldn't generate your report. Please try again.</p>
                            <button onclick="resetAssessment()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Try Again</button>
                        </div>
                    `;
                    loadingSection.classList.remove('visible-section');
                    loadingSection.classList.add('hidden-section');
                    resultsSection.classList.remove('hidden-section');
                    resultsSection.classList.add('visible-section');
                }
            }

            async function getAIAnalysis() {
    // Prepare the assessment data
    const assessmentData = questions.map((q, index) => ({
        question: q.text,
        category: q.category,
        answer: responseLabels[answers[index]],
        score: answers[index],
        reverse: q.reverse || false
    }));

    const prompt = `
You are a compassionate mental health wellness assistant analyzing a student's questionnaire responses.

ASSESSMENT DATA:
${JSON.stringify(assessmentData, null, 2)}

SCORING GUIDE:
- Questions 1-8: Higher scores (0-4) indicate more stress/distress
- Questions 9-10: Reverse scored (higher is better, lower indicates concern)

You are generating a mental wellness result summary.

Your output MUST strictly follow this exact format and spacing:

Title on the first line (no emojis).

One blank line.

A short 2–3 sentence paragraph.

One blank line.

Section header: What this means:

One blank line.

3 bullet points using "-" (dash + space).

One blank line.

Section header: Gentle suggestions:

One blank line.

2 bullet points using "-" (dash + space).

One blank line.

One short encouragement sentence on its own line.

STYLE RULES:

Calm and supportive tone.

No emojis.

No clinical or diagnostic language.

No mention of scores or categories.

No extra sections.

Keep sentences short and easy to read.

Do NOT add explanations before or after the result.

Make it feel clean and not overwhelming.

The structure must look exactly like this:

Title Here

Short supportive paragraph (2–3 sentences).

What this means:

First insight.

Second insight.

Third insight.

Gentle suggestions:

First simple suggestion.

Second simple suggestion.

Short encouragement sentence.

Now generate the result based on the provided emotional indicators.`;

    // CALL YOUR BACKEND instead of GROQ directly
    const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: prompt }) // send prompt to backend
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content; // backend returns GROQ response
}

            function displayResults(aiText) {
                loadingSection.classList.remove('visible-section');
                loadingSection.classList.add('hidden-section');
                resultsSection.classList.remove('hidden-section');
                resultsSection.classList.add('visible-section');

                // Convert markdown-style headers to HTML
                let formattedHtml = aiText
                    .replace(/## (.*?)\n/g, '<h3>$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*?)\n/g, '<li>$1</li>')
                    .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>')
                    .replace(/\n\n/g, '<br><br>');

                aiResultContent.innerHTML = formattedHtml;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function resetAssessment() {
                currentQuestion = 0;
                answers = new Array(10).fill(null);
            
                resultsSection.classList.remove('visible-section');
                resultsSection.classList.add('hidden-section');
                questionnaireSection.classList.remove('hidden-section');
                questionnaireSection.classList.add('visible-section');
            
                renderQuestion();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function downloadReport() {
                const content = document.getElementById('ai-result-content').innerText;
                const blob = new Blob([`Mental Health Check - ${new Date().toLocaleDateString()}\n\n${content}`], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wellness-report.txt';
                a.click();
                URL.revokeObjectURL(url);
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (resultsSection.classList.contains('visible-section') || loadingSection.classList.contains('visible-section')) return;
            
                if (e.key === 'ArrowLeft' && currentQuestion > 0) {
                    goPrevious();
                } else if (e.key === 'ArrowRight' && currentQuestion < questions.length - 1 && answers[currentQuestion] !== null) {
                    goNext();
                } else if (e.key >= '1' && e.key <= '5') {
                    const value = parseInt(e.key) - 1;
                    const radio = document.querySelector(`input[value="${value}"]`);
                    if (radio) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change'));
                    }
                }
            });

            function loadChatWidget() {
                // Prevent loading twice
                if (document.getElementById("leadconnector-widget")) return;

                const script = document.createElement("script");
                script.id = "leadconnector-widget";
                script.src = "https://widgets.leadconnectorhq.com/loader.js";
                script.setAttribute(
                    "data-resources-url",
                    "https://widgets.leadconnectorhq.com/chat-widget/loader.js"
                );
                script.setAttribute("data-widget-id", "69913f5da0e96a88091fcd46");
                script.async = true;

                document.body.appendChild(script);
            }