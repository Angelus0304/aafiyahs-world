const stage = document.getElementById('stage');
const creature = document.getElementById('creature');
const wordDisplay = document.getElementById('wordDisplay');
const lettersCollectedDisplay = document.getElementById('lettersCollected');
const wordsMadeDisplay = document.getElementById('wordsMade');
const evolutionDisplay = document.getElementById('evolution');
const statusText = document.getElementById('statusText');
const startBtn = document.getElementById('startGame');
const collectBtn = document.getElementById('collectLetter');
const beatPads = Array.from(document.querySelectorAll('.beat-pad'));
const recordBtn = document.getElementById('recordBtn');
const recordDot = document.getElementById('recordDot');

const stages = ['Companion', 'Evolving', 'Smiling Entity'];
let lettersCollected = 0;
let wordsMade = 0;
let currentWord = '';
let isPlaying = false;
let isRecording = false;
let letterInterval = null;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function formatStage() {
  if (wordsMade >= 3) return 'Smiling Entity';
  if (wordsMade >= 1) return 'Evolving';
  return 'Companion';
}

function updateHud() {
  lettersCollectedDisplay.textContent = lettersCollected;
  wordsMadeDisplay.textContent = wordsMade;
  evolutionDisplay.textContent = formatStage();
  wordDisplay.textContent = currentWord || '—';

  if (wordsMade >= 3) {
    creature.classList.add('horror');
    statusText.textContent = 'The Smiling Entity has awakened.';
  } else if (wordsMade >= 1) {
    creature.classList.remove('horror');
    statusText.textContent = 'The companion is evolving.';
  } else {
    creature.classList.remove('horror');
    statusText.textContent = 'Collect letters to grow your companion.';
  }
}

function spawnLetter() {
  const letterEl = document.createElement('button');
  letterEl.type = 'button';
  const letter = randomFrom(alphabet.split(''));
  letterEl.className = 'letter';
  letterEl.textContent = letter;

  const x = 30 + Math.random() * (stage.clientWidth - 80);
  const y = 30 + Math.random() * (stage.clientHeight - 180);
  letterEl.style.left = `${x}px`;
  letterEl.style.top = `${y}px`;

  letterEl.addEventListener('click', () => {
    currentWord += letter;
    lettersCollected += 1;
    letterEl.remove();
    creature.classList.remove('bump');
    void creature.offsetWidth;
    creature.classList.add('bump');

    if (currentWord.length >= 4 || lettersCollected % 5 === 0) {
      wordsMade += 1;
      currentWord = '';
      statusText.textContent = `Word formed! ${formatStage()} stage unlocked.`;
    }

    updateHud();
  });

  stage.appendChild(letterEl);
}

function startGame() {
  if (isPlaying) return;
  isPlaying = true;
  startBtn.textContent = 'Game Running';
  statusText.textContent = 'The blocky companion is exploring the grasslands.';

  updateHud();
  spawnLetter();
  letterInterval = setInterval(() => {
    spawnLetter();
    if (stage.querySelectorAll('.letter').length > 7) {
      const oldest = stage.querySelector('.letter');
      if (oldest) oldest.remove();
    }
  }, 1400);
}

function manualCollect() {
  if (!isPlaying) {
    startGame();
  }

  const currentLetters = stage.querySelectorAll('.letter');
  if (currentLetters.length === 0) {
    spawnLetter();
  }

  const target = currentLetters[Math.floor(Math.random() * currentLetters.length)];
  if (target) {
    target.click();
  }
}

beatPads.forEach((pad) => {
  pad.addEventListener('click', () => {
    pad.classList.toggle('active');
    statusText.textContent = `${pad.dataset.sound} layer added to the beat.`;
  });
});

recordBtn.addEventListener('click', () => {
  isRecording = !isRecording;
  recordBtn.textContent = isRecording ? 'Stop Recording' : 'Record Voice';
  recordDot.classList.toggle('recording-on', isRecording);
  statusText.textContent = isRecording
    ? 'Voice recording is live.'
    : 'Voice recording saved to the beat.';
});

startBtn.addEventListener('click', startGame);
collectBtn.addEventListener('click', manualCollect);

updateHud();
