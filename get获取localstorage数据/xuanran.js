document.addEventListener('DOMContentLoaded', function() { // 页面加载完成后，执行这个函数

    // 读取 localStorage 数据
    let tasksTodo = localStorage.getItem('tasksTodo');
    let tasksFinished = localStorage.getItem('tasksFinished');
    let keepTimes = localStorage.getItem('keepTimes');

    // 将 JSON 字符串转换成 JavaScript 对象
    tasksTodo = tasksTodo ? JSON.parse(tasksTodo) : [];
    tasksFinished = tasksFinished ? JSON.parse(tasksFinished) : [];
    keepTimes = keepTimes ? keepTimes : 0;

    // 将任务列表输出到页面上的 task-todo 元素中
    let taskTodoElement = document.querySelector('.task-todo');
    tasksTodo.forEach((item, index) => {
        let taskItem = document.createElement('div');
        taskItem.textContent = `Task ${index + 1}: ${item.name}`;
        taskTodoElement.appendChild(taskItem);
    });

    let taskFinishedElement = document.querySelector('.task-finished');
    tasksFinished.forEach((item, index) => {
        let taskItem = document.createElement('div');
        taskItem.textContent = `Task ${index + 1}: ${item.name}`;
        taskFinishedElement.appendChild(taskItem);
    });

    let keepTimesElement = document.querySelector('.keep-times');
    keepTimesElement.textContent = keepTimes;

    // 同样，你可以根据需要渲染已完成任务列表和其他数据
});