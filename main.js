const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require("node:fs/promises");
const path = require('node:path');

const EXT_PPM = '.ppm';
const EXT_BMP = '.bmp';

const state = {
    directory: "",
    images: []
}

const loadImages = async (directory) => {
    const files = await fs.readdir(directory);
    
    const images_path = files.filter(file => {
        return path.extname(file).toLowerCase() === EXT_PPM || path.extname(file).toLowerCase() === EXT_BMP 
    }).map(file => {return path.join(directory, file)});
    
    return images_path
}

const selectDirectory = async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openDirectory']});
    if (!canceled) {
        state.directory = filePaths[0];
        state.images = await loadImages(state.directory);
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
