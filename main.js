
const { app, BrowserWindow, ipcMain } = require('electron')
const windowStateKeepr = require('electron-window-state')

let mainWindow

//Listen for new item request
ipcMain.on('new-item', (e, itemURL) => {
    //Get new item and send back to renderer
    setTimeout(() => {
        e.sender.send('new-item-sucess', 'New Item from main process')
    }, 2000)
})

function createWindow() {

    //win state Keeper
    let state = windowStateKeepr({
        defaultWidth: 500, defaultHeight: 650
    })
    mainWindow = new BrowserWindow({
        x: state.x, y: state.y,
        width: state.width, height: state.height,
        minWidth: 350, maxWidth: 650, minHeight: 300,
        icon: __dirname + './images/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    //Load main.html in the BrowserWindow
    mainWindow.loadFile('renderer/main.html')

    //Manage new window state
    state.manage(mainWindow)

    mainWindow.webContents.openDevTools();

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