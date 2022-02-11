import { DisplayPane } from './displayPane'
import { version as appVersion } from '../package.json' //read version from json
import { Gif } from './data/gif';
import { contextBridge } from 'electron';
import { IO } from './io';

const io: IO = IO.build() //shared io instance
const display: DisplayPane = new DisplayPane(io)

window.addEventListener('DOMContentLoaded', () => {
    versionInjection()
    display.draw()

    const gif = new Gif("./demo", "demo", -1)
    display.add(gif)
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
}
contextBridge.exposeInMainWorld('api', {
    upload: () => {
        io.upload()
        display.draw()
    }
})