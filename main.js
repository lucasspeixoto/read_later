
const { app, BrowserWindow } = require('electron')
const windowStateKeepr = require('electron-window-state')

let mainWindow

function createWindow() {

    //win state Keeper
    let state = windowStateKeepr({
        defaultWidth: 500, defaultHeight: 650
    })
    mainWindow = new BrowserWindow({
        x: state.x, y: state.y,
        width: state.width, height: state.height,
        minWidth: 350, maxWidth:650, minHeight:300,
        icon: __dirname + './images/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile('renderer/main.html')

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