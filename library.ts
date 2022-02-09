import { IO } from "./io"

export class Library {
    io: IO
    constructor(io: IO) {
        this.io = io
    }
    
    public draw() {
        const files = this.io.getGifs()
        const library = document.getElementById('library')
        for(const gif of files) {
            const img = document.createElement('img')
            img.src = gif
            library.appendChild(img)
        }
    }
}