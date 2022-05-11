import {Gif} from "./data/gif";
import {IO} from "./io";

export class Display {
    private readonly output: HTMLElement
    protected readonly io: IO

    constructor(output: HTMLElement, io: IO) {
        this.output = output;
        this.io = io;
    }

    protected draw(sources: Gif[]) {
        Display.removeChildren(this.output) //clear children
        sources.forEach(gif => {
            this.output.appendChild(this.makeImg(gif))
        })
    }

    protected makeImg(gif: Gif): HTMLElement {
        const img = document.createElement('img')
        img.src = this.io.makePathFull(gif.path)
        img.setAttribute('data-path', gif.path)
        img.classList.add('gif')

        return img
    }

    //remove all children of a given element
    private static removeChildren(element: HTMLElement) {
        while(element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }
}