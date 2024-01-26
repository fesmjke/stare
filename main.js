const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require("node:fs/promises");
const chokidar = require('chokidar');
const path = require('node:path');

const EXT_PNG = '.png';

const state = {
    directory: "",
    images: {},
}

let win;
let observer;

function startMonitoring(filePath) {
  observer = chokidar.watch(filePath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    alwaysStat: true
  });

  observer.on('change', (fullPath, stats) => {
    const date = stats.mtime.toLocaleString('en-US', { timeZoneName: 'short' });
    console.log(`File ${fullPath} changed. ${date}`);
    const base = path.basename(fullPath);
    win.webContents.send('file-change', {base, fullPath, date});
  });

  observer.on('unlink', (fpath) => {
    console.log(`File ${fpath} deleted.`);
  });
}

const loadImages = async (directory) => {
    const files = await fs.readdir(directory);
    
    const image_base = files.filter(file => {
        return path.extname(file) === EXT_PNG
    });
    
    const image_full_path = image_base.map((file) => {
        return path.join(directory, file);
    })

    return {image_base, image_full_path} 
}

const selectDirectory = async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog({properties: ['openDirectory']});
    if (!canceled) {
        state.directory = filePaths[0];
        const {image_base, image_full_path} = await loadImages(state.directory);

        state.images = {
            base: image_base,
            path: image_full_path
        }

        image_full_path.forEach(startMonitoring);
        return {directory: filePaths[0], image_base, image_full_path}
    }
}

const isDev = process.env.NODE_ENV !== 'development';

const createWindow = () => {
    win = new BrowserWindow({
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
