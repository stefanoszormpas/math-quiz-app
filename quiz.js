document.addEventListener('DOMContentLoaded', function() {
    // Οι ερωτήσεις του quiz
    let questions = []; // Άδειος πίνακας που θα γεμίσει με fetch

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) {
      throw new Error('Το JSON δεν φορτώθηκε σωστά');
    }
    questions = await response.json();
    initQuiz(); // Ξεκινά το quiz μόλις φορτωθούν οι ερωτήσεις
  } catch (error) {
    console.error('Σφάλμα φόρτωσης:', error);
    // Εμφάνιση μηνύματος λάθους στον χρήστη
    document.querySelector('.question-container').innerHTML = `
      <div class="error">
        <p>Δεν μπόρεσαν να φορτωθούν οι ερωτήσεις. Παρακαλώ δοκιμάστε ξανά.</p>
        <button onclick="location.reload()">Ανανέωση</button>
      </div>
    `;
  }
}

// Καλέστε αυτή τη συνάρτηση αντί του initQuiz() όταν φορτώνεται η σελίδα
loadQuestions();

    // Μεταβλητές κατάστασης
    let currentQuestionIndex = 0;
    let userAnswers = new Array(questions.length).fill(null);
    let score = 0;
    let timeLeft = 60;
    let timer;
    let quizCompleted = false;

    // Στοιχεία DOM
    const questionContainer = document.querySelector('.question-container');
    const optionsContainer = document.querySelector('.options-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const resultsDiv = document.querySelector('.results');
    const timeSpan = document.getElementById('time');

    // Αρχικοποίηση quiz
    function initQuiz() {
        shuffleQuestions();
        showQuestion();
        startTimer();
    }

    // Ανακάτεμα ερωτήσεων
    function shuffleQuestions() {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
    }

    // Εμφάνιση ερώτησης
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
        renderMath();
    }

    // Επιλογή απάντησης
    function selectOption(optionIndex) {
        if (quizCompleted) return;
        
        userAnswers[currentQuestionIndex] = optionIndex;
        
        const question = questions[currentQuestionIndex];
        if (optionIndex === question.correctAnswer) {
            score++;
        }
        
        showQuestion();
    }

    // Ενημέρωση κουμπιών navigation
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

    // Χρονόμετρο
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

    // Τερματισμός quiz
    function endQuiz() {
        quizCompleted = true;
        clearInterval(timer);
        
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.cursor = 'not-allowed';
        });
        
        showResults();
    }

    // Εμφάνιση αποτελεσμάτων
   function showResults() {
    const resultsData = {
        score: score,
        totalQuestions: questions.length,
        userAnswers: userAnswers,
        questions: questions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
        }))
    };

    // Αποθήκευση στο sessionStorage
    sessionStorage.setItem('quizResults', JSON.stringify(resultsData));
    
    // Ανακατεύθυνση στη σελίδα αποτελεσμάτων
    window.location.href = 'results.html';
}

    // Επανεκκίνηση quiz
    function restartQuiz() {
        currentQuestionIndex = 0;
        userAnswers = new Array(questions.length).fill(null);
        score = 0;
        timeLeft = 60;
        quizCompleted = false;
        
        resultsDiv.style.display = 'none';
        shuffleQuestions();
        showQuestion();
        clearInterval(timer);
        startTimer();
    }

    // Εκ νέου απόδοση μαθηματικών τύπων
    function renderMath() {
        if (window.MathJax) {
            MathJax.typesetPromise().catch(err => {
                console.error('MathJax typesetting error:', err);
                // Επανάληψη αν αποτύχει η πρώτη προσπάθεια
                setTimeout(renderMath, 500);
            });
        }
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

    // Αρχικοποίηση quiz
    initQuiz();
});
