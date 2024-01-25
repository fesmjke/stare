const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require("node:fs/promises");
const path = require('node:path');

const EXT_PNG = '.png';

const state = {
    directory: "",
    images: []
}

const loadImages = async (directory) => {
    const files = await fs.readdir(directory);
    
    const images_path = files.filter(file => {
        return path.extname(file) === EXT_PNG
    }).map(file => {return path.join(directory, file)});
    
    return images_path
}

const selectDirectory = async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openDirectory']});
    if (!canceled) {
        state.directory = filePaths[0];
        state.images = await loadImages(state.directory);
        return {directory: filePaths[0], images: state.images}
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
