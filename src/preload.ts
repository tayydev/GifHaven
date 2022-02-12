import { DisplayPane } from './displayPane'
import { version as appVersion } from '../package.json' //read version from json
import { contextBridge, ipcRenderer } from 'electron';
import { IO } from './io';

const io: IO = new IO()
const display: DisplayPane = new DisplayPane(io);

//run on load
window.addEventListener('DOMContentLoaded', () => {
    versionInjection()
    replaceText('library-location', io.config.library)
    display.draw()
})
//replace text of a given element
function replaceText(selector: string, text :string) {
    const element = document.getElementById(selector)
    if(element) element.innerHTML = text
}
//do specific text replaces for the about popup
function versionInjection() {
    for(const version of ['chrome', 'node', 'electron']) {
        replaceText(`${version}-version`, process.versions[version])
    }

    replaceText('gifhaven-version', appVersion)
}
//expose methods to render.js
contextBridge.exposeInMainWorld('api', {
    //add a new gif from a file
    upload: () => {
        const files: string[] = ipcRenderer.sendSync('select-file')
        if(files == undefined) return;
        const gif = io.importGif(files[0])
        display.add(gif)
    },
    //change the location of your library
    changeLibraryLocation: () => {
        io.changeLibraryLocation()
    },
    //add a new gif from a drag and drop
    import: (loc) => {
        const gif = io.importGif(loc);
        display.add(gif)
    },
    startDrag: (path) => {
        ipcRenderer.send('ondragstart', path)
    }
})
