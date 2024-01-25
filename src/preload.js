const {ipcRenderer,contextBridge} = require('electron');

contextBridge.exposeInMainWorld('API', {
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    fileChange: (callback) => ipcRenderer.on('file-change', (event, args) => callback(args)),
})
