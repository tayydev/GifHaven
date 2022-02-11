import { Gif } from "./data/gif"
import { IO } from "./io"

export class DisplayPane {
    io: IO;
    constructor(io: IO) {
        this.io = io;
    }

    public draw() {
        //clear
        const library = document.getElementById('display')
        while(library.firstChild) {
            library.removeChild(library.firstChild)
        }

        //draw
        const gifs = this.io.getLibrary().gifs.sort((a, b) => b.timestamp - a.timestamp)
        for(const gif of gifs) {
            console.log("Found gif: " + gif)
            const img = document.createElement('img')
            img.src = gif.path
            library.appendChild(img)
        }
    }

    public add(gif: Gif): void {
        const lib = this.io.getLibrary()
        lib.gifs.unshift(gif)
        this.io.writeLibrary(lib)

        this.draw()
    }
}