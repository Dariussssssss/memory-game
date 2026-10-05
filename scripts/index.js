const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let firstCard, secondCard;
let boardLocked = false;

const flipCard = (e) => {
  if (boardLocked) return;
  const target = e.target.parentElement;
  if (target === firstCard) return;
  target.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = target;
  } else {
    hasFlippedCard = false;
    secondCard = target;
    checkForMatch();
  }
};

const checkForMatch = () => {
  if (firstCard.dataset.dog === secondCard.dataset.dog) {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
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
  hasFlippedCard = boardLocked = false;
  firstCard = secondCard = null;
};

cards.forEach((card) => {
  card.addEventListener('click', flipCard);
  const randomIndex = Math.floor(Math.random() * cards.length);
  card.style.order = randomIndex;
});

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
