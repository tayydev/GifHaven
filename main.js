import { app, BrowserWindow } from 'electron'

//create a new default window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 1000
    })

    win.loadFile('index.html')
}
//called once electron has loaded all components of the app
app.whenReady().then(() =>{
    createWindow()
})
//called when all windows are closed
app.on('window-all-closed', () => {
    app.quit()
})