document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const highScoreDisplay = document.getElementById('high-score');
    const currentLevelDisplay = document.getElementById('current-level-display');
    const missMessage = document.getElementById('miss-message');
    const powerupMessage = document.getElementById('powerup-message');
    const levelupMessage = document.getElementById('levelup-message');
  
    let score = 0;
    let timeLeft = 30;
    let level = 1;
    let powerUpActive = false;
  
    // Load high score
    let highScore = localStorage.getItem('highScore') || 0;
    highScoreDisplay.textContent = highScore;
  
    // Load sound effects
    const quackSound = new Audio('quack.mp3');
    const shootSound = new Audio('shoot.mp3');
  
    // Timer logic
    function updateTimer() {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
  
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
  
        // Update high score
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
          highScoreDisplay.textContent = highScore;
        }
  
        alert(`Game Over! Your score: ${score}`);
        location.reload();
      }
    }
  
    const timerInterval = setInterval(updateTimer, 1000);
  
    // Create ducks
    function createDuck() {
      const duck = document.createElement('div');
      duck.classList.add('duck');
      duck.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
  
      quackSound.currentTime = 0;
      quackSound.play();
  
      gameArea.appendChild(duck);
  
      const duckStayTime = Math.max(500, 2000 - level * 300);
      setTimeout(() => {
        if (duck.parentElement) {
          duck.remove();
          score--;
          scoreDisplay.textContent = score;
  
          missMessage.classList.remove('hidden');
          missMessage.classList.add('visible');
  
          setTimeout(() => {
            missMessage.classList.remove('visible');
            missMessage.classList.add('hidden');
          }, 1000);
        }
      }, duckStayTime);
    }
  
    let duckInterval = setInterval(createDuck, 1000);
  
    setInterval(() => {
      clearInterval(duckInterval);
      const spawnRate = Math.max(400, 1000 - level * 100);
      duckInterval = setInterval(createDuck, spawnRate);
    }, 1000);
  
    // Handle clicks
    gameArea.addEventListener('click', (event) => {
      if (event.target.classList.contains('duck')) {
        score++;
        if (powerUpActive) score++;
        scoreDisplay.textContent = score;
        event.target.remove();
  
        shootSound.currentTime = 0;
        shootSound.play();
  
        if (score >= level * 10) {
          level++;
          currentLevelDisplay.textContent = level;
  
          levelupMessage.classList.remove('hidden');
          levelupMessage.classList.add('visible');
  
          setTimeout(() => {
            levelupMessage.classList.remove('visible');
            levelupMessage.classList.add('hidden');
          }, 2000);
        }
      } else if (event.target.classList.contains('powerup')) {
        activatePowerUp();
        event.target.remove();
      }
    });
  
    // Power-ups
    function createPowerUp() {
      const powerUp = document.createElement('div');
      powerUp.classList.add('powerup');
      powerUp.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
      powerUp.style.bottom = '0';
      gameArea.appendChild(powerUp);
  
      setTimeout(() => {
        if (powerUp.parentElement) {
          powerUp.remove();
        }
      }, 3000);
    }
  
    function activatePowerUp() {
      powerUpActive = true;
      powerupMessage.classList.remove('hidden');
      powerupMessage.classList.add('visible');
  
      setTimeout(() => {
        powerUpActive = false;
        powerupMessage.classList.remove('visible');
        powerupMessage.classList.add('hidden');
      }, 10000);
    }
  
    setInterval(() => {
      if (Math.random() < 0.1) {
        createPowerUp();
      }
    }, 5000);
  });