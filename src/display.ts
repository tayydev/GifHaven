import {Gif} from "./data/gif";

export class Display {
    private readonly output: HTMLElement

    constructor(output: HTMLElement) {
        this.output = output;
    }

    protected draw(sources: Gif[]) {
        Display.removeChildren(this.output) //clear children
        sources.forEach(gif => {
            const img = document.createElement('img')
            img.src = gif.path
            img.setAttribute('data-path', gif.path)
            img.classList.add('gif')
            this.output.appendChild(img)
        })
    }

    //remove all children of a given element
    private static removeChildren(element: HTMLElement) {
        while(element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }
}