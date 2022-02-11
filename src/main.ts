import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as path from 'path'

var win: BrowserWindow

//create a new default window
const createWindow = () => {
    win = new BrowserWindow({
        width: 600,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

   win.loadFile('../../index.html')
}
//called once electron has loaded all components of the app
app.whenReady().then(() =>{
    createWindow()
})
//called when all windows are closed
app.on('window-all-closed', () => {
    app.quit()
})
//register this first
ipcMain.on('get-path', (event, arg) => {
    event.returnValue = app.getPath('appData')
})
ipcMain.on('select-file', (event, arg) => {
    event.returnValue = dialog.showOpenDialogSync(win, {
        defaultPath: app.getPath('downloads'),
        filters: [{name: 'Compatible Files', extensions: ['gif']}],
        properties: ['openFile'] //todo support multi files
    })
})