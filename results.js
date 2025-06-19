let quizData = [];
let currentQuestion = 0;
let correctAnswers = 0;
let userAnswers = [];

let startTime;
let timerInterval;

async function loadQuiz() {
    const response = await fetch('questions.json');
    quizData = await response.json();
    document.getElementById('question-number').textContent = `${currentQuestion + 1} / ${quizData.length}`;
    
    // Ξεκινάμε το timer όταν φορτώσει το quiz
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    loadQuestion();
}

function updateTimer() {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `Χρόνος: ${minutes}:${seconds}`;
}

function loadQuestion() {
    resetState();
    const question = quizData[currentQuestion];
    document.getElementById('question-text').innerHTML = question.question;
    MathJax.typeset();

    question.options.forEach((option, index) => {
        const btn = document.createElement('div');
        btn.classList.add('answer');
        btn.innerHTML = option.text;
        btn.dataset.index = index;
        btn.addEventListener('click', selectAnswer);
        document.getElementById('answers').appendChild(btn);
    });

    document.getElementById('question-number').textContent = `${currentQuestion + 1} / ${quizData.length}`;
    document.getElementById('progress').style.width = `${(currentQuestion) / quizData.length * 100}%`;
    MathJax.typeset();
}

function resetState() {
    document.getElementById('answers').innerHTML = '';
    document.getElementById('next-btn').disabled = true;
}

function selectAnswer(e) {
    const index = e.target.dataset.index;
    const question = quizData[currentQuestion];
    const selectedOption = question.options[index];

    userAnswers.push({ 
        question: question.question, 
        selected: selectedOption.text, 
        correct: selectedOption.correct,
        explanation: selectedOption.explanation 
    });

    if (selectedOption.correct) {
        e.target.classList.add('correct');
        correctAnswers++;
    } else {
        e.target.classList.add('wrong');
    }

    document.querySelectorAll('.answer').forEach(btn => btn.removeEventListener('click', selectAnswer));
    document.getElementById('next-btn').disabled = false;
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
});

function finishQuiz() {
    clearInterval(timerInterval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    localStorage.setItem('results', JSON.stringify(userAnswers));
    localStorage.setItem('score', correctAnswers);
    localStorage.setItem('time', totalTime);
    window.location.href = 'results.html';
}

loadQuiz();
