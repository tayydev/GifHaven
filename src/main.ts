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
ipcMain.on('get-path', (event, arg) => {
    event.returnValue = app.getPath('appData')
})
ipcMain.on('reload', (event, arg) => {
    win.reload()
    event.returnValue = true
});
ipcMain.on('open-loc', (event, arg) => {
    console.log('Placeholder open!')
    event.returnValue = null
})
ipcMain.on('select-file', (event, arg) => {
    event.returnValue = dialog.showOpenDialogSync(win, {
        message: 'Select gifs to import',
        defaultPath: app.getPath('downloads'),
        filters: [{name: 'Compatible Files', extensions: ['gif']}],
        properties: ['openFile'] //todo support multi files
    })
})
ipcMain.on('select-directory', (event, arg) => {
    event.returnValue =  dialog.showOpenDialogSync(win, {
        message: 'Select a directory for your gif library',
        defaultPath: arg, //io passes us a default directory (in this case %appdata%/roaming/gifhaven/store)
        properties: ['openDirectory'] //todo support multi files
    })
})
ipcMain.on('ondragstart', (event, dir) => {

    console.log("Directory is: " + dir)

    event.sender.startDrag({
        file: dir,
        icon: path.join(__dirname, '../../img/dragIcon.png') //todo this icon sucks
    })
})