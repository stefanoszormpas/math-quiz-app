const score = localStorage.getItem('score');
document.getElementById('score').textContent = score;

const results = JSON.parse(localStorage.getItem('results'));
const container = document.getElementById('results');

results.forEach((item, idx) => {
    const block = document.createElement('div');
    block.classList.add('result-block');
    block.innerHTML = `
        <h3>Ερώτηση ${idx + 1}</h3>
        <p>${item.question}</p>
        <p><strong>Η απάντησή σου:</strong> ${item.selected}</p>
        <p><strong>Επεξήγηση:</strong> ${item.explanation}</p>
        <hr>
    `;
    container.appendChild(block);
    MathJax.typeset();
});
