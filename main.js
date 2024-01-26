const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const { loadImages } = require('./src/images');
const chokidar = require('chokidar');
const path = require('node:path');

let win;
let observer;

const startMonitoring = (fullpath) => {
    observer = chokidar.watch(fullpath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        alwaysStat: true
    });

    observer.on('change', (fullpath, stats) => {
        const date = stats.mtime.toLocaleString('en-US', { timeZoneName: 'short' });
        
        console.log(`File ${fullpath} changed at ${date}`);
        
        const basename = path.basename(fullpath);
        win.webContents.send('file-change', {basename, fullpath, date});
    });

    observer.on('unlink', (fullpath) => {
        console.log(`File ${fullpath} deleted.`);
    });
}

const selectDirectory = async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openDirectory']});
    if (!canceled) {
        const directory = filePaths[0];
        const {basenames, fullpaths} = await loadImages(directory);
        
        fullpaths.forEach(startMonitoring);
        
        return {directory, basenames, fullpaths}
    }
}

const isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
    win = new BrowserWindow({
        title: 'Stare',
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

app.on('before-quit', () => {
    if(observer) observer.close();
})
