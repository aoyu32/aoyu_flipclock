const { app, BrowserWindow, powerSaveBlocker, Menu, Tray } = require('electron')
const path = require('path')

// 在入口文件对的顶部配置热加载
// 热加载
// try {
//   require('electron-reloader')(module, {});
// } catch (_) { }

let tray = null
let mainWin
let clockTyle = 'flipclock.html'

//防止系统休眠程序停止
const createWindow = () => {
  mainWin = new BrowserWindow({
    width: 1200,
    height: 280,
    transparent: true,
    frame: false,
    minimizable:false,
    maximizable:false,
    resizable: false,
    focusable:false,
    skipTaskbar:true,
  })
  mainWin.loadFile('./html/' + clockTyle)

  // mainWin.webContents.openDevTools()

  // 禁止右键菜单弹出 start
  mainWin.hookWindowMessage &&
    mainWin.hookWindowMessage(278, function () {
      mainWin.setEnabled(false) //窗口禁用
      let timer = setTimeout(() => {
        mainWin.setEnabled(true)
        clearTimeout(timer)
      }, 100) // 延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
      return true
    })
}


app.whenReady().then(() => {
  createWindow()

  tray = new Tray(path.join(__dirname,'./assets/aoyu2.ico'))
  tray.setToolTip('aoyu\'s flip clock')
  const contextMenu = Menu.buildFromTemplate([
    // {
    //   label: '调整尺寸',
    //   type: 'normal',
    //   click:()=>{
    //     // clockTyle = 'clock.html'
    //     // mainWin.loadFile('./html/clock.html')
    //     console.log('开发中...');
    //   }
    // },
    // { label: '时钟设置', type: 'normal' },
    // {
    //   label: '暂停',
    //   type: 'normal',
    // },
    {
      label: '重启',
      type: 'normal',
      click: () => {
        app.relaunch()
        app.exit(0)
      }
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })


  // const id = powerSaveBlocker.start('prevent-display-sleep')
  // console.log(id);
  // powerSaveBlocker.stop(id)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

