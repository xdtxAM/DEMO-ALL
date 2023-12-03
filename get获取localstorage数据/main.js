const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // 设置 userData 目录
      // userData: '/path/to/your/project/user-data'
    }
  });

  // 加载你的 HTML 文件
  mainWindow.loadFile('index.html');

  // 在窗口准备好后执行
  mainWindow.webContents.once('dom-ready', () => {
    // 读取 localStorage 中的数据
    mainWindow.webContents.executeJavaScript(`
      const loginTime = localStorage.getItem('loginTime');
      const tasksTodo = localStorage.getItem('tasksTodo');
      const tasksFinished = localStorage.getItem('tasksFinished');
      const keepTimes = localStorage.getItem('keepTimes');
      [loginTime, tasksTodo, tasksFinished, keepTimes];
    `).then((data) => {
      console.log('获取到的数据:', data);
    }).catch((error) => {
      console.error('执行 JavaScript 时发生错误:', error);
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
