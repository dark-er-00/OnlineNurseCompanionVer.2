// Initialize Lucide icons
lucide.createIcons();

// ============================================
// MENTAL HEALTH CHECK - NEW VERSION
// ============================================
var selectedMood = 0;
var selectedSleep = 0;

function selectMood(value) {
    selectedMood = value;
    document.getElementById('selected-mood').value = value;
    
    var buttons = document.querySelectorAll('.mood-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected', 'border-violet-500', 'bg-violet-50');
    }
    document.querySelector('.mood-btn.mood-' + value).classList.add('selected', 'border-violet-500', 'bg-violet-50');
}

function selectSleep(value) {
    selectedSleep = value;
    document.getElementById('selected-sleep').value = value;
    
    var buttons = document.querySelectorAll('.sleep-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected', 'border-violet-500', 'bg-violet-50');
    }
    document.querySelector('.sleep-btn.sleep-' + value).classList.add('selected', 'border-violet-500', 'bg-violet-50');
}

// Initialize stress slider
document.addEventListener('DOMContentLoaded', function() {
    var stressSlider = document.getElementById('stress-slider');
    if (stressSlider) {
        stressSlider.addEventListener('input', function() {
            document.getElementById('stress-value').textContent = this.value;
        });
    }
});

async function submitMentalHealthCheck() {
    if (selectedMood === 0) {
        showNotification('Please select your mood', 'error');
        return;
    }
    
    if (selectedSleep === 0) {
        showNotification('Please select your sleep quality', 'error');
        return;
    }
    
    var stressLevel = document.getElementById('stress-slider').value;
    var notes = document.getElementById('mental-notes').value;
    
    document.getElementById('mood-section').classList.remove('visible-section');
    document.getElementById('mood-section').classList.add('hidden-section');
    document.getElementById('mental-loading-section').classList.remove('hidden-section');
    document.getElementById('mental-loading-section').classList.add('visible-section');
    
    try {
        var result = await getMentalHealthAnalysis(selectedMood, stressLevel, selectedSleep, notes);
        displayMentalHealthResult(result, selectedMood);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
        document.getElementById('mood-section').classList.remove('hidden-section');
        document.getElementById('mood-section').classList.add('visible-section');
        document.getElementById('mental-loading-section').classList.remove('visible-section');
        document.getElementById('mental-loading-section').classList.add('hidden-section');
    }
}

async function getMentalHealthAnalysis(mood, stress, sleep, notes) {
    var moodLabels = ['', 'Very Low', 'Low', 'Neutral', 'Good', 'Great'];
    var sleepLabels = ['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];
    
    var prompt = 'You are a compassionate mental health wellness assistant for university students. ' +
        'USER MOOD: ' + moodLabels[mood] + ' (1=Very Low, 5=Great). ' +
        'STRESS LEVEL: ' + stress + '/10. ' +
        'SLEEP QUALITY: ' + sleepLabels[sleep] + '. ' +
        'ADDITIONAL NOTES: ' + (notes || 'None') + '. ' +
        'Provide a supportive wellness summary with: 1) A title, 2) A short paragraph, 3) What this means (3 bullet points), 4) Gentle suggestions (2 bullet points), 5) One encouragement sentence. Keep it simple, no emojis, no clinical language.';
    
    var response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
    });

    if (!response.ok) {
        throw new Error('API Error: ' + response.status);
    }

    var data = await response.json();
    return data.choices[0].message.content;
}

function displayMentalHealthResult(aiText, mood) {
    var loadingSection = document.getElementById('mental-loading-section');
    var resultsSection = document.getElementById('mental-results-section');
    var resultContent = document.getElementById('mental-result-content');
    var resultEmoji = document.getElementById('result-emoji');
    
    loadingSection.classList.remove('visible-section');
    loadingSection.classList.add('hidden-section');
    resultsSection.classList.remove('hidden-section');
    resultsSection.classList.add('visible-section');
    
    var emojis = ['', '😢', '😔', '😐', '🙂', '😄'];
    resultEmoji.textContent = emojis[mood];
    
    // Simple text formatting
    var lines = aiText.split('\n');
    var formattedHtml = '';
    var inList = false;
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') {
            if (inList) {
                formattedHtml += '</ul>';
                inList = false;
            }
            formattedHtml += '<br>';
            continue;
        }
        
        if (line.indexOf('What this means:') !== -1) {
            if (inList) { formattedHtml += '</ul>'; inList = false; }
            formattedHtml += '<h3 class="text-lg font-bold mt-4 mb-2">' + line + '</h3>';
        } else if (line.indexOf('Gentle suggestions:') !== -1) {
            if (inList) { formattedHtml += '</ul>'; inList = false; }
            formattedHtml += '<h3 class="text-lg font-bold mt-4 mb-2">' + line + '</h3>';
        } else if (line.indexOf('- ') === 0) {
            if (!inList) {
                formattedHtml += '<ul class="list-disc pl-5 space-y-1">';
                inList = true;
            }
            formattedHtml += '<li>' + line.substring(2) + '</li>';
        } else if (i === 0) {
            formattedHtml += '<h2 class="text-2xl font-bold mb-4">' + line + '</h2>';
        } else if (!inList) {
            formattedHtml += '<p class="mb-2">' + line + '</p>';
        }
    }
    
    if (inList) {
        formattedHtml += '</ul>';
    }
    
    resultContent.innerHTML = formattedHtml;
    
    localStorage.setItem('mentalHealthCheckCompleted', 'true');
    localStorage.setItem('mentalHealthCheckDate', new Date().toISOString());
    
    showNotification('Your wellness check is complete!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function retakeMentalCheck() {
    selectedMood = 0;
    selectedSleep = 0;
    document.getElementById('selected-mood').value = '0';
    document.getElementById('selected-sleep').value = '0';
    document.getElementById('stress-slider').value = '5';
    document.getElementById('stress-value').textContent = '5';
    document.getElementById('mental-notes').value = '';
    
    var buttons = document.querySelectorAll('.mood-btn, .sleep-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected', 'border-violet-500', 'bg-violet-50');
    }
    
    document.getElementById('mental-results-section').classList.remove('visible-section');
    document.getElementById('mental-results-section').classList.add('hidden-section');
    document.getElementById('mood-section').classList.remove('hidden-section');
    document.getElementById('mood-section').classList.add('visible-section');
}

function downloadMentalReport() {
    var content = document.getElementById('mental-result-content').innerText;
    var blob = new Blob([content], { type: 'text/plain' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'wellness-report.txt';
    a.click();
    window.URL.revokeObjectURL(url);
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
    }
    
    heroSection.style.display = 'none';
    interactiveContainer.classList.remove('hidden');
    
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
    
    // Category click handlers
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
    
    // Filter event listeners
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
