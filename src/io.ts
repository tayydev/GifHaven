import * as path from 'path'
import * as fs from 'fs'
import { ipcRenderer } from 'electron';
import { Library } from './data/library';
import { Gif } from './data/gif';
import { Config } from './data/config';

export class IO {
    private readonly homePath: fs.PathLike;
    private readonly storePath: fs.PathLike;
    private readonly configPath: fs.PathLike;
    private readonly config: Config
    private readonly userStore: fs.PathLike;
    private readonly libraryJson: string

    constructor() {
        const appData: string = ipcRenderer.sendSync('get-path') //get appdata folder from main.js

        this.homePath = IO.makeDirIfNotExists(path.join(appData.toString(), './GifHaven/')); //gifhaven is %appdata%/gifhaven
        this.storePath = IO.makeDirIfNotExists(path.join(appData.toString(), './GifHaven/Store')); //we create a default store directory
        this.configPath = path.join(this.homePath.toString(), './config.json') //we save where our non-moving config file is
        if(fs.existsSync(this.configPath)) {
            console.log("Config found!")
            this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'))
        }
        else {
            console.log("Making new config!")
            this.config = this.setConfig(new Config(this.storePath.toString())) //if no config exists we make a new one w/ the default store directory
        }

        //user storage is based off of the config file
        this.userStore = this.config.libraryPath
        this.libraryJson = path.join(this.userStore, './library.json')

        console.log("IO finished init") //todo io should verify the authenticity of every gif in the library on startup. probably ignore but don't delete missing gifs (but think about how this screws with dupe names)
    }

    public getConfig(): Config {
        return this.config
    }

    //helper method to write config
    private setConfig(config: Config): Config {
        fs.writeFileSync(this.configPath, JSON.stringify(config))
        return config;
    }

    //BLOCKING method to allow the user to change the directory of their library
    public changeLibraryLocation() {
        const dir = ipcRenderer.sendSync('select-directory', this.userStore)
        if(dir == undefined) return;
        this.setConfig(new Config(dir[0]))
        ipcRenderer.sendSync('reload')
    }

    //get everything in the library.json file in the current userStore
    public getLibrary(): Library {
        if(fs.existsSync(this.libraryJson)) {
            return JSON.parse(fs.readFileSync(this.libraryJson, 'utf-8'))
        } else {
            return new Library()
        }
    }

    //write an updated library file
    public writeLibrary(library: Library): void {
        fs.writeFileSync(this.libraryJson, JSON.stringify(library))
    }

    //copy a gif to userstore and return a file representing its metadata
    public importGif(loc: string): Gif {
        let base = path.basename(loc, 'gif')
        base = base.substring(0, base.length - 1) //get rid of dot
        const uniqueBase = this.getUniqueName(base)
        fs.copyFileSync(loc, path.join(this.userStore.toString(), uniqueBase + '.gif'))
        return new Gif(uniqueBase + '.gif', uniqueBase, Date.now()); //todo users should be able to specify a name
    }

    //helper method to generate a unique file save location in userstore in case of duplicate names
    private getUniqueName(base: string): string {
        console.log(path.join(this.userStore.toString(), base + '.gif'))
        if(!fs.existsSync(path.join(this.userStore.toString(), base + '.gif'))) return base
        let addition = 0
        console.log('dupe found!')
        while(fs.existsSync(path.join(this.userStore.toString(), base + addition + '.gif'))) {
            addition++
        }
        return base + addition;
    }

    //self explanatory
    private static makeDirIfNotExists(path: fs.PathLike): fs.PathLike {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path)
            console.log("Making folder: " + path)
        } else {
            console.log("Accessing folder: " + path)
        }
        
        return path
    }

    public addGif(gif: Gif): void {
        const lib = this.getLibrary()
        lib.gifs.unshift(gif) //addFirst equivalent
        this.writeLibrary(lib)
    }

    public makePathFull(stub: string): string {
        return path.join(this.userStore.toString(), stub)
    }

    public deleteGif(gif: Gif) {
        const lib = this.getLibrary()
        lib.gifs = lib.gifs.filter(temp => temp.path != gif.path)
        fs.unlinkSync(path.join(this.userStore.toString(), gif.path))
        this.writeLibrary(lib)
    }
}
