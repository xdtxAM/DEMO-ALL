const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');

function res1(res) {
  console.log(res);
}

function calculate() {
  const currency_one = currencyEl_one.value; // 查看当前选择的货币
  const currency_two = currencyEl_two.value;
  fetch("https://open.exchangerate-api.com/v6/latest") // 获取汇率
    .then(console.log(res))
    // .then(res => {
    //   console.log(res);
    //   return res;
    // })
    .then(res => res.json()) // 转换为json格式
    .then(data => { // 获取数据
      // console.log(data);
      // data.rates[currency_two] 是获取了 currency_two 当前和美元的汇率
      // 比如 currency_two 是人民币，那么 data.rates[currency_two] 人民币相比美元的汇率 7 
      const rate = data.rates[currency_two] / data.rates[currency_one]; // 获取两个之间的比率
      // ${rate} 是把当前汇率这个变量放到这里，使用符号 ${}
      rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
      amountEl_two.value = (amountEl_one.value * (rate)).toFixed(2);
    });
}


// Event Listener
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);

// 交换货币
swap.addEventListener('click', () => { // 创建临时变量交换数据
  // 设置一个临时变量，把「货币一」的值赋值给临时变量
  const temp = currencyEl_one.value;
  // 把「货币二」的值赋值给「货币一」
  currencyEl_one.value = currencyEl_two.value;
  // 把「货币一」的值赋值给「货币二」
  currencyEl_two.value = temp;
  calculate();
});


calculate();