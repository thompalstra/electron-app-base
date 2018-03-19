const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let windows = {
    main: null,
    children: [],
};

function createWindow () {
    windows.main = new BrowserWindow({frame:false,width: 800, height: 600})
    windows.main.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    windows.main.webContents.openDevTools()
    windows.main.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {

        windows.children.forEach(function(child){
            console.log(child);
        })

        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
