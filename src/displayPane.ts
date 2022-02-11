import { Gif } from "./data/gif"
import { IO } from "./io"

export class DisplayPane {
    io: IO;
    constructor(io: IO) {
        this.io = io;
    }

    public draw() {
        const files = this.io.getGifs()
        const library = document.getElementById('display')
        for(const gif of files) {
            console.log("Found gif: " + gif)
            const img = document.createElement('img')
            img.src = gif
            library.appendChild(img)
        }
    }

    public add(gif: Gif): void {
        const lib = this.io.getLibrary()
        lib.gifs.push(gif)
        this.io.writeLibrary(lib)
    }
}