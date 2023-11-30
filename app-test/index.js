const electron = require('electron')
const path = require('path')

const { app, BrowserWindow, ipcMain, Tray, Menu, screen, dialog } = electron
const { autoUpdater } = require('electron-updater')
const iconPath = path.join(__dirname, './src/img/icon.png')

let mainWindow
let tray
let remindWindow

app.on('ready', () => {
  //检查更新
  // checkUpdate()


  mainWindow = new BrowserWindow({ // 创建主窗口
    frame: false,
    resizable: false,
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences:{
      backgroundThrottling: false,
      nodeIntegration:true,
      contextIsolation: false
      // preload: path.join(__dirname, './preload.js')
    }
  })
  mainWindow.loadURL(`file://${__dirname}/src/main.html`) // 加载页面
  mainWindow.removeMenu() // 移除菜单栏

  tray = new Tray(iconPath) // 创建托盘
  tray.setToolTip('Tasky') // 鼠标悬浮提示
  tray.on('click', () => {
    if(mainWindow.isVisible()){
      mainWindow.hide()
    }else{
      mainWindow.show()
    }
  })

  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: '退出App',
        click: () => app.quit()
      }
    ])
    tray.popUpContextMenu(menuConfig)
  })

})

ipcMain.on('mainWindow:close', () => { // 监听关闭事件
  // mainWindow.hide() // 隐藏窗口
  mainWindow.close() // 关闭窗口
})

ipcMain.on('remindWindow:close', () => { // 监听关闭事件
  remindWindow.close()
})

ipcMain.on('setTaskTimer', (event, time, task) => {
  const now = new Date()
  const date = new Date()
  date.setHours(time.slice(0,2), time.slice(3),0)
  const timeout = date.getTime() - now.getTime()
  setTimeout(() => {
    createRemindWindow(task)
  }, timeout) 
})

function createRemindWindow (task) { // 提醒功能，显示在屏幕右下角
  if(remindWindow) remindWindow.close()
  remindWindow = new BrowserWindow({ // 创建主窗口
    height: 450,
    width: 360,
    resizable: false,
    frame: false,
    icon: iconPath,
    show: false,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation: false,
      // preload: path.join(__dirname, './preload.js')
    }
  })

  remindWindow.removeMenu()
  const size = screen.getPrimaryDisplay().workAreaSize
  const { y } = tray.getBounds()
  const { height, width } = remindWindow.getBounds()
  const yPosition = process.platform === 'darwin' ? y : y - height
  remindWindow.setBounds({
    x: size.width - width,
    y: yPosition,
    height,
    width 
  })

  remindWindow.setAlwaysOnTop(true)
  remindWindow.loadURL(`file://${__dirname}/src/remind.html`)
  remindWindow.show()
  remindWindow.webContents.send('setTask', task)
  remindWindow.on('closed', () => { remindWindow = null })
  setTimeout( () => {
    remindWindow && remindWindow.close()
  }, 50 * 1000)

}

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})