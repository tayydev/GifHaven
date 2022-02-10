import * as path from 'path'
import * as fs from 'fs'
import { ipcRenderer } from 'electron';

export class IO {
    home: fs.PathLike;
    store: fs.PathLike;
    constructor(appData: fs.PathLike) {
        this.home = path.join(appData.toString(), './GifHaven'); //todo is roaming OK?
        this.store = path.join(this.home.toString(), './Store')
    }

    public getGifs(): string[] {
        const directory = IO.makeIfNotExists(this.store)
        console.log("Directory is " + directory)
        return fs.readdirSync(directory)
            .filter(str => str.endsWith('.gif'))
            .map(str => path.join(this.store.toString(), str))
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