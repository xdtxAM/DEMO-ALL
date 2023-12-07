(function(){
  const electron = require('electron')
  const { ipcRenderer } = electron
  console.log(process)

  const tabManage = document.querySelectorAll('.tab-manage')
  const contentManage = document.querySelectorAll('.content-manage')
  const taskTodo = document.querySelector('.task-todo') // 选择类名是 task-todo 的元素
  const taskFinished = document.querySelector('.task-finished')
  const keepTimesDom = document.querySelector('.keep-times')
  const closeDom = document.querySelector('.close')
  const date = new Date(), nowTime = date.getTime()

  // localStorage 获取数据
  let loginTime = localStorage.getItem('loginTime')
  let tasksTodo = localStorage.getItem('tasksTodo') 
  let tasksFinished = localStorage.getItem('tasksFinished')
  let keepTimes = localStorage.getItem('keepTimes')

  tasksTodo = tasksTodo ? JSON.parse(tasksTodo) : []
  tasksFinished = tasksFinished ? JSON.parse(tasksFinished) : []
  keepTimes = keepTimes ? keepTimes : 0 // 完成次数

  // 判断上次登录时间，如果是今天，则任务，否则清空
  // 这一块可能是为了处理，如果有昨天残留的任务，那么就需要提醒
  if(!loginTime){
    loginTime = nowTime
  }else{
    const loginD = new Date(loginTime).getTime()
    if(date.getDate() !== loginD.getDate() || nowTime - loginTime >= 24 * 3600 * 1000) {
      tasksFinished  = []
      tasksTodo = []
      localStorage.setItem('tasksFinished', JSON.stringify(tasksFinished))
      localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo))
    }
  }

  // 初始化
  document.querySelector('.date').innerText = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}` // 日期插入到 html 中
  genTodo() // 从 localStorage 中获取数据，生成待办任务列表
  genFinished() // 同时生成已完成任务列表
  // 如果不生成上面两个，数据就无法从 localStorage 中获取，也就无法显示在页面上

  tabManage.forEach((el,index) => { // 给 tab-manage1 3 个，每一个都添加点击动作
    // html 里面的元素，需要指定惦记的动作是什么？
    // 这里点击的动作就是 activeTab 函数和 activeContent 函数
    el.addEventListener('click', () => {
      activeTab (index) // 点击的是第几个，就执行第几个
      // 例如，你点击页面上的 「待办事项」，就会执行 activeTab(0)，给第一个标签加上 nav-active 类名，绿色背景
      // 傻狗明白了吗？
      activeContent (index)
    })
  })

  taskTodo.addEventListener('click', (event) => { // 给 html 里面的 task-todo 列表添加点击监听
    // 这段程序主要处理，用户点击了「完成」或者「删除」按钮
    const target = event.target // 获取点击的元素
    const index = target.getAttribute("data-index") // 获取点击元素的 data-index 属性
    if(target.classList.contains('finish')){ // 如果点击的是「完成」按钮
      keepTimes = +keepTimes + 1 // 完成次数加 1
      tasksFinished.push(tasksTodo[index]) // 将完成的任务添加到 tasksFinished 数组中
      tasksTodo.splice(index,1) // 删除 tasksTodo 数组中的第 index 个元素
      localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo)) // 将 tasksTodo 数组转换成JSON，存储到 localStorage 中
      localStorage.setItem('tasksFinished', JSON.stringify(tasksFinished)) // 将 tasksFinished 数组转换成JSON，存储到 localStorage 中
      localStorage.setItem('keepTimes', keepTimes) // 将 keepTimes 存储到 localStorage 中
      genFinished () // 生成已完成任务列表
      genTodo () // 生成待办任务列表，使用循环
      activeTab (1) // 给第二个标签加上 nav-active 类名，绿色背景
      activeContent (1) // 渲染出内容，就是那个 block
    }
    else if(target.classList.contains('delete')){ //「删除」按钮
      tasksTodo.splice(index,1) // 删除 tasksTodo 数组中的第 index 个元素
      localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo)) // 将 tasksTodo 数组转换成JSON，存储到 localStorage 中
      activeTab (0) // 给第一个标签加上 nav-active 类名，绿色背景
      activeContent (0) // 渲染出内容，就是那个 block
      genTodo () // 生成待办任务列表，使用循环
    }
  })

  closeDom.addEventListener('click', () => { // 设置关闭按钮的功能
    // closeDom 是 close 类名，在 html 里面有一个 X
    ipcRenderer.send('mainWindow:close')
  })

  // 新建任务，在「新建里面」
  const taskName = document.querySelector('#taskName')
  const taskTime = document.querySelector('#taskTime')
  document.querySelector('.submit-task').addEventListener('click',()=>{ // 给类名是 submit-task 的元素添加一个点击监听
    const name = taskName.value, time = taskTime.value // 获取输入框的值
    tasksTodo.push({ // 将输入框的值添加到 tasksTodo 数组中
      name: name,
      time: time
    })
    localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo)) // 将 tasksTodo 数组转换成JSON，存储到 localStorage 中
    if(!!time) ipcRenderer.send('setTaskTimer', time, encodeURIComponent(name)) // 如果输入框有值，就发送一个 setTaskTimer 事件，将时间和任务名称传递过去
    genTodo () // 生成待办任务列表，使用循环
    activeTab (0) // 给第一个标签加上 nav-active 类名，绿色背景
    activeContent (0)
  })

  
  function genTodo () { // 生成待办任务列表
    let todoHtml = ''
    tasksTodo.forEach((item,index) => { // 遍历 tasksTodo 数组，生成待办任务列表
      todoHtml +=
      `<li class="task-item">
        <span class="task-text">${item.name}&nbsp;&nbsp;&nbsp; ${item.time} </span>
        <span>
          <span class="btns finish enable-click" data-index="${index}">完成</span>
          <span class="btns delete enable-click" data-index="${index}">删除</span>
        </span>
      </li>`
    })
    taskTodo.innerHTML = todoHtml // 将 todoHtml 的内容填充到 html 的 task-todo 元素中
  }

  function genFinished () { // 遍历 tasksFinished 数组，生成已完成任务列表
    let finishHtml = ''
    tasksFinished.forEach((item) => {
      finishHtml += 
      `<li class="task-item">
        <span class="task-text">${item.name}</span>
        <span class="flag-icon"></span>
      </li>`
    })
    taskFinished.innerHTML = finishHtml // 插入
    keepTimesDom.innerHTML = keepTimes // 
  }

  function activeTab (index) { // 激活标签的颜色 绿色背景，先移除其他的，再给当前点击的元素添加
    tabManage.forEach((tabEl) => { // tabManage 在 html 里面有 3 个
      // 移除的作用是不让其他按钮的变成绿色背景
      // 函数遍历 tabManage 中的所有选项卡元素 
      tabEl.classList.remove('nav-active') // 移除元素的 nav-active 类名
    })
    tabManage[index].classList.add('nav-active') // 给 0 号元素添加 nav-active 类名
  }

  function activeContent (index) {
    // 当新建任务完成后，显示的是「待办事项」，本质上代替了点击「待办事项」标签的操作
    contentManage.forEach((taskEl) => {
      taskEl.classList.remove('content-active')
    })
    contentManage[index].classList.add('content-active') // 给 0 号元素添加 content-active 类名
    taskName.value = ''
    taskTime.value = ''
  }

})();