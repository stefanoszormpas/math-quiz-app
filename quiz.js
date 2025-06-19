let quizData = [];
let currentQuestion = 0;
let correctAnswers = 0;
let userAnswers = [];

async function loadQuiz() {
    const response = await fetch('questions.json');
    quizData = await response.json();
    document.getElementById('question-number').textContent = `${currentQuestion + 1} / ${quizData.length}`;
    loadQuestion();
}

function loadQuestion() {
    resetState();
    const question = quizData[currentQuestion];
    document.getElementById('question-text').innerHTML = question.question;
    MathJax.typeset(); // render LaTeX

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
        localStorage.setItem('results', JSON.stringify(userAnswers));
        localStorage.setItem('score', correctAnswers);
        window.location.href = 'results.html';
    }
});

loadQuiz();

