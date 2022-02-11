import * as path from 'path'
import * as fs from 'fs'
import { dialog, ipcRenderer } from 'electron';
import { Library } from './data/library';

export class IO {
    home: fs.PathLike;
    store: fs.PathLike;
    library: fs.PathLike;
    constructor(appData: fs.PathLike) {
        this.home = path.join(appData.toString(), './GifHaven'); //todo is roaming OK?
        this.store = path.join(this.home.toString(), './Store');
        this.library = path.join(this.store.toString(), './library.json');
    }

    public getGifs(): string[] {
        const directory = IO.makeIfNotExists(this.store)
        console.log("Directory is " + directory)
        return fs.readdirSync(directory)
            .filter(str => str.endsWith('.gif'))
            .map(str => path.join(this.store.toString(), str))
    }

    public getLibrary(): Library {
        if(fs.existsSync(this.library)) {
            return JSON.parse(fs.readFileSync(this.library, 'utf-8'))
        } else {
            return new Library()
        }
    }

    public writeLibrary(library: Library): void {
        fs.writeFileSync(this.library, JSON.stringify(library))
    }

    public upload(): void {
        
    }

    private static makeIfNotExists(path: fs.PathLike): fs.PathLike {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path)
            console.log("Making folder: " + path)
        } else {
            console.log("Accessing folder: " + path)
        }
        
        return path
    }

    public static build(): IO {
        const appData: string = ipcRenderer.sendSync('get-path')
        return new IO(appData)
    }
}