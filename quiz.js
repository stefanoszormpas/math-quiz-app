document.addEventListener('DOMContentLoaded', function() {
    // Μεταβλητές κατάστασης (ΜΟΝΟ ΜΙΑ ΦΟΡΑ)
    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let score = 0;
    let timeLeft = 60;
    let timer;
    let quizCompleted = false;

    // Στοιχεία DOM
    const questionContainer = document.querySelector('.question-container');
    const optionsContainer = document.querySelector('.options-container');
    const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

if (!prevBtn || !nextBtn) {
  console.error('Navigation buttons missing!');
  return;
}
    const submitBtn = document.getElementById('submit-btn');
    const resultsDiv = document.querySelector('.results');
    const timeSpan = document.getElementById('time');

    // 1. Φόρτωση ερωτήσεων από JSON
    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) throw new Error('Πρόβλημα φόρτωσης JSON');
            questions = await response.json();
            userAnswers = new Array(questions.length).fill(null); // Δημιουργία πίνακα απαντήσεων
            shuffleQuestions();
            initQuiz();
        } catch (error) {
            console.error('Σφάλμα:', error);
            questionContainer.innerHTML = `
                <div class="error">
                    <p>Δεν μπόρεσαν να φορτωθούν οι ερωτήσεις.</p>
                    <button onclick="location.reload()">Ανανέωση</button>
                </div>
            `;
        }
    }

    // 2. Ανακάτεμα ερωτήσεων (Fisher-Yates shuffle)
    function shuffleQuestions() {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
    }

    // 3. Αρχικοποίηση quiz
    function initQuiz() {
        showQuestion();
        startTimer();
    }

    // 4. Εμφάνιση ερώτησης
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer.innerHTML = `<div class="math-display">${question.question}</div>`;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.innerHTML = `<div class="math-display">${option}</div>`;
            
            if (userAnswers[currentQuestionIndex] !== null) {
                if (index === question.correctAnswer) {
                    optionElement.classList.add('correct');
                } else if (userAnswers[currentQuestionIndex] === index && index !== question.correctAnswer) {
                    optionElement.classList.add('incorrect');
                }
            }
            
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        updateNavigationButtons();
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }

    // 5. Επιλογή απάντησης
    function selectOption(optionIndex) {
        if (quizCompleted) return;
        
        userAnswers[currentQuestionIndex] = optionIndex;
        const question = questions[currentQuestionIndex];
        
        if (optionIndex === question.correctAnswer) {
            score++;
        }
        
        showQuestion();
    }

    // 6. Ενημέρωση πλοήγησης
    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    // 7. Χρονόμετρο
    function startTimer() {
        timeSpan.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timeSpan.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
    }

    // 8. Τερματισμός
    function endQuiz() {
        quizCompleted = true;
        clearInterval(timer);
        
        // Απενεργοποίηση επιλογών
        document.querySelectorAll('.option').forEach(option => {
            option.style.cursor = 'not-allowed';
        });
        
        // Αποθήκευση και ανακατεύθυνση
        sessionStorage.setItem('quizResults', JSON.stringify({
            score: score,
            totalQuestions: questions.length,
            userAnswers: userAnswers,
            questions: questions
        }));
        window.location.href = 'results.html';
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        }
    });

    submitBtn.addEventListener('click', endQuiz);

    // Εκκίνηση
    loadQuestions();
});
