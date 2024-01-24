const {app, BrowserWindow} = require('electron');

const isDev = process.env.NODE_ENV !== 'development';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
});
    if(isDev) {
        win.webContents.openDevTools();
    }

    win.loadFile("./public/index.html");
}

app.whenReady().then(() => {
    createWindow();
})
