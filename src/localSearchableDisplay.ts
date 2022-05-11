import { IO } from "./io"
import {Display} from "./display";
import {Gif} from "./data/gif";

export class LocalSearchableDisplay extends Display {
    private readonly search: HTMLInputElement //element to read search filters from
    constructor(output: HTMLElement, io: IO, search: HTMLInputElement) {
        super(output, io);

        this.search = search;
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


    protected override makeImg(gif: Gif): HTMLElement {
        const div = document.createElement('div')
        div.classList.add('gif-container')

        const button = document.createElement('input')
        button.type = 'button'
        button.value = 'Options'
        button.classList.add('gif-button')

        const img = super.makeImg(gif);

        div.appendChild(img)
        div.appendChild(button)

        this.applyGifListener(div, button)

        return div
    }

    private applyGifListener(div: HTMLElement, button: HTMLButtonElement) {
        div.addEventListener('mouseenter', () => {
            button.style.visibility = 'visible'
        })
        div.addEventListener('mouseleave', () => {
            button.style.visibility = 'hidden'
        })
    }
}