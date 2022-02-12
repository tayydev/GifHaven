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
    constructor() {
        const appData: string = ipcRenderer.sendSync('get-path') //get appdata folder from main.js

        this.gifHaven = IO.makeDirIfNotExists(path.join(appData.toString(), './GifHaven/')); //gifhaven is %appdata%/gifhaven
        this.defaultStore = IO.makeDirIfNotExists(path.join(appData.toString(), './GifHaven/Store')); //we create a default store directory
        this.configPath = path.join(this.gifHaven.toString(), './config.json') //we save where our non-moving config file is
        if(fs.existsSync(this.configPath)) {
            console.log("Config found!")
            this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'))
        }
        else {
            console.log("Making new config!")
            this.config = this.setConfig(new Config(this.defaultStore.toString())) //if no config exists we make a new one w/ the default store directory
        }

        //user storage is based off of the config file
        this.userStore = this.config.library
        this.libraryJson = path.join(this.userStore, './library.json')
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
        const base = path.basename(loc)
        const destination = IO.getUniqueSaveLoc(path.join(this.userStore.toString(), base))
        fs.copyFileSync(loc, destination)
        return new Gif(destination, base, Date.now()); //todo users should be able to specify a name
    }

    //helper method to generate a unique file save location in userstore in case of duplicate names
    private static getUniqueSaveLoc(destination: string): string {
        if(fs.existsSync(destination)) {
            //insert one zero
            var baseNoDot = path.basename(destination, 'gif')
            baseNoDot = baseNoDot.substring(0, baseNoDot.length - 1)
            const extension = path.extname(destination)
            return IO.getUniqueSaveLoc(path.join(path.dirname(destination), baseNoDot + '0' + extension)) //todo would be cool if this counted up (or was random) so mega reapeated gifs wouldn't hit file cap
        }
        return destination;
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
}
