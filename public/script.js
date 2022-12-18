// Get div handlers
const switchButton = document.getElementById('switch');
const add = document.getElementById('add');
const subtract = document.getElementById('subtract');
const total = document.getElementById('total');

// Add button logic
const increase = () => {
  total.innerText = Number(total.innerText) + 1;
};

const decrease = () => {
  total.innerText = Number(total.innerText) - 1;
};

const getRandomColor = () => {
  return Math.floor(Math.random() * 16777215).toString(16);
};

const switchBackgroundColor = () => {
  document.body.style.backgroundColor = `#${getRandomColor()}`;
};

// Add listeners
add.addEventListener('click', increase);
subtract.addEventListener('click', decrease);
switchButton.addEventListener('click', switchBackgroundColor);
window.addEventListener('load', switchBackgroundColor);
