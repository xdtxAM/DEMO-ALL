const cardsContainer = document.getElementById('cards-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const currentEl = document.getElementById('current');
const showBtn = document.getElementById('show');
const hideBtn = document.getElementById('hide');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const addCardBtn = document.getElementById('add-card');
const clearBtn = document.getElementById('clear');
const addContainer = document.getElementById('add-container');

// 让卡片的索引从 0 开始
let currentActiveCard = 0;

// 创建一个数组，用来存储所有的卡片
const cardsEl = [];

// 创建一个数组，用来存储所有的卡片数据
const cardsData = getCardsData();

// 设置 cardsData 的值
// const cardsData = [
//   {
//     question: 'What must a variable begin with?',
//     answer: 'A letter, $ or _'
//   },
//   {
//     question: 'What is a variable?',
//     answer: 'Container for a piece of data'
//   },
//   {
//     question: 'Example of Case Sensitive Variable',
//     answer: 'thisIsAVariable'
//   }
// ];

// 创建所有卡片
function createCards() {
  cardsData.forEach((data, index) => createCard(data, index));// data 是数组中的每一个元素{}，index 是每一个元素的索引
  // cardsData.forEach((data, index) => {createCard(data, index); console.log(data, index)});
}

// 创建单个卡片并渲染到 DOM 中
function createCard(data, index) {
  // 创建一个新的 div 元素，添加上 card 类名
  const card = document.createElement('div');
  // 添加类名
  card.classList.add('card'); // 为什么添加 card 类名
  // 添加 card 类名之后，就会把下面的内容也放到 html 的 card 的类中

  // 如果是第一张卡片，添加 active 类名
  if (index === 0) {
    card.classList.add('active');
  }

  // 添加 innerHTML
  card.innerHTML = `
  <div class="inner-card">
    <div class="inner-card-front">
      <p>
        ${data.question}
      </p>
    </div>
    <div class="inner-card-back">
      <p>
        ${data.answer}
      </p>
    </div>
  </div>
  `;
  // 添加点击事件，点击卡片显示答案，再次点击隐藏答案
  card.addEventListener('click', () => card.classList.toggle('show-answer'));

  // 将卡片添加到 cardsEl 数组中
  cardsEl.push(card);

  // 将卡片添加到 DOM 中
  cardsContainer.appendChild(card); // 把上面创建的 card 元素添加到 html 的 cards-container 中

  // 更新当前卡片的索引
  updateCurrentText();
}

// 更新当前卡片的索引
function updateCurrentText() {
  // 当前卡片的索引 + 1 / 卡片的总数
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
  // console.log(currentEl.innerText);
}

// 获取卡片数据
function getCardsData() {
  // 从 local storage 中获取卡片数据，转换为 JSON 格式
  const cards = JSON.parse(localStorage.getItem('cards'));
  // 如果卡片数据为 null，返回一个空数组
  return cards === null ? [] : cards;
}

// 添加卡片数据
function setCardsData(cards) {
  localStorage.setItem('cards', JSON.stringify(cards));
  window.location.reload();
}

// 创建卡片，渲染到 DOM 中
createCards();

// 事件监听

// 下一个按钮
nextBtn.addEventListener('click', () => {
  // 将当前卡片的类名设置为 card left
  cardsEl[currentActiveCard].className = 'card left';
  // 当前卡片的索引 + 1
  currentActiveCard = currentActiveCard + 1;

  // 如果当前卡片的索引大于卡片的总数 - 1，将当前卡片的索引设置为卡片的总数 - 1
  if (currentActiveCard > cardsEl.length - 1) {
    currentActiveCard = cardsEl.length - 1;
    // console.log(currentActiveCard);
  }
  // 将当前卡片的类名设置为 card active
  cardsEl[currentActiveCard].className = 'card active';
  // 更新当前卡片的索引
  updateCurrentText();
});

// 上一个按钮
prevBtn.addEventListener('click', () => {
  // 将当前卡片的类名设置为 card right
  cardsEl[currentActiveCard].className = 'card right';
  // 当前卡片的索引 - 1
  currentActiveCard = currentActiveCard - 1;
  // 如果当前卡片的索引小于 0，将当前卡片的索引设置为 0
  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }
  // 将当前卡片的类名设置为 card active
  cardsEl[currentActiveCard].className = 'card active';
  // 更新当前卡片的索引
  updateCurrentText();
});

// 显示
showBtn.addEventListener('click', () => addContainer.classList.add('show'));
// 隐藏
hideBtn.addEventListener('click', () => addContainer.classList.remove('show'));

// 添加新卡片
addCardBtn.addEventListener('click', () => {
  // 问题和答案的 value
  const question = questionEl.value;
  const answer = answerEl.value;

  // 如果问题和答案都不为空
  if (question.trim() && answer.trim()) {
    // 创建一个对象，包含问题和答案
    const newCard = { question, answer };

    // 创建一个卡片并渲染到 DOM 中
    createCard(newCard);

    // 清空输入框
    questionEl.value = '';
    answerEl.value = '';

    // 隐藏 add container
    addContainer.classList.remove('show');

    // 将新卡片添加到 cardsData 数组中
    cardsData.push(newCard);

    // 将 cardsData 数组中的数据保存到 local storage 中
    setCardsData(cardsData);
  }
});

// 清理所有卡片
clearBtn.addEventListener('click', () => {
  localStorage.clear(); // 清除 local storage 中的数据
  cardsContainer.innerHTML = ''; // 清除 DOM 中的数据
  window.location.reload(); // 重新加载页面
});