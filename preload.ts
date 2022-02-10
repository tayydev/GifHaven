import { ipcRenderer } from 'electron'
import { version as appVersion } from './package.json' //read version from json

window.addEventListener('DOMContentLoaded', () => {
    versionInjection()
    const string: String = ipcRenderer.sendSync('get-message')

    console.log(string)

    // while(true) {
    //     ipcRenderer.invoke('get-message', (event, reply) => {
    //         gifInjection(reply)
    //     })
    // }
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
function gifInjection(returned: string) {
    console.log(returned)
}