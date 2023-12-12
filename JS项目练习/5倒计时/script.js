const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const countdown = document.getElementById('countdown');
const year = document.getElementById('year');
const loading = document.getElementById('loading');

// 获取当前年份
const currentYear = new Date().getFullYear();

// 新年时间
const newYearTime = new Date(`January 01 ${currentYear + 1} 00:00:00`);

// 新年的时间「年」2023 + 1 = 2024 
year.innerText = currentYear + 1;

// 更新倒计时
function updateCountdown() {
  // 获取当前时间
  const currentTime = new Date();
  // 获取时间差 = 新年时间 - 当前时间
  const diff = newYearTime - currentTime; // 结果单位是毫秒

  // 计算时间差
  const d = Math.floor(diff / 1000 / 60 / 60 / 24); // 天数
  const h = Math.floor(diff / 1000 / 60 / 60) % 24;
  const m = Math.floor(diff / 1000 / 60) % 60;
  const s = Math.floor(diff / 1000) % 60; // % 是取余数

  // 添加到 DOM 中
  days.innerHTML = d;
  hours.innerHTML = h < 10 ? '0' + h : h; // 如果小时小于 10，就在前面加 0
  minutes.innerHTML = m < 10 ? '0' + m : m; // 如果分钟小于 10，就在前面加 0
  seconds.innerHTML = s < 10 ? '0' + s : s;
}

// 显示加载动画
setTimeout(() => {
  loading.remove(); // 移除加载动画
  // 修改 id 是 countdown 的元素的样式为 flex
  // css 中 display: none; 是隐藏元素
  countdown.style.display = 'flex'; // 显示倒计时
}, 1000); // 1 秒后执行

// 每秒运行一次 updateCountdown 无限循环
setInterval(updateCountdown, 1000);
