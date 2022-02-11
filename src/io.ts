import * as path from 'path'
import * as fs from 'fs'
import { dialog, ipcRenderer } from 'electron';
import { Library } from './data/library';
import { Gif } from './data/gif';

export class IO {
    home: fs.PathLike;
    store: fs.PathLike;
    library: fs.PathLike;
    constructor(appData: fs.PathLike) {
        this.home = path.join(appData.toString(), './GifHaven'); //todo is roaming OK?
        this.store = IO.makeIfNotExists(path.join(this.home.toString(), './Store'));
        this.library = path.join(this.store.toString(), './library.json');
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

    public import(loc: string): Gif {
        const base = path.basename(loc)
        const destination = IO.getUnique(path.join(this.store.toString(), base))
        fs.copyFileSync(loc, destination)
        return new Gif(destination, base, Date.now());
    }

    private static getUnique(destination: string): string {
        if(fs.existsSync(destination)) {
            //insert one underscore
            var baseNoDot = path.basename(destination, 'gif')
            baseNoDot = baseNoDot.substring(0, baseNoDot.length - 1)
            const extension = path.extname(destination)
            return IO.getUnique(path.join(path.dirname(destination), baseNoDot + '0' + extension))
        }
        return destination;
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
