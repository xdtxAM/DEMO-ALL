const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];

// 获取浏览器本地存储，名transactions的数据
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

// 检查本地数据的值是不是存在，不存在的话就赋值为空数组
// 不是Null的话就设置 localStorageTransactions
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 添加交易记录
function addTransaction(e) { // 这里的 e 就是 event，也就是代码中的 submit 事件
  e.preventDefault(); // 阻止默认事件，防止刷新页面

  // 检查两个输入框的值是否 都 为空，trim 去除首尾空格
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = { // 创建一个交易记录对象
      id: generateID(), // 生成随机ID
      text: text.value, // 获取输入框的值
      amount: +amount.value // 获取输入框的值，转换为数字
    };

    // 添加到 transactions 数组中
    transactions.push(transaction);

    // 添加到 DOM 列表中，也就是页面上
    addTransactionDOM(transaction);


    // 更新余额、收入、支出
    updateValues();

    // 更新本地存储
    updateLocalStorage();

    // 清空输入框
    text.value = '';
    amount.value = '';
  }
}

// 生成随机ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// 添加交易记录到 DOM 列表中
function addTransactionDOM(transaction) {
  // 获取交易的符号，+ 或者 -，如果小于 0 就是 -，大于 0 就是 +
  // 问号后是满足条件的情况，冒号后是不满足条件的情况
  const sign = transaction.amount < 0 ? '-' : '+'; // transaction 里面的 amount

  // 创建一个 li 元素，li 元素是列表元素
  const item = document.createElement('li');

  // 根据交易的正负，添加不同的类名。红色和绿色
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  // 插入到 DOM 中，innerHTML 是插入 HTML。这里是插入 li 元素
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs( // Math.abs() 取绝对值
    transaction.amount // 例：吃饭 -20
  )}</span>
  <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  // 将 item 添加到 list 中
  list.appendChild(item);
}

// 更新余额、收入、支出
function updateValues() {

  // 使用 map 遍历 transactions 数组，返回包含每个对象的 amount 属性的新数组
  const amounts = transactions.map(transaction => transaction.amount);
  console.log("全部金额：");
  console.log(amounts);
  // 余额
  // 累加器，acc 是累加器，item 是当前值，0 是初始值
  // 把 amounts 里面的值累加起来，保留两位小数
  const total = amounts.reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // 计算收入
  const income = amounts // [-20, 30, -10, 15]
    .filter(item => item > 0) // 过滤出大于 0 的值
    .reduce((acc, item) => (acc += item), 0) // 累加
    .toFixed(2); // 保留两位小数

  // 计算支出
  // const expense = (
  //   amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
  //   -1
  // ).toFixed(2);
  
  // 计算支出
  const expense = amounts
    .filter(item => item < 0) // 过滤出小于 0 的值
    .reduce((acc, item) => (acc += item), 0) // 累加
    .toFixed(2); // 保留两位小数
  
  // 数据插入到 DOM 中，DOM 就是页面上的元素
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// 删除交易记录
function removeTransaction(id) {
  // 过滤
  // transactions = transactions
  //   .filter(transaction => transaction.id !== id);
  transactions = transactions
    .filter(function(transaction) {return transaction.id !== id});
  console.log("删除后的数组：");
  console.log(transactions);

  updateLocalStorage();

  init();
}

// 更新本地存储
function updateLocalStorage() {
  // 将 transactions 数组转换为字符串，存储到本地存储中
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 初始化应用
function init() {
  list.innerHTML = ''; // 设置 list 是空，每次初始化就清空一次，防止重复添加
  transactions.forEach(addTransactionDOM); // 遍历 transactions 数组
  updateValues(); // 更新余额、收入、支出
}

init(); // 每次运行就初始化一次

form.addEventListener('submit', addTransaction); // 监听提交事件
// 浏览器会给第一个button添加事件
