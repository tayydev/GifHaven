import {IO} from "./io";
import {Drawable} from "./data/drawable";

export class Display {
    private readonly output: HTMLElement
    protected readonly io: IO

    constructor(output: HTMLElement, io: IO) {
        this.output = output;
        this.io = io;
    }

    protected draw(sources: Drawable[]) {
        console.log("sources " + sources)
        Display.removeChildren(this.output) //clear children
        sources.forEach(gif => {
            this.output.appendChild(this.makeImg(gif))
        })
    }

    protected makeImg(drawable: Drawable): HTMLElement {
        console.log('drawble found' + drawable)

        const img = document.createElement('img')
        img.src = this.io.makePathFull(drawable.path)
        img.setAttribute('data-path', drawable.path)
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