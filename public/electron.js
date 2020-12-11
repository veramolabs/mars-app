// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')
const url = require('url')
const { fork, spawn } = require('child_process')
const getPort = require('get-port')
let agentServer

getPort().then((port) => {
  process.env.PORT = port
  process.env.BASE_URL = 'http://localhost:' + port
  process.env.API_KEY = `${Math.floor(Math.random() * 10000000000000)}`
  process.env.API_BASE_PATH = '/agent'

  agentServer = fork('./node_modules/daf-cli/bin/daf.js', [
    'server',
    '--config=' + path.join(__dirname, './electron-agent.yml'),
  ])

  var defaultConnection = {
    url: process.env.BASE_URL + process.env.API_BASE_PATH,
    token: process.env.API_KEY,
  }

  ipcMain.on('get-default-connection', function (event, arg) {
    event.sender.send('default-connection-reply', defaultConnection)
  })

  function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      backgroundColor: '#202020',
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        // preload: path.join(__dirname, 'preload.js')
      },
    })

    // and load the index.html of the app.
    const startUrl =
      process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
      })
    mainWindow.loadURL(startUrl)

    nativeTheme.themeSource = 'dark'

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('will-quit', function () {
    console.log('Killing server agent will-quit')
    return agentServer.kill()
  })
})

process.on('SIGINT', () => {
  console.log('Killing server agent')
  return agentServer.kill()
})
