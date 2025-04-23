let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];

async function loadQuestions() {
  try {
    const res = await fetch('perguntas.json');
    const data = await res.json();
    questions = shuffleArray(data).slice(0, 10); // 10 perguntas aleatórias
    
    // Atualizar o total de perguntas no HTML
    document.getElementById('total-questions').textContent = questions.length;
    
    startQuiz();
  } catch (error) {
    console.error('Erro ao carregar perguntas:', error);
    document.getElementById('question').textContent = 'Erro ao carregar perguntas. Por favor, recarregue a página.';
  }
}

function startQuiz() {
  // Resetar o quiz
  document.getElementById('score-box').classList.add('hidden');
  document.getElementById('question-box').style.display = 'block';
  document.getElementById('question-box').style.opacity = '1';
  document.getElementById('question-box').style.transform = 'translateY(0)';
  document.getElementById('next-btn').disabled = true;
  document.getElementById('current-score').textContent = '0';
  
  // Resetar variáveis
  currentQuestionIndex = 0;
  score = 0;
  selectedQuestions = questions;
  
  // Atualizar progresso
  updateProgress();
  
  // Mostrar primeira pergunta
  showQuestion();
}

// Função para atualizar o progresso
function updateProgress() {
  // Atualizar número da pergunta atual
  document.getElementById('current-question').textContent = currentQuestionIndex + 1;
  
  // Atualizar barra de progresso
  const progressPercentage = ((currentQuestionIndex) / selectedQuestions.length) * 100;
  document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
  
  // Atualizar pontuação atual
  document.getElementById('current-score').textContent = score;
}

function showQuestion() {
  const q = selectedQuestions[currentQuestionIndex];
  
  // Animação de fade para a nova pergunta
  const questionElement = document.getElementById('question');
  questionElement.style.opacity = '0';
  
  setTimeout(() => {
    questionElement.textContent = q.pergunta;
    questionElement.style.opacity = '1';
  }, 300);
  
  const optionsBox = document.getElementById('options');
  optionsBox.innerHTML = '';

  const shuffledOptions = shuffleArray([...q.opcoes]);
  
  // Adicionar as opções com um pequeno delay para criar efeito de cascata
  shuffledOptions.forEach((option, index) => {
    setTimeout(() => {
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(10px)';
      btn.onclick = () => selectAnswer(option, q.resposta_correta);
      optionsBox.appendChild(btn);
      
      // Animar a entrada do botão
      setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      }, 50);
    }, index * 100);
  });

  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').style.opacity = '0';
  document.getElementById('next-btn').disabled = true;
}

function selectAnswer(selected, correct) {
  const feedback = document.getElementById('feedback');
  const buttons = document.querySelectorAll('#options button');
  
  // Desabilitar todos os botões após a seleção
  buttons.forEach(btn => {
    btn.disabled = true;
    
    // Adicionar classes para estilização visual
    if (btn.textContent === selected) {
      if (selected === correct) {
        btn.classList.add('correct-answer');
      } else {
        btn.classList.add('wrong-answer');
      }
    } else if (btn.textContent === correct && selected !== correct) {
      // Destacar a resposta correta quando o usuário errar
      setTimeout(() => {
        btn.classList.add('correct-answer');
      }, 500);
    }
  });

  // Mostrar feedback com animação
  feedback.style.opacity = '0';
  feedback.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    if (selected === correct) {
      feedback.innerHTML = '<i class="fas fa-check-circle"></i> Certo!';
      feedback.style.color = 'var(--correct-color)';
      score += 10;
      
      // Atualizar pontuação com animação
      const currentScoreElement = document.getElementById('current-score');
      currentScoreElement.textContent = score;
      currentScoreElement.classList.add('score-updated');
      setTimeout(() => {
        currentScoreElement.classList.remove('score-updated');
      }, 1000);
      
    } else {
      feedback.innerHTML = `<i class="fas fa-times-circle"></i> Errado! Resposta correta: ${correct}`;
      feedback.style.color = 'var(--wrong-color)';
    }
    
    feedback.style.opacity = '1';
    feedback.style.transform = 'translateY(0)';
  }, 300);
  
  // Habilitar o botão próxima após um pequeno delay
  setTimeout(() => {
    document.getElementById('next-btn').disabled = false;
  }, 800);
}

document.getElementById('next-btn').onclick = () => {
  // Incrementar índice da pergunta
  currentQuestionIndex++;
  
  // Atualizar progresso
  updateProgress();
  
  if (currentQuestionIndex < selectedQuestions.length) {
    showQuestion();
  } else {
    showScore();
  }
  
  // Adicionar animação ao botão
  const nextBtn = document.getElementById('next-btn');
  nextBtn.classList.add('btn-clicked');
  setTimeout(() => {
    nextBtn.classList.remove('btn-clicked');
  }, 200);
};

function showScore() {
  // Animar a saída da caixa de perguntas
  const questionBox = document.getElementById('question-box');
  questionBox.style.opacity = '0';
  questionBox.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    questionBox.innerHTML = '';
    
    // Animar a entrada da caixa de pontuação
    const scoreBox = document.getElementById('score-box');
    scoreBox.classList.remove('hidden');
    scoreBox.style.opacity = '0';
    scoreBox.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      scoreBox.style.opacity = '1';
      scoreBox.style.transform = 'translateY(0)';
      
      // Adicionar animação para a pontuação final
      const finalScore = document.getElementById('final-score');
      finalScore.textContent = `Pontuação final: ${score} pontos!`;
      
      // Adicionar mensagem baseada na pontuação
      const maxScore = selectedQuestions.length * 10;
      let message = '';
      
      if (score === maxScore) {
        message = 'Parabéns! Você é um especialista em Faro!';
      } else if (score >= maxScore * 0.7) {
        message = 'Muito bom! Você conhece bem a história de Faro!';
      } else if (score >= maxScore * 0.5) {
        message = 'Bom trabalho! Você tem um bom conhecimento sobre Faro.';
      } else {
        message = 'Continue aprendendo sobre a rica história de Faro!';
      }
      
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageElement.style.marginTop = '15px';
      messageElement.style.fontStyle = 'italic';
      messageElement.style.color = 'var(--secondary-color)';
      
      finalScore.insertAdjacentElement('afterend', messageElement);
    }, 100);
  }, 300);
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

loadQuestions();
