import * as path from 'path'
import * as fs from 'fs'
import { ipcRenderer } from 'electron';
import { Library } from './data/library';
import { Gif } from './data/gif';
import { Config } from './data/config';

export class IO {
    private gifHaven: fs.PathLike;
    private defaultStore: fs.PathLike;
    private configPath: fs.PathLike;
    config: Config
    private userStore: fs.PathLike;
    private libraryJson: string
    constructor(appData: fs.PathLike) {
        this.gifHaven = IO.makeIfNotExists(path.join(appData.toString(), './GifHaven/'));
        this.defaultStore = IO.makeIfNotExists(path.join(appData.toString(), './GifHaven/Store'));
        this.configPath = path.join(this.gifHaven.toString(), './config.json')
        if(fs.existsSync(this.configPath)) {
            console.log("Config found!")
            this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'))
        }
        else {
            console.log("Making new config!")
            this.config = this.setConfig(new Config(this.defaultStore.toString()))
        }

        this.userStore = this.config.library
        this.libraryJson = path.join(this.config.library, './library.json')
    }

    public changeConfig() {
        const dir = ipcRenderer.sendSync('select-directory', this.defaultStore)
        if(dir == undefined) return;
        this.setConfig(new Config(dir[0]))
        ipcRenderer.sendSync('reload')
    }

    private setConfig(config: Config): Config {
        fs.writeFileSync(this.configPath, JSON.stringify(config))
        return config;
    }

    public getLibrary(): Library {
        if(fs.existsSync(this.libraryJson)) {
            return JSON.parse(fs.readFileSync(this.libraryJson, 'utf-8'))
        } else {
            return new Library()
        }
    }

    public writeLibrary(library: Library): void {
        fs.writeFileSync(this.libraryJson, JSON.stringify(library))
    }

    public import(loc: string): Gif {
        const base = path.basename(loc)
        const destination = IO.getUnique(path.join(this.userStore.toString(), base))
        fs.copyFileSync(loc, destination)
        return new Gif(destination, base, Date.now());
    }

    private static getUnique(destination: string): string {
        if(fs.existsSync(destination)) {
            //insert one zero
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
