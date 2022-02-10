import { Library } from './library'
import { version as appVersion } from './package.json' //read version from json

window.addEventListener('DOMContentLoaded', () => {
    versionInjection()
    const library: Library = new Library();
    library.draw()
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