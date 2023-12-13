const main = document.querySelector('main');
const voicesSelect = document.getElementById('voices');
const textarea = document.getElementById('text');
const readBtn = document.getElementById('read');
const toggleBtn = document.getElementById('toggle');
const closeBtn = document.getElementById('close');

const data = [
  {
    image: './img/drink.jpg',
    text: "I'm Thirsty"
  },
  {
    image: './img/food.jpg',
    text: "I'm Hungry"
  },
  {
    image: './img/tired.jpg',
    text: "I'm Tired"
  },
  {
    image: './img/hurt.jpg',
    text: "I'm Hurt"
  },
  {
    image: './img/happy.jpg',
    text: "I'm Happy"
  },
  {
    image: './img/angry.jpg',
    text: "I'm Angry"
  },
  {
    image: './img/sad.jpg',
    text: "I'm Sad"
  },
  {
    image: './img/scared.jpg',
    text: "I'm Scared"
  },
  {
    image: './img/outside.jpg',
    text: 'I Want To Go Outside'
  },
  {
    image: './img/home.jpg',
    text: 'I Want To Go Home'
  },
  {
    image: './img/school.jpg',
    text: 'I Want To Go To School'
  },
  {
    image: './img/grandma.jpg',
    text: 'I Want To Go To Grandmas'
  }
];

data.forEach(createBox); // 把data里的每一项都传给 createBox 函数


// 创建页面的照片和文字
function createBox(item) {
  const box = document.createElement('div'); // 创建一个div

  const { image, text } = item; // 解构赋值

  box.classList.add('box'); // 给div添加class

  box.innerHTML = `
    <img src="${image}" alt="${text}" />
    <p class="info">${text}</p>
  `; // 给div添加内容

  box.addEventListener('click', () => { // 点击
    setTextMessage(text); // 设置文本
    speakText(); // 朗读

    // 添加active class
    box.classList.add('active');
    setTimeout(() => box.classList.remove('active'), 800); // 800ms后移除active class
  });

  // 把div添加到main里
  main.appendChild(box);
}

// 目的是让语音朗读
const message = new SpeechSynthesisUtterance();

// 
let voices = [];

// 获取所有的语音类型，并添加到 html 的 select 里
function getVoices() {
  voices = speechSynthesis.getVoices(); // 获取语音类型。婷婷的语音，小明的语音
  voices.forEach(voice => { // 遍历所有的
    const option = document.createElement('option'); // 创建一个 html 元素，

    option.value = voice.name; // 设置 option 的值
    option.innerText = `${voice.name} ${voice.lang}`; //  设置 option 的文本 <option value="">1</option>

    voicesSelect.appendChild(option); // 添加到 html 的 select 里
  });
}

// 设置文本
function setTextMessage(text) {
  message.text = text; // 传入的 text 为message的text
}

// 朗读
function speakText() {
  speechSynthesis.speak(message); // 读出来
}

// Set voice
function setVoice(e) {
  message.voice = voices.find(voice => voice.name === e.target.value);
}

// 更换语音
speechSynthesis.addEventListener('voiceschanged', getVoices);

// 添加
toggleBtn.addEventListener('click', () =>
  document.getElementById('text-box').classList.toggle('show')
);

// 关闭
closeBtn.addEventListener('click', () =>
  document.getElementById('text-box').classList.remove('show')
);

// 改变
voicesSelect.addEventListener('change', setVoice);

// 朗读
readBtn.addEventListener('click', () => {
  setTextMessage(textarea.value);
  speakText();
});

getVoices();
