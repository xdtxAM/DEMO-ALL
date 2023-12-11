
// 错误写法
function calculate() {
    fetch("https://open.exchangerate-api.com/v6/latest")
    .then(console.log(res));
}

// 正确写法
function daYin(res) {
    console.log(res);
}

function calculate() {
    fetch("https://open.exchangerate-api.com/v6/latest")
    .then(daYin);
}

// 箭头函数写法
const daYin = res => {
    console.log(res);
};

function calculate() {
    fetch("https://open.exchangerate-api.com/v6/latest")
        .then(daYin);
}

// 更简洁的箭头函数写法
function calculate() {
    fetch("https://open.exchangerate-api.com/v6/latest")
        .then(res => {console.log(res);})
}

function calculate() {
    fetch("https://open.exchangerate-api.com/v6/latest")
    .then(res => {
        console.log(res)
    });
}