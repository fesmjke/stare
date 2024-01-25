const {app, BrowserWindow, ipcMain, dialog, Menu} = require('electron');
const path = require('node:path');

const state = {
    directory: ""
}

const selectDirectory = async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openDirectory']});
    if (!canceled) {
        state.directory = filePaths[0];
        return filePaths[0]
    }
}

const isDev = process.env.NODE_ENV !== 'development';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "./src/preload.js"),
            nodeIntegration: true
        }
    });
    
    if(isDev) {
        win.webContents.openDevTools();
    }
    win.loadFile("./public/index.html");
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openDirectory', selectDirectory);
    createWindow(); 
})
