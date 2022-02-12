import { Gif } from "./data/gif"
import { IO } from "./io"

const matchAll: RegExp = new RegExp('.+')

export class DisplayPane {
    io: IO;
    constructor(io: IO) {
        this.io = io;
    }

    public draw(filter: RegExp = matchAll) {
        //clear
        const library = document.getElementById('display')
        while(library.firstChild) {
            library.removeChild(library.firstChild)
        }

        //draw
        const gifs = this.io.getLibrary().gifs
            .sort((a, b) => b.timestamp - a.timestamp) //reverse chronological
            .filter(gif => filter.test(gif.name))

        console.log(gifs.length)
        console.log(filter.source)

        for(const gif of gifs) {
            console.log("Found gif: " + gif)
            const img = document.createElement('img')
            img.classList.add('gif')
            img.src = gif.path
            img.setAttribute('data-path', gif.path)
            library.appendChild(img)
        }
    }

    public add(gif: Gif): void {
        const lib = this.io.getLibrary()
        lib.gifs.unshift(gif) //addFirst equivalent
        this.io.writeLibrary(lib)
    }
}