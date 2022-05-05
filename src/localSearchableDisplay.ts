import { Gif } from "./data/gif"
import { IO } from "./io"
import {Display} from "./display";

export class LocalSearchableDisplay extends Display {
    private readonly io: IO;
    private readonly search: HTMLInputElement
    constructor(output: HTMLElement, search: HTMLInputElement, io: IO) {
        super(output);

        console.log(search)

        this.search = search;
        this.io = io;
    }

    public draw() {
        const text = this.search.value
        console.log(text)
        const filter = new RegExp(text) //todo bad if search value is nothing

        const gifs = this.io.getLibrary().gifs
            .sort((a, b) => b.timestamp - a.timestamp) //reverse chronological
            .filter(gif => filter.test(gif.name))

        super.draw(gifs)
    }

    // public draw(filter: RegExp = matchAll) {
    //     //clear
    //     const library = document.getElementById('display')
    //     while(library.firstChild) {
    //         library.removeChild(library.firstChild)
    //     }
    //
    //     //draw
    //     const gifs = this.io.getLibrary().gifs
    //         .sort((a, b) => b.timestamp - a.timestamp) //reverse chronological
    //         .filter(gif => filter.test(gif.name))
    //
    //     console.log(gifs.length)
    //     console.log(filter.source)
    //
    //     for(const gif of gifs) {
    //         console.log("Found gif: " + gif)
    //         const img = document.createElement('img')
    //         img.classList.add('gif')
    //         img.src = gif.path
    //         img.setAttribute('data-path', gif.path)
    //         library.appendChild(img)
    //     }
    // }

    public add(gif: Gif): void {
        const lib = this.io.getLibrary()
        lib.gifs.unshift(gif) //addFirst equivalent
        this.io.writeLibrary(lib)
    }
}