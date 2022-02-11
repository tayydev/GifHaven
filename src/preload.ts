import { DisplayPane } from './displayPane'
import { version as appVersion } from '../package.json' //read version from json
import { contextBridge, ipcRenderer } from 'electron';
import { IO } from './io';

//don't initially create these because io creation requires setting a config
const io: IO = IO.build(); 
const display: DisplayPane = new DisplayPane(io);

window.addEventListener('DOMContentLoaded', () => {
    versionInjection()

    display.draw()
})
function versionInjection() {
    const replaceText = (selector: string, text :string) => {
        const element = document.getElementById(selector)
        if(element) element.innerHTML = text
    }

    for(const version of ['chrome', 'node', 'electron']) {
        replaceText(`${version}-version`, process.versions[version])
    }

    replaceText('gifhaven-version', appVersion)
    replaceText('library-location', io.config.library)
}
contextBridge.exposeInMainWorld('api', {
    upload: () => {
        const files: string[] = ipcRenderer.sendSync('select-file')
        if(files == undefined) return;
        const gif = io.import(files[0])
        display.add(gif)
    },
    changeLibraryLocation: () => {
        io.changeConfig()
    },
    import: (loc) => {
        display.add(io.import(loc))
    }
})