const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const url = require('url')
const path = require('path')

let mainWindow;

class WindowManager{
    constructor(){
        this.children = [];
    }
    hasChildren(){
        return this.children.length > 0;
    }
    openWindow( localUrl, options, debug ){

        if( typeof options !== 'object' ){
            options = {width: 800, height: 600};
        }

        var child = new BrowserWindow(options)

        child.loadURL(url.format({
            pathname: path.join(__dirname, localUrl),
            protocol: 'file:',
            slashes: true
        }))

        if( debug == true ){
            child.webContents.openDevTools()
        }

        child.on('closed', function(e){
            child = null;
        }.bind(child))
        this.children.push( child );
    }
    closeAll(){
        this.children.forEach(function(child){
            child.close();
        });
        this.children = [];
    }
}

let windowManager = new WindowManager();

document.on('click', '[on="click"][role]', function(event){
    this.do( this.getAttribute('role') );
})
