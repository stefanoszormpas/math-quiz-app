// Φόρτωση σκορ
const score = localStorage.getItem('score') || 0;
document.getElementById('score').textContent = score;

// Φόρτωση χρόνου
const time = localStorage.getItem('time');
if (time) {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    document.getElementById('time').textContent = `Χρόνος ολοκλήρωσης: ${minutes}:${seconds}`;
}

// Φόρτωση αποτελεσμάτων
const resultsJSON = localStorage.getItem('results');
let results = [];

try {
  results = resultsJSON ? JSON.parse(resultsJSON) : [];
} catch(e) {
  console.error('Σφάλμα στο parsing των αποτελεσμάτων:', e);
}

const container = document.getElementById('results');
container.innerHTML = '';

results.forEach((item, idx) => {
  const block = document.createElement('div');
  block.classList.add('result-block');

  let answerClass = '';
  if (item.correct === true) {
    answerClass = 'correct-answer';
  } else if (item.correct === false) {
    answerClass = 'wrong-answer';
  }

  block.innerHTML = `
    <h3>Ερώτηση ${idx + 1}</h3>
    <p>${item.question}</p>
    <p><strong>Η απάντησή σου:</strong> <span class="${answerClass}">${item.selected}</span></p>
    <p><strong>Επεξήγηση:</strong> ${item.explanation}</p>
    <hr>
  `;

  container.appendChild(block);
});

// MathJax για τα μαθηματικά
if(window.MathJax) {
    MathJax.typesetPromise().catch(err => console.error(err));
}

// Κουμπί επανάληψης quiz
document.getElementById('retry').addEventListener('click', () => {
    localStorage.removeItem('results');
    localStorage.removeItem('score');
    localStorage.removeItem('time');
    window.location.href = 'index.html';  // ή το αρχείο του quiz
});
