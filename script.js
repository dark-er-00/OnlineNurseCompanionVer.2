lucide.createIcons();

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-0`;
    
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        notification.classList.add('bg-red-500', 'text-white');
    } else {
        notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate-y-2';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
            openAdminDashboard();
        }, 1000);
    } else {
        msg.style.color = "red";
        msg.innerText = "Invalid username or password";
    }
}

// ADMIN DASHBOARD FUNCTIONS
function openAdminDashboard() {
    // Hide Hero
    heroSection.style.display = 'none';
    
    // Show Container
    interactiveContainer.classList.remove('hidden');
    
    // Hide all modes first
    document.querySelectorAll('[id^="mode-"]').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('active');
    });

    // Show admin dashboard
    const adminMode = document.getElementById('mode-admin');
    if(adminMode) {
        adminMode.classList.remove('hidden');
        void adminMode.offsetWidth; 
        adminMode.classList.add('active');
    }

    // Load data
    loadAdminStats();
    loadCases();
    
    // Initialize Socket.io for real-time updates
    if (typeof io !== 'undefined') {
        const socket = io();
        
        socket.on('new-case', (newCase) => {
            console.log('New case received:', newCase);
            // Show notification
            showNotification('New case received from Google Sheets!', 'success');
            // Reload data
            loadCases();
            loadAdminStats();
        });
        
        socket.on('case-updated', (updatedCase) => {
            console.log('Case updated:', updatedCase);
            loadCases();
            loadAdminStats();
        });
        
        socket.on('case-deleted', (data) => {
            console.log('Case deleted:', data);
            loadCases();
            loadAdminStats();
        });
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        resetView();
    }
}

async function loadAdminStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        document.getElementById('total-cases').textContent = stats.totalCases;
        document.getElementById('urgent-cases').textContent = stats.urgentCases;
        document.getElementById('resolved-cases').textContent = stats.closedCases;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadCases() {
    try {
        const statusFilter = document.getElementById('status-filter').value;
        const urgencyFilter = document.getElementById('urgency-filter').value;
        
        let url = '/api/admin/cases';
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (urgencyFilter) params.append('urgency', urgencyFilter);
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url);
        const cases = await response.json();
        renderCases(cases);
    } catch (error) {
        console.error('Error loading cases:', error);
    }
}

function renderCases(cases) {
    const tbody = document.getElementById('cases-table-body');
    tbody.innerHTML = '';
    
    if (cases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-12 text-center text-slate-500">No cases found</td></tr>';
        return;
    }
    
    cases.forEach(caseItem => {
        const row = tbody.insertRow();
        row.className = 'hover:bg-slate-50 transition-colors';
        
        // Date
        const dateCell = row.insertCell();
        dateCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-slate-600';
        dateCell.textContent = new Date(caseItem.createdAt).toLocaleDateString();
        
        // Student
        const studentCell = row.insertCell();
        studentCell.className = 'px-6 py-4 whitespace-nowrap';
        studentCell.innerHTML = `
            <div class="text-sm font-medium text-slate-900">${caseItem.studentName}</div>
            <div class="text-sm text-slate-500">${caseItem.email}</div>
        `;
        
        // Course
        const courseCell = row.insertCell();
        courseCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-slate-600';
        courseCell.textContent = caseItem.course;
        
        // Symptoms
        const symptomsCell = row.insertCell();
        symptomsCell.className = 'px-6 py-4 text-sm text-slate-600';
        symptomsCell.textContent = caseItem.symptoms;
        
        // Urgency
        const urgencyCell = row.insertCell();
        urgencyCell.className = 'px-6 py-4 whitespace-nowrap';
        const urgencyClass = caseItem.urgencyLevel === 'URGENT' ? 'bg-red-100 text-red-600' : 
                           caseItem.urgencyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600';
        urgencyCell.innerHTML = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${urgencyClass}">${caseItem.urgencyLevel}</span>`;
        
        // Status
        const statusCell = row.insertCell();
        statusCell.className = 'px-6 py-4 whitespace-nowrap';
        const statusClass = caseItem.status === 'resolved' ? 'bg-green-100 text-green-600' : 
                          caseItem.status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600';
        statusCell.innerHTML = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${caseItem.status || 'pending'}</span>`;
        
        // Actions
        const actionsCell = row.insertCell();
        actionsCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium';
        actionsCell.innerHTML = `
            <div class="flex gap-2">
                <button onclick="viewCase('${caseItem._id}')" class="text-indigo-600 hover:text-indigo-900">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="updateCaseStatus('${caseItem._id}', 'resolved')" class="text-green-600 hover:text-green-900">
                    <i class="fas fa-check"></i>
                </button>
                <button onclick="deleteCase('${caseItem._id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
}

async function updateCaseStatus(caseId, status) {
    try {
        const response = await fetch(`/api/admin/cases/${caseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadCases();
            loadAdminStats();
        }
    } catch (error) {
        console.error('Error updating case:', error);
    }
}

async function deleteCase(caseId) {
    if (!confirm('Are you sure you want to delete this case?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/cases/${caseId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadCases();
            loadAdminStats();
        }
    } catch (error) {
        console.error('Error deleting case:', error);
    }
}

async function viewCase(caseId) {
    try {
        const response = await fetch(`/api/admin/cases/${caseId}`);
        const caseItem = await response.json();
        alert(`Case Details:\n\nStudent: ${caseItem.studentName}\nEmail: ${caseItem.email}\nCourse: ${caseItem.course}\nSymptoms: ${caseItem.symptoms}\nDuration: ${caseItem.duration}\nPain Level: ${caseItem.painLevel}/10\nUrgency: ${caseItem.urgencyLevel}\nStatus: ${caseItem.status}`);
    } catch (error) {
        console.error('Error viewing case:', error);
    }
}

// Filter handlers
document.getElementById('status-filter')?.addEventListener('change', loadCases);
document.getElementById('urgency-filter')?.addEventListener('change', loadCases);
            
            // First Aid Data
            const firstAidData = [
                {
                    id: 1,
                    title: "Emergency Contacts",
                    icon: "ambulance",
                    description: "Important phone numbers and emergency procedures",
                    details: {
                        overview: "In case of emergency, it's crucial to know who to call and what to do.",
                        steps: [
                            "Call your local emergency number immediately",
                            "Stay calm and provide clear information about the situation",
                            "Follow the instructions of emergency responders",
                            "If you're trained, provide first aid while waiting for help"
                        ],
                        tips: [
                            "Keep emergency numbers saved in your phone",
                            "Know the location of nearest emergency services",
                            "Have a first aid kit readily available"
                        ]
                    }
                },
                {
                    id: 2,
                    title: "Wound Care",
                    icon: "bandage",
                    description: "How to clean and dress minor cuts and scrapes",
                    details: {
                        overview: "Proper wound care helps prevent infection and promotes healing.",
                        steps: [
                            "Wash your hands thoroughly with soap and water",
                            "Apply gentle pressure with clean cloth to stop bleeding",
                            "Rinse the wound with clean water to remove debris",
                            "Clean the area with mild soap and pat dry",
                            "Apply antibiotic ointment to prevent infection",
                            "Cover with sterile bandage or dressing"
                        ],
                        tips: [
                            "Change bandage daily or when wet/dirty",
                            "Watch for signs of infection (redness, swelling, pus, fever)",
                            "Seek medical help for deep or contaminated wounds"
                        ]
                    }
                },
                {
                    id: 3,
                    title: "Burns & Scalds",
                    icon: "ice-cream",
                    description: "Immediate care for minor burns and scalds",
                    details: {
                        overview: "Quick action can minimize damage from burns and scalds.",
                        steps: [
                            "Cool the burn with cool (not cold) running water for 10-15 minutes",
                            "Remove tight clothing or jewelry near the burn",
                            "Cover the burn with sterile, non-stick bandage",
                            "Take over-the-counter pain relievers if needed"
                        ],
                        tips: [
                            "Do not apply ice, butter, or ointments to severe burns",
                            "Seek medical help for burns larger than 3 inches in diameter",
                            "Watch for signs of infection or difficulty breathing"
                        ]
                    }
                },
                {
                    id: 4,
                    title: "Eye Injuries",
                    icon: "headphones",
                    description: "How to handle minor eye irritations and injuries",
                    details: {
                        overview: "Eye injuries require careful handling to avoid further damage.",
                        steps: [
                            "Do not rub the eye",
                            "For foreign objects: Flush with clean water",
                            "For chemical splashes: Flush eye with water for at least 15 minutes",
                            "Cover the eye with sterile bandage if needed"
                        ],
                        tips: [
                            "Seek immediate medical help for severe eye injuries",
                            "Do not attempt to remove embedded objects",
                            "Wear protective eyewear when working with tools or chemicals"
                        ]
                    }
                },
                {
                    id: 5,
                    title: "CPR & AED",
                    icon: "heart-pulse",
                    description: "Basic life support techniques and AED usage",
                    details: {
                        overview: "CPR and AED can save lives in cardiac emergencies.",
                        steps: [
                            "Check the scene for safety",
                            "Check if the person is responsive",
                            "Call emergency services immediately",
                            "Start chest compressions (30 compressions at 100-120 per minute)",
                            "Use AED if available and follow voice instructions"
                        ],
                        tips: [
                            "Take a CPR and first aid course",
                            "AEDs are easy to use even without training",
                            "Continue CPR until help arrives or person responds"
                        ]
                    }
                },
                {
                    id: 6,
                    title: "Choking",
                    icon: "shield",
                    description: "First aid for choking and airway obstruction",
                    details: {
                        overview: "Choking is a life-threatening emergency that requires immediate action.",
                        steps: [
                            "Ask 'Are you choking?' and look for signs of distress",
                            "For adults/children over 1 year: Perform abdominal thrusts (Heimlich maneuver)",
                            "For infants: Give 5 back blows followed by 5 chest thrusts",
                            "If person becomes unresponsive, start CPR"
                        ],
                        tips: [
                            "Learn choking first aid techniques for different age groups",
                            "Be cautious with small objects around young children",
                            "Seek medical help even if choking is resolved"
                        ]
                    }
                }
            ];

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

        // First Aid Modal Functions
        function openFirstAidModal(title) {
            const firstAidItem = firstAidData.find(item => item.title === title);
            if (!firstAidItem) return;

            const modal = document.getElementById('firstaid-modal');
            const modalContent = document.getElementById('firstaid-modal-content');

            modalContent.innerHTML = `
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="${firstAidItem.icon}" class="w-8 h-8"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-2">${firstAidItem.title}</h2>
                    <p class="text-slate-500">${firstAidItem.description}</p>
                </div>

                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-slate-800 mb-4">Overview</h3>
                    <p class="text-slate-600 leading-relaxed">${firstAidItem.details.overview}</p>
                </div>

                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-slate-800 mb-4">Steps to Follow</h3>
                    <ol class="space-y-3">
                        ${firstAidItem.details.steps.map((step, index) => `
                            <li class="flex items-start gap-3">
                                <div class="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                    ${index + 1}
                                </div>
                                <span class="text-slate-600 leading-relaxed">${step}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-slate-800 mb-4">Important Tips</h3>
                    <ul class="space-y-2">
                        ${firstAidItem.details.tips.map(tip => `
                            <li class="flex items-start gap-3">
                                <i class="fas fa-check-circle text-emerald-600 mt-1 flex-shrink-0"></i>
                                <span class="text-slate-600 leading-relaxed">${tip}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="mt-8 pt-6 border-t border-slate-100">
                    <p class="text-sm text-slate-500 text-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        This information is for educational purposes only. Always seek professional medical help in emergencies.
                    </p>
                </div>
            `;

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            lucide.createIcons(); // Recreate icons in modal
        }

        function closeFirstAidModal() {
            const modal = document.getElementById('firstaid-modal');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Close modal on outside click and Escape key
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('firstaid-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeFirstAidModal();
                    }
                });
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('firstaid-modal');
                if (modal && modal.style.display === 'flex') {
                    closeFirstAidModal();
                }
            }
        });

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
            
            // API Key - In production, use backend proxy (this is for demonstration only)
            // Note: Never expose API keys directly in frontend code
            const GROQ_API_KEY = '';

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

                const response = await fetch("/api/groq", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: prompt
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                return data.choices[0].message.content;
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