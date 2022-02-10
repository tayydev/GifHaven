import * as path from 'path'
import * as fs from 'fs'
import { ipcRenderer } from 'electron';

export class IO {
    home: fs.PathLike;
    constructor(appData: fs.PathLike) {
        this.home = path.join(appData.toString(), './GifHaven'); //todo is roaming OK?
    }

    public getGifs(): string[] {
        const directory = IO.makeIfNotExists(path.join(this.home.toString(), './store'))
        return fs.readdirSync(directory).filter(str => str.endsWith('.gif')) //todo sort in correct order
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