const electron = require('electron')
const path = require('path')

const { app, BrowserWindow, ipcMain, Tray, Menu, screen, dialog } = electron
const iconPath = path.join(__dirname, './src/img/icon.png') // 图标路径

let mainWindow
let tray
let remindWindow

app.on('ready', () => { // 应用启动后创建主窗口

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
    }
  })

  mainWindow.loadURL(`file://${__dirname}/src/main.html`) // 加载主窗口页面
  mainWindow.removeMenu() // 移除菜单栏

  tray = new Tray(iconPath) // 创建托盘
  tray.setToolTip('Tasky')
  tray.on('click', () => {
    if(mainWindow.isVisible()){
      mainWindow.hide()
    }else{
      mainWindow.show()
    }
  })

  tray.on('right-click', () => { // 右键点击托盘
    const menuConfig = Menu.buildFromTemplate([
      {
        label: '退出程序',
        click: () => app.quit()
      }
    ])
    tray.popUpContextMenu(menuConfig)
  })

})

ipcMain.on('mainWindow:close', () => { // 监听主窗口关闭事件
  // mainWindow.hide()
  mainWindow.close() // 点击关闭按钮时关闭主窗口
})

ipcMain.on('remindWindow:close', () => { // 监听提醒窗口关闭事件
  remindWindow.close()
})

ipcMain.on('setTaskTimer', (event, time, task) => { // 计时器
  const now = new Date()
  const date = new Date()
  date.setHours(time.slice(0,2), time.slice(3),0)
  const timeout = date.getTime() - now.getTime()
  setTimeout(() => {
    createRemindWindow(task) // 创建提醒窗口，显示提醒
  }, timeout)
})

function createRemindWindow (task) { // 显示提醒
  if(remindWindow) remindWindow.close()
  remindWindow = new BrowserWindow({
    height: 450,
    width: 360,
    resizable: false,
    frame: false,
    icon: iconPath,
    show: false,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation: false,
    }
  })

  remindWindow.removeMenu() // 移除菜单栏
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

app.on('activate', () => { // 应用激活时创建主窗口
  if (BrowserWindow.getAllWindows().length === 0) createWindow() // 如果主窗口不存在，则创建
})