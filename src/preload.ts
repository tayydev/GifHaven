import { LocalSearchableDisplay } from './localSearchableDisplay'
// @ts-ignore
import { version as appVersion } from '../package.json' //read version from json
import { contextBridge, ipcRenderer } from 'electron';
import { IO } from './io';
import { TenorPane } from './tenorPane';
//run on load
window.addEventListener('DOMContentLoaded', () => {
    Preload.init()
})
class Preload {
    private static io = new IO()
    private static display: LocalSearchableDisplay
    private static search: TenorPane

    public static init() {
        this.display = new LocalSearchableDisplay(
            document.getElementById('display'),
            document.getElementById('search') as HTMLInputElement,
            this.io
        );
        this.search = new TenorPane(
            document.getElementById('search-results')
        );

        Preload.versionInjection()
        Preload.replaceText('library-location', this.io.config.library)
        Preload.updateGifs()

        Preload.exposeBridge()
    }

    private static versionInjection() {
        for(const version of ['chrome', 'node', 'electron']) {
            Preload.replaceText(`${version}-version`, process.versions[version])
        }

        Preload.replaceText('gifhaven-version', appVersion)
    }

    private static replaceText(selector: string, content: string) {
        const element = document.getElementById(selector)
        if(element) element.innerHTML = content
    }

    private static updateGifs() {
        this.display.draw()

        //attach file drags
        const gifs = Object.values(document.getElementsByClassName('gif'))
        gifs.forEach(gif => {
            const path = gif.getAttribute('data-path'); //todo this needs to be rethought
            (gif as any).ondragstart = (event) => { //todo cast as any is bad
                event.preventDefault()
                ipcRenderer.send('ondragstart', path)
            }
        })
    }

    private static exposeBridge() {
        //expose methods to render.js
        contextBridge.exposeInMainWorld('api', {
            //add a new gif from a file
            upload: () => {
                const files: string[] = ipcRenderer.sendSync('select-file')
                if(files == undefined) return;
                const gif = this.io.importGif(files[0])
                this.display.add(gif)
                Preload.updateGifs()
            },
            //change the location of your library
            changeLibraryLocation: () => {
                this.io.changeLibraryLocation()
            },
            //add a new gif from a drag and drop
            import: (loc) => {
                const gif = this.io.importGif(loc);
                this.display.add(gif)
                Preload.updateGifs()
            },
            search: () => {
                Preload.updateGifs()
            },
            onlineSearch: (text) => {
                this.search.drawTenor(text)
            }
        })
    }
}