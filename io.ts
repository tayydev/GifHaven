import * as path from 'path'
import * as fs from 'fs'

export class IO {
    home: fs.PathLike;
    constructor(home: fs.PathLike) {
        this.home = home;
    }

    public getGifs(): string[] {
        const directory = IO.makeIfNotExists(path.join(this.home.toString(), './store'))
        return fs.readdirSync(directory).filter(str => str.endsWith('.gif')) //todo sort in correct order
    }

    private static makeIfNotExists(path: fs.PathLike): fs.PathLike {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
        console.log("Making folder: " + path)
        return path
    }
}