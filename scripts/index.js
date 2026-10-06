const TOTAL_CARDS = 16;
const TOTAL_PAIRS = TOTAL_CARDS / 2;
const CARD_BACK = 'assets/images/backside.png';
const STORAGE_KEY = 'memory-game-results';

const cards = [];

let hasFlippedCard = false;
let firstCard = null;
let secondCard = null;
let timeoutId = null;
let boardLocked = false;
let countMoves = 0;
let countPairs = 0;

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');

const header = document.createElement('header');
header.classList.add('header', 'container');

const title = document.createElement('h1');
title.textContent = 'Memory game';

const score = document.createElement('div');
score.classList.add('score');

const scoreCounts = document.createElement('div');
scoreCounts.classList.add('score-count');

const scoreMoves = document.createElement('div');
scoreMoves.classList.add('score-moves');
scoreMoves.textContent = `Moves: ${countMoves}`;

const scorePairs = document.createElement('div');
scorePairs.classList.add('score-pairs');
scorePairs.textContent = `Pairs: ${countPairs}`;

const buttons = document.createElement('div');
buttons.classList.add('buttons');

const restartButton = document.createElement('button');
restartButton.classList.add('restart-button');
restartButton.textContent = 'New game';

const leadersButton = document.createElement('button');
leadersButton.classList.add('leaders-button');
leadersButton.textContent = 'Leaders';

const gameWrapper = document.createElement('div');
gameWrapper.classList.add('game-wrapper');

const gameSection = document.createElement('section');
gameSection.classList.add('game-section');

const footer = document.createElement('footer');
footer.classList.add('footer');

const footerSection = document.createElement('div');
footerSection.classList.add('footer-navigation', 'container');

const footerList = document.createElement('ul');
footerList.classList.add('footer-list');

const copyright = document.createElement('li');
copyright.classList.add('footer-item');
copyright.textContent = '© 2026';

const githubItem = document.createElement('li');
githubItem.classList.add('footer-item');

const githubLink = document.createElement('a');
githubLink.classList.add('footer-link');
githubLink.href = 'https://github.com/Dariussssssss';
githubLink.textContent = 'github';

const rssLink = document.createElement('a');
rssLink.classList.add('rss');
rssLink.href = 'https://rs.school/courses/javascript';
rssLink.textContent = 'Rolling Scopes School';

const modal = document.createElement('div');
modal.classList.add('modal');

const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');

gameWrapper.append(gameSection);
score.append(scoreCounts);
scoreCounts.append(scoreMoves, scorePairs);
buttons.append(leadersButton, restartButton);
header.append(title, score, buttons);
githubItem.append(githubLink);
footerList.append(copyright, githubItem);
footerSection.append(footerList, rssLink);
footer.append(footerSection);
modal.append(modalContent);
wrapper.append(header, gameWrapper, footer, modal);

document.body.append(wrapper);

const openModal = () => {
  modal.classList.add('modal-open');
  document.body.classList.add('modal-lock');
};

const closeModal = () => {
  modal.classList.remove('modal-open');
  document.body.classList.remove('modal-lock');
};

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

const getResults = () => {
  const results = localStorage.getItem(STORAGE_KEY);

  return results ? JSON.parse(results) : [];
};

const saveResults = (results) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
};

const getCurrentDate = () => {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const addResult = () => {
  const results = getResults();

  results.push({
    moves: countMoves,
    date: getCurrentDate(),
    timestamp: Date.now(),
  });

  results.sort((a, b) => {
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }

    return a.timestamp - b.timestamp;
  });

  const bestResults = results.slice(0, 10);

  saveResults(bestResults);
};

const showVictoryModal = () => {
  modalContent.replaceChildren();

  const title = document.createElement('h2');
  title.textContent = 'You win!';

  const result = document.createElement('p');
  result.textContent = `You completed the game in ${countMoves} moves.`;

  const buttons = document.createElement('div');
  buttons.classList.add('modal-buttons');

  const newGameButton = document.createElement('button');
  newGameButton.textContent = 'New game';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';

  newGameButton.addEventListener('click', () => {
    closeModal();
    resetGame();
  });

  closeButton.addEventListener('click', closeModal);

  buttons.append(newGameButton, closeButton);
  modalContent.append(title, result, buttons);

  openModal();
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

const showLeadersModal = () => {
  modalContent.replaceChildren();

  const title = document.createElement('h2');
  title.textContent = 'Leaders';

  const results = getResults();

  if (results.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No results yet';

    modalContent.append(title, emptyMessage);
  } else {
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const placeHeader = document.createElement('th');
    placeHeader.textContent = 'Place';

    const movesHeader = document.createElement('th');
    movesHeader.textContent = 'Moves';

    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Date';

    headerRow.append(placeHeader, movesHeader, dateHeader);
    thead.append(headerRow);

    const tbody = document.createElement('tbody');

    results.forEach((result, index) => {
      const row = document.createElement('tr');

      const place = document.createElement('td');
      place.textContent = index + 1;

      const moves = document.createElement('td');
      moves.textContent = result.moves;

      const date = document.createElement('td');
      date.textContent = result.date;

      row.append(place, moves, date);
      tbody.append(row);
    });

    table.append(thead, tbody);

    modalContent.append(title, table);
  }

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', closeModal);

  modalContent.append(closeButton);

  openModal();
};

const renderCards = (dogId) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.dog = dogId;

  const front = document.createElement('img');
  front.src = `assets/images/${dogId}.png`;
  front.alt = 'dog';
  front.classList.add('front');

  const back = document.createElement('img');
  back.src = CARD_BACK;
  back.alt = 'back of a card';
  back.classList.add('back');

  card.append(front, back);
  gameSection.append(card);
  return card;
}

const createCards = () => {
  cards.length = 0;

  for (let i = 1; i <= TOTAL_PAIRS; i++) {
    cards.push(i, i);
  }

  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

const flipCard = (e) => {
  if (boardLocked) return;
  const target = e.currentTarget;
  if (target === firstCard) return;
  target.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = target;
  } else {
    hasFlippedCard = false;
    secondCard = target;
    countMoves += 1;
    scoreMoves.textContent = `Moves: ${countMoves}`;
    checkForMatch();
  }
};

const checkForMatch = () => {
  if (firstCard.dataset.dog === secondCard.dataset.dog) {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    countPairs += 1;
    scorePairs.textContent = `Pairs: ${countPairs}`;
    resetBoard();
    if (countPairs === TOTAL_PAIRS) {
      addResult();
      showVictoryModal();
    }
  } else {
    boardLocked = true;
    timeoutId = setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
      timeoutId = null;
    }, 1500);
  }
};

const resetBoard = () => {
  hasFlippedCard = false;
  boardLocked = false;
  firstCard = null;
  secondCard = null;
};

const resetGame = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  countPairs = countMoves = 0;
  scoreMoves.textContent = `Moves: ${countMoves}`;
  scorePairs.textContent = `Pairs: ${countPairs}`;
  gameSection.replaceChildren();

  hasFlippedCard = false;
  firstCard = null;
  secondCard = null;
  boardLocked = false;

  createCards();

  cards.forEach((dogId) => {
    const card = renderCards(dogId);
    card.addEventListener('click', flipCard);
  });
};

leadersButton.addEventListener('click', showLeadersModal);
restartButton.addEventListener('click', resetGame);
resetGame();
