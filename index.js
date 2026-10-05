const TOTAL_CARDS = 16;
const TOTAL_PAIRS = TOTAL_CARDS / 2;
const CARD_BACK = 'assets/images/backside.png';

const cards = [];

let hasFlippedCard = false;
let firstCard, secondCard;
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

const restartButton = document.createElement('button');
restartButton.classList.add('restart-button');
restartButton.textContent = 'Restart';

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
copyright.textContent = '© 2022-2026';

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


gameWrapper.append(gameSection);
score.append(scoreCounts);
scoreCounts.append(scoreMoves, scorePairs);
header.append(title, score, restartButton);
githubItem.append(githubLink);
footerList.append(copyright, githubItem);
footerSection.append(footerList, rssLink);
footer.append(footerSection);
wrapper.append(header, gameWrapper, footer);


document.body.append(wrapper);

const renderCards = (dogId) => {
  console.log(dogId);
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
    cards.push(i, i)
  }

  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

console.log(cards);
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
  } else {
    boardLocked = true;
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
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

restartButton.addEventListener('click', resetGame);
resetGame();
// const popupCloseIcon = document.querySelectorAll('.close-popup');
// if (popupCloseIcon.length > 0) {
//   for (let index = 0; index < popupCloseIcon.length; index++) {
//     const el = popupCloseIcon[index];
//     el.addEventListener('click', function (e) {
//       popupClose(el.closest('.popup'));
//       e.preventDefault();
//     })
//   }
// }
