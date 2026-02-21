// Initialize Lucide icons
lucide.createIcons();

function loadChatWidget() {
    // Prevent loading multiple times
    if (document.getElementById("leadconnector-widget")) {
        showArrowNotification("Chat bot is ready to use!");
        return;
    }

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

    showArrowNotification("Chat bot is ready to use!");
}

// Notification with arrow pointing to bottom-right
function showArrowNotification(message) {
    const notif = document.createElement("div");
    notif.className = `
        fixed bottom-20 right-5 z-50
        flex items-center space-x-2
        bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg
        animate-fade-in
    `;

    // Arrow element
    const arrow = document.createElement("div");
    arrow.className = `
        w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent
        border-t-4 border-t-white
        animate-bounce
        self-end
    `;

    // Message
    const text = document.createElement("span");
    text.innerText = message;

    notif.appendChild(text);
    notif.appendChild(arrow);
    document.body.appendChild(notif);

    // Remove after 3 seconds
    setTimeout(() => {
        notif.remove();
    }, 3000);
}
// ============================================
// MENTAL HEALTH CHECK - SIMPLE QUESTIONNAIRE
// ============================================

// Questions for mental health assessment
var mentalQuestions = [
    { id: 1, text: "I feel overwhelmed by my academic workload", category: "stress" },
    { id: 2, text: "I find it hard to relax or unwind", category: "relaxation" },
    { id: 3, text: "I feel tired even after a full night's sleep", category: "fatigue" },
    { id: 4, text: "I worry about many things constantly", category: "anxiety" },
    { id: 5, text: "I have trouble concentrating on my tasks", category: "focus" },
    { id: 6, text: "I feel nervous or anxious without clear reason", category: "anxiety" },
    { id: 7, text: "I feel sad or down most of the time", category: "mood" },
    { id: 8, text: "I have lost interest in activities I once enjoyed", category: "motivation" },
    { id: 9, text: "I feel confident I can handle my problems", category: "confidence", reverse: true },
    { id: 10, text: "I feel supported by friends or family", category: "support", reverse: true }
];

// Answer labels
var answerLabels = ["Never", "Rarely", "Sometimes", "Often", "Always"];

// State
var currentMentalQuestion = 0;
var mentalAnswers = new Array(10).fill(null);

// ============================================
// MENTAL HEALTH FUNCTIONS
// ============================================

function initMentalCheck() {
    currentMentalQuestion = 0;
    mentalAnswers = new Array(10).fill(null);
    
    // Show questionnaire, hide others
    document.getElementById('mental-questionnaire').classList.remove('hidden-section');
    document.getElementById('mental-questionnaire').classList.add('visible-section');
    document.getElementById('mental-loading').classList.remove('visible-section');
    document.getElementById('mental-loading').classList.add('hidden-section');
    document.getElementById('mental-results').classList.remove('visible-section');
    document.getElementById('mental-results').classList.add('hidden-section');
    
    // Update total questions display
    document.getElementById('mental-total-num').textContent = mentalQuestions.length;
    
    // Render first question
    renderMentalQuestion();
    updateMentalButtons();
}

function renderMentalQuestion() {
    var q = mentalQuestions[currentMentalQuestion];
    document.getElementById('mental-question-text').textContent = q.text;
    document.getElementById('mental-current-num').textContent = currentMentalQuestion + 1;
    
    // Update progress
    var progress = ((currentMentalQuestion + 1) / mentalQuestions.length) * 100;
    document.getElementById('mental-progress-bar').style.width = progress + '%';
    document.getElementById('mental-progress').textContent = Math.round(progress) + '%';
    
    // Clear previous selection
    var buttons = document.querySelectorAll('.mental-option-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected', 'border-violet-500', 'bg-violet-50');
    }
    
    // Highlight selected answer if any
    if (mentalAnswers[currentMentalQuestion] !== null) {
        buttons[mentalAnswers[currentMentalQuestion]].classList.add('selected', 'border-violet-500', 'bg-violet-50');
    }
}

function answerMentalQuestion(value) {
    mentalAnswers[currentMentalQuestion] = value;
    
    // Update visual selection
    var buttons = document.querySelectorAll('.mental-option-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected', 'border-violet-500', 'bg-violet-50');
    }
    buttons[value].classList.add('selected', 'border-violet-500', 'bg-violet-50');
    
    updateMentalButtons();
}

function updateMentalButtons() {
    var prevBtn = document.getElementById('mental-prev-btn');
    var nextBtn = document.getElementById('mental-next-btn');
    var submitBtn = document.getElementById('mental-submit-btn');
    var hasAnswer = mentalAnswers[currentMentalQuestion] !== null;
    var isLast = currentMentalQuestion === mentalQuestions.length - 1;
    
    // Previous button
    if (currentMentalQuestion === 0) {
        prevBtn.disabled = true;
        prevBtn.classList.add('cursor-not-allowed', 'text-slate-400');
        prevBtn.classList.remove('text-slate-600');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('cursor-not-allowed', 'text-slate-400');
        prevBtn.classList.add('text-slate-600');
    }
    
    // Next/Submit buttons
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

function prevMentalQuestion() {
    if (currentMentalQuestion > 0) {
        currentMentalQuestion--;
        renderMentalQuestion();
        updateMentalButtons();
    }
}

function nextMentalQuestion() {
    if (currentMentalQuestion < mentalQuestions.length - 1 && mentalAnswers[currentMentalQuestion] !== null) {
        currentMentalQuestion++;
        renderMentalQuestion();
        updateMentalButtons();
    }
}

function submitMentalCheck() {
    if (mentalAnswers[currentMentalQuestion] === null) {
        showNotification('Please answer the current question', 'error');
        return;
    }
    
    // Show loading
    document.getElementById('mental-questionnaire').classList.remove('visible-section');
    document.getElementById('mental-questionnaire').classList.add('hidden-section');
    document.getElementById('mental-loading').classList.remove('hidden-section');
    document.getElementById('mental-loading').classList.add('visible-section');
    
    // Calculate results after brief delay
    setTimeout(function() {
        calculateMentalResults();
    }, 500);
}

function calculateMentalResults() {
    // Calculate total score
    var totalScore = 0;
    for (var i = 0; i < mentalQuestions.length; i++) {
        var score = mentalAnswers[i];
        // Reverse scoring for positive questions
        if (mentalQuestions[i].reverse) {
            score = 4 - score; // Convert 0->4, 1->3, 2->2, 3->1, 4->0
        }
        totalScore += score;
    }
    
    // Maximum score is 40 (10 questions x 4 points)
    var maxScore = 40;
    var percentage = (totalScore / maxScore) * 100;
    
    // Determine result category
    var result;
    if (percentage >= 75) {
        result = {
            emoji: "😰",
            title: "High Stress Level",
            score: "Score: " + totalScore + "/40",
            description: "Your responses indicate that you may be experiencing significant stress or mental health challenges. " +
                "This could be affecting your daily life, sleep, and academic performance. " +
                "It would be beneficial to speak with a counselor or mental health professional to get support."
        };
    } else if (percentage >= 50) {
        result = {
            emoji: "😐",
            title: "Moderate Stress Level",
            score: "Score: " + totalScore + "/40",
            description: "You're experiencing some stress and emotional challenges, which is common among students. " +
                "Consider incorporating self-care activities, regular exercise, and healthy sleep habits. " +
                "If feelings persist, reaching out to campus counseling could be helpful."
        };
    } else if (percentage >= 25) {
        result = {
            emoji: "🙂",
            title: "Mild Stress Level",
            score: "Score: " + totalScore + "/40",
            description: "You seem to be managing reasonably well. " +
                "Keep up your healthy habits and continue to prioritize self-care. " +
                "Remember to take breaks and reach out to your support network when needed."
        };
    } else {
        result = {
            emoji: "😄",
            title: "Good Mental Well-being",
            score: "Score: " + totalScore + "/40",
            description: "Great news! Your responses suggest you have good mental health and are coping well. " +
                "Continue maintaining your healthy habits and supporting others around you. " +
                "Your positive outlook is a great asset!"
        };
    }
    
    // Display results
    displayMentalResults(result);
    
    // Save to localStorage
    localStorage.setItem('mentalHealthCheckCompleted', 'true');
    localStorage.setItem('mentalHealthCheckDate', new Date().toISOString());
}

function displayMentalResults(result) {
    // Hide loading, show results
    document.getElementById('mental-loading').classList.remove('visible-section');
    document.getElementById('mental-loading').classList.add('hidden-section');
    document.getElementById('mental-results').classList.remove('hidden-section');
    document.getElementById('mental-results').classList.add('visible-section');
    
    // Set result data
    document.getElementById('result-emoji').textContent = result.emoji;
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-score').textContent = result.score;
    document.getElementById('result-description').textContent = result.description;
    
    showNotification('Your mental health check is complete!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function retakeMentalCheck() {
    initMentalCheck();
}

// ============================================
// NOTIFICATION FUNCTION
// ============================================
function showNotification(message, type) {
    if (!type) type = 'info';
    
    var notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-0';
    
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        notification.classList.add('bg-red-500', 'text-white');
    } else {
        notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translate-y-2';
        setTimeout(function() { notification.remove(); }, 300);
    }, 3000);
}

// ============================================
// VIEW MANAGEMENT
// ============================================
var heroSection = document.getElementById('hero-section');
var interactiveContainer = document.getElementById('interactive-container');

function openMode(mode) {
    if (mode === 'mental') {
        var isCompleted = localStorage.getItem('mentalHealthCheckCompleted');
        if (isCompleted) {
            var lastDate = localStorage.getItem('mentalHealthCheckDate');
            var dateStr = lastDate ? new Date(lastDate).toLocaleDateString() : 'before';
            var proceed = confirm('You already completed a check on ' + dateStr + '. Take again?');
            if (!proceed) return;
        }
        // Initialize mental check
        initMentalCheck();
    }
    
    heroSection.style.display = 'none';
    interactiveContainer.classList.remove('hidden');
    
    // Show page footer, hide main footer
    document.getElementById('main-footer').classList.add('hidden');
    document.getElementById('page-footer').classList.remove('hidden');
    
    var modeElements = document.querySelectorAll('[id^="mode-"]');
    for (var i = 0; i < modeElements.length; i++) {
        modeElements[i].classList.add('hidden');
        modeElements[i].classList.remove('active');
    }

    var targetMode = document.getElementById('mode-' + mode);
    if (targetMode) {
        targetMode.classList.remove('hidden');
        void targetMode.offsetWidth; 
        targetMode.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetView() {
    heroSection.style.display = 'block';
    interactiveContainer.classList.add('hidden');
    
    // Show main footer, hide page footer
    document.getElementById('main-footer').classList.remove('hidden');
    document.getElementById('page-footer').classList.add('hidden');
    
    var modeElements = document.querySelectorAll('[id^="mode-"]');
    for (var i = 0; i < modeElements.length; i++) {
        modeElements[i].classList.add('hidden');
    }
}

function clearSearch() {
    var input = document.querySelector('input[type="text"]');
    if (input) input.value = '';
}

// ============================================
// LOGIN PANEL FUNCTIONS
// ============================================
function openLogin() {
    document.getElementById('loginPanel').style.display = 'flex';
}

function closeLogin() {
    document.getElementById('loginPanel').style.display = 'none';
}

function loginAdmin(event) {
    event.preventDefault();

    var username = document.getElementById('adminUser').value;
    var password = document.getElementById('adminPass').value;
    var msg = document.getElementById('loginMsg');

    if (username === 'admin' && password === '1234') {
        msg.style.color = 'green';
        msg.innerText = 'Login successful!';
        setTimeout(function() {
            closeLogin();
            openAdminDashboard();
        }, 1000);
    } else {
        msg.style.color = 'red';
        msg.innerText = 'Invalid username or password';
    }
}

// ============================================
// ADMIN DASHBOARD FUNCTIONS
// ============================================
function openAdminDashboard() {
    heroSection.style.display = 'none';
    interactiveContainer.classList.remove('hidden');
    
    // Show page footer, hide main footer
    document.getElementById('main-footer').classList.add('hidden');
    document.getElementById('page-footer').classList.remove('hidden');
    
    var modeElements = document.querySelectorAll('[id^="mode-"]');
    for (var i = 0; i < modeElements.length; i++) {
        modeElements[i].classList.add('hidden');
        modeElements[i].classList.remove('active');
    }

    var adminMode = document.getElementById('mode-admin');
    if (adminMode) {
        adminMode.classList.remove('hidden');
        void adminMode.offsetWidth; 
        adminMode.classList.add('active');
    }

    loadAdminStats();
    loadCases();
    
    if (typeof io !== 'undefined') {
        var socket = io();
        
        socket.on('new-case', function(newCase) {
            console.log('New case received:', newCase);
            showNotification('New case received from Google Sheets!', 'success');
            loadCases();
            loadAdminStats();
        });
        
        socket.on('case-updated', function(updatedCase) {
            console.log('Case updated:', updatedCase);
            loadCases();
            loadAdminStats();
        });
        
        socket.on('case-deleted', function(data) {
            console.log('Case deleted:', data);
            loadCases();
            loadAdminStats();
        });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        resetView();
    }
}

async function loadAdminStats() {
    try {
        var response = await fetch('/api/admin/stats');
        var stats = await response.json();
        
        document.getElementById('total-cases').textContent = stats.totalCases;
        document.getElementById('urgent-cases').textContent = stats.urgentCases;
        document.getElementById('resolved-cases').textContent = stats.closedCases;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadCases() {
    try {
        var statusFilter = document.getElementById('status-filter').value;
        var urgencyFilter = document.getElementById('urgency-filter').value;
        
        var url = '/api/admin/cases';
        var params = [];
        if (statusFilter) params.push('status=' + statusFilter);
        if (urgencyFilter) params.push('urgency=' + urgencyFilter);
        if (params.length > 0) url += '?' + params.join('&');
        
        var response = await fetch(url);
        var cases = await response.json();
        renderCases(cases);
    } catch (error) {
        console.error('Error loading cases:', error);
    }
}

function renderCases(cases) {
    var tbody = document.getElementById('cases-table-body');
    tbody.innerHTML = '';
    
    if (cases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-12 text-center text-slate-500">No cases found</td></tr>';
        return;
    }
    
    for (var i = 0; i < cases.length; i++) {
        var caseItem = cases[i];
        var row = tbody.insertRow();
        row.className = 'hover:bg-slate-50 transition-colors';
        
        var dateCell = row.insertCell();
        dateCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-slate-600';
        dateCell.textContent = new Date(caseItem.createdAt).toLocaleDateString();
        
        var studentCell = row.insertCell();
        studentCell.className = 'px-6 py-4 whitespace-nowrap';
        studentCell.innerHTML = '<div class="text-sm font-medium text-slate-900">' + caseItem.studentName + '</div><div class="text-sm text-slate-500">' + caseItem.email + '</div>';
        
        var courseCell = row.insertCell();
        courseCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-slate-600';
        courseCell.textContent = caseItem.course || 'N/A';
        
        var symptomsCell = row.insertCell();
        symptomsCell.className = 'px-6 py-4 text-sm text-slate-600';
        symptomsCell.textContent = (caseItem.symptoms || '').substring(0, 50) + '...';
        
        var urgencyCell = row.insertCell();
        urgencyCell.className = 'px-6 py-4 whitespace-nowrap';
        var urgencyClass = caseItem.urgency === 'URGENT' ? 'bg-red-100 text-red-800' : (caseItem.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800');
        urgencyCell.innerHTML = '<span class="px-2 py-1 text-xs font-semibold rounded-full ' + urgencyClass + '">' + caseItem.urgency + '</span>';
        
        var statusCell = row.insertCell();
        statusCell.className = 'px-6 py-4 whitespace-nowrap';
        var statusClass = caseItem.status === 'resolved' ? 'bg-green-100 text-green-800' : (caseItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800');
        statusCell.innerHTML = '<span class="px-2 py-1 text-xs font-semibold rounded-full ' + statusClass + '">' + caseItem.status + '</span>';
        
        var actionsCell = row.insertCell();
        actionsCell.className = 'px-6 py-4 whitespace-nowrap text-sm';
        actionsCell.innerHTML = '<button onclick="viewCase(\'' + caseItem._id + '\')" class="text-indigo-600 hover:text-indigo-900 mr-3"><i class="fas fa-eye"></i></button>' +
            '<button onclick="updateCaseStatus(\'' + caseItem._id + '\', \'resolved\')" class="text-green-600 hover:text-green-900 mr-3"><i class="fas fa-check"></i></button>' +
            '<button onclick="deleteCase(\'' + caseItem._id + '\')" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>';
    }
}

async function updateCaseStatus(caseId, status) {
    try {
        var response = await fetch('/api/admin/cases/' + caseId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });
        
        if (response.ok) {
            showNotification('Case updated successfully', 'success');
            loadCases();
            loadAdminStats();
        }
    } catch (error) {
        console.error('Error updating case:', error);
        showNotification('Error updating case', 'error');
    }
}

async function deleteCase(caseId) {
    if (!confirm('Are you sure you want to delete this case?')) {
        return;
    }
    
    try {
        var response = await fetch('/api/admin/cases/' + caseId, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Case deleted successfully', 'success');
            loadCases();
            loadAdminStats();
        }
    } catch (error) {
        console.error('Error deleting case:', error);
        showNotification('Error deleting case', 'error');
    }
}

async function viewCase(caseId) {
    try {
        var response = await fetch('/api/admin/cases/' + caseId);
        var caseItem = await response.json();
        
        alert('Case Details:\n\nStudent: ' + caseItem.studentName + '\nEmail: ' + caseItem.email + '\nCourse: ' + (caseItem.course || 'N/A') + '\nSymptoms: ' + caseItem.symptoms + '\nUrgency: ' + caseItem.urgency + '\nStatus: ' + caseItem.status);
    } catch (error) {
        console.error('Error viewing case:', error);
    }
}

// ============================================
// FAQ DATA AND FUNCTIONS
// ============================================
var faqData = [
    { id: 1, question: 'What should I do if I have a fever?', answer: 'Rest, stay hydrated, and take fever-reducing medication if needed. If fever persists for more than 3 days or exceeds 39°C, consult a healthcare provider.', category: 'general' },
    { id: 2, question: 'How much water should I drink daily?', answer: 'Aim for 8-10 glasses (about 2-2.5 liters) of water per day. This may vary based on activity level, climate, and individual needs.', category: 'lifestyle' },
    { id: 3, question: 'What are the side effects of common medications?', answer: 'Common side effects vary by medication but may include drowsiness, nausea, or mild stomach upset. Always read the label and consult a pharmacist or doctor.', category: 'medication' },
    { id: 4, question: 'How do I treat a minor burn?', answer: 'Run cool (not cold) water over the burn for 10-20 minutes. Do not apply ice, butter, or toothpaste. Cover with a sterile bandage and take pain relievers if needed.', category: 'everyday' },
    { id: 5, question: 'When should I see a doctor for a headache?', answer: 'Seek medical attention if headaches are severe, frequent, accompanied by fever, or following a head injury. Persistent headaches warrant a professional evaluation.', category: 'general' },
    { id: 6, question: 'How can I improve my sleep quality?', answer: 'Maintain a consistent sleep schedule, limit screen time before bed, create a dark sleeping environment, and avoid caffeine in the afternoon.', category: 'lifestyle' }
];

var currentCategory = 'all';
var searchTerm = '';

document.addEventListener('DOMContentLoaded', function() {
    var faqContainer = document.getElementById('faq-container');
    if (!faqContainer) return;
    
    renderFAQs();
    
    function renderFAQs() {
        var filtered = faqData;
        
        if (currentCategory !== 'all') {
            filtered = filtered.filter(function(item) { return item.category === currentCategory; });
        }
        
        if (searchTerm) {
            filtered = filtered.filter(function(item) { 
                return item.question.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
                       item.answer.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
            });
        }
        
        var noResults = document.getElementById('no-results');
        
        if (filtered.length === 0) {
            faqContainer.innerHTML = '';
            if (noResults) noResults.classList.remove('hidden');
        } else {
            if (noResults) noResults.classList.add('hidden');
            faqContainer.innerHTML = '';
            
            for (var i = 0; i < filtered.length; i++) {
                var item = filtered[i];
                var faqItem = document.createElement('div');
                faqItem.className = 'border border-slate-200 rounded-xl overflow-hidden';
                faqItem.innerHTML = '<div class="faq-question bg-white p-4 cursor-pointer flex justify-between items-center" onclick="toggleFaq(' + item.id + ')">' +
                    '<span class="font-medium text-slate-800">' + item.question + '</span>' +
                    '<i class="fas fa-chevron-down text-slate-400 transition-transform" id="icon-' + item.id + '"></i></div>' +
                    '<div class="faq-answer bg-slate-50 p-4 hidden" id="answer-' + item.id + '">' +
                    '<p class="text-slate-600">' + item.answer + '</p></div>';
                faqContainer.appendChild(faqItem);
            }
        }
        
        var statsEl = document.getElementById('search-stats');
        if (statsEl) {
            if (searchTerm || currentCategory !== 'all') {
                statsEl.textContent = 'Found ' + filtered.length + ' question' + (filtered.length !== 1 ? 's' : '');
            } else {
                statsEl.textContent = 'Showing all questions';
            }
        }
    }
    
    window.toggleFaq = function(id) {
        var answer = document.getElementById('answer-' + id);
        var icon = document.getElementById('icon-' + id);
        
        if (answer.classList.contains('hidden')) {
            answer.classList.remove('hidden');
            icon.classList.add('rotate-180');
        } else {
            answer.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    };
    
    var categoryCards = document.querySelectorAll('.category-card');
    for (var i = 0; i < categoryCards.length; i++) {
        categoryCards[i].addEventListener('click', function() {
            currentCategory = this.getAttribute('data-category');
            
            var cats = document.querySelectorAll('.category-card');
            for (var j = 0; j < cats.length; j++) {
                cats[j].classList.remove('active', 'bg-amber-500', 'text-white');
                cats[j].classList.add('bg-slate-100', 'text-slate-600');
            }
            
            this.classList.add('active', 'bg-amber-500', 'text-white');
            this.classList.remove('bg-slate-100', 'text-slate-600');
            
            renderFAQs();
        });
    }
    
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.trim();
            
            var clearBtn = document.getElementById('clear-search');
            if (clearBtn) {
                if (searchTerm) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
            }
            
            renderFAQs();
        });
    }
    
    window.clearSearchFaq = function() {
        if (searchInput) {
            searchInput.value = '';
            searchTerm = '';
        }
        var clearBtn = document.getElementById('clear-search');
        if (clearBtn) clearBtn.classList.add('hidden');
        renderFAQs();
    };
    
    // First Aid Data
    var firstAidData = {
        'Emergency Contacts': { title: 'Emergency Contacts', content: '<h3 class="text-lg font-bold mb-2">Important Numbers</h3><ul class="list-disc pl-5 space-y-1"><li><strong>Campus Security:</strong> 911-1111</li><li><strong>University Health Center:</strong> 911-2222</li><li><strong>Local Hospital:</strong> 911-3333</li><li><strong>Poison Control:</strong> 1-800-222-1222</li></ul>' },
        'Wound Care': { title: 'Wound Care', content: '<h3 class="text-lg font-bold mb-2">Cleaning a Minor Wound</h3><ol class="list-decimal pl-5 space-y-1"><li>Wash hands thoroughly</li><li>Apply gentle pressure to stop bleeding</li><li>Rinse with clean water</li><li>Apply antibiotic ointment</li><li>Cover with a bandage</li></ol>' },
        'Burns & Scalds': { title: 'Burns & Scalds', content: '<h3 class="text-lg font-bold mb-2">Immediate Care</h3><ol class="list-decimal pl-5 space-y-1"><li>Cool with running water for 10-20 minutes</li><li>Do NOT apply ice, butter, or toothpaste</li><li>Cover with sterile bandage</li><li>Take pain relievers if needed</li></ol>' },
        'Eye Injuries': { title: 'Eye Injuries', content: '<h3 class="text-lg font-bold mb-2">Handling Minor Irritations</h3><ol class="list-decimal pl-5 space-y-1"><li>Wash hands before touching eye</li><li>Flush with clean water for 15 minutes</li><li>Do NOT rub the eye</li><li>Remove contact lenses</li></ol>' },
        'CPR & AED': { title: 'CPR & AED', content: '<h3 class="text-lg font-bold mb-2">Basic CPR</h3><ol class="list-decimal pl-5 space-y-1"><li>Check responsiveness</li><li>Call 911</li><li>Push hard and fast (100/min)</li><li>Give 2 breaths after 30 compressions</li></ol>' },
        'Choking': { title: 'Choking', content: '<h3 class="text-lg font-bold mb-2">Heimlich Maneuver</h3><ol class="list-decimal pl-5 space-y-1"><li>Stand behind person</li><li>Make fist above navel</li><li>Grasp fist and give quick thrusts</li><li>Repeat until object is expelled</li></ol>' }
    };
    
    window.openFirstAidModal = function(title) {
        var modal = document.getElementById('firstaid-modal');
        var content = document.getElementById('firstaid-modal-content');
        var item = firstAidData[title];
        
        if (item) {
            content.innerHTML = '<h2 class="text-2xl font-bold text-slate-800 mb-4">' + item.title + '</h2>' + item.content;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };
    
    window.closeFirstAidModal = function() {
        var modal = document.getElementById('firstaid-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var modal = document.getElementById('firstaid-modal');
            if (modal && modal.classList.contains('flex')) {
                closeFirstAidModal();
            }
        }
    });
    
    var statusFilter = document.getElementById('status-filter');
    var urgencyFilter = document.getElementById('urgency-filter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadCases);
    }
    if (urgencyFilter) {
        urgencyFilter.addEventListener('change', loadCases);
    }
});

// Global functions
window.openMode = openMode;
window.resetView = resetView;
window.clearSearch = clearSearch;
window.openLogin = openLogin;
window.closeLogin = closeLogin;
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;
window.loadAdminStats = loadAdminStats;
window.loadCases = loadCases;
window.updateCaseStatus = updateCaseStatus;
window.deleteCase = deleteCase;
window.viewCase = viewCase;
