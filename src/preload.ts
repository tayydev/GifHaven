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
export class Preload {
    private static io = new IO()
    private static display: LocalSearchableDisplay
    private static search: TenorPane

    public static init() {
        this.display = new LocalSearchableDisplay(
            document.getElementById('display'),
            this.io,
            document.getElementById('search') as HTMLInputElement,
        );
        this.search = new TenorPane(
            document.getElementById('search-results')
        );

        Preload.versionInjection()
        Preload.replaceText('library-location', this.io.getConfig().libraryPath)
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

    public static updateGifs() {
        this.display.draw()

        //attach file drags
        const gifs = Object.values(document.getElementsByClassName('gif'))
        gifs.forEach(gif => {
            const dest: string = this.io.makePathFull(gif.getAttribute('data-path'));
            (gif as any).ondragstart = (event) => { //todo cast as any is bad
                event.preventDefault()
                ipcRenderer.send('ondragstart', dest)
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
                this.io.addGif(gif)
                Preload.updateGifs()
            },
            //change the location of your library
            changeLibraryLocation: () => {
                this.io.changeLibraryLocation()
            },
            //add a new gif from a drag and drop
            import: (loc) => {
                const gif = this.io.importGif(loc);
                this.io.addGif(gif)
                Preload.updateGifs()
            },
            openLib: () => {
                ipcRenderer.sendSync('open-loc', this.io.getConfig().libraryPath.toString())
            },
            search: () => {
                Preload.updateGifs()
            },
            onlineSearch: (text) => {
                this.search.drawTenor(text)
            },
            deleteGif: () => {
                const localGif = this.display.getCurrent()
                this.io.deleteGif(localGif)
                Preload.updateGifs()

                this.display.hidePopup() //todo instead of hiding we should change to an undo screen
            }
        })
    }
}