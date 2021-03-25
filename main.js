const { app, BrowserWindow, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state')
const readItem = require('./readItem')
const appMenu = require('./menu')
const updater = require('./updater')

let mainWindow

//Listen for new item request
ipcMain.on('new-item', (e, itemURL) => {

    //Get new item and send back to renderer
    readItem(itemURL, item => {
        e.sender.send('new-item-sucess', item)
    })
})

function createWindow() {

    //Check for app updates after 3s
    setTimeout(updater, 1500)
    //win state Keeper
    let state = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 600
    })

    //Start BrowserWindow
    mainWindow = new BrowserWindow({
        x: state.x, y: state.y,
        width: state.width, height: state.height,
        minWidth: 350, maxWidth: 600, minHeight: 300,
        icon: __dirname + './images/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    //Create menu
    appMenu(mainWindow.webContents)

    //Load main.html in the BrowserWindow
    mainWindow.loadFile('renderer/main.html')

    //Manage new window state
    state.manage(mainWindow)

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})