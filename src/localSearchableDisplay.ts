import {ipcRenderer} from "electron";
import {IO} from "./io"
import {Display} from "./display";
import {Gif} from "./data/gif";

export class LocalSearchableDisplay extends Display {
    private readonly search: HTMLInputElement //element to read search from
    private readonly popup: HTMLElement;
    private readonly blur: HTMLElement;
    constructor(output: HTMLElement, io: IO, search: HTMLInputElement) {
        super(output, io);
        this.search = search;

        this.popup = document.getElementById('tooltip')
        this.blur = document.getElementById('blur')

        document.getElementById('close-gif').addEventListener('click', () => {
            this.hidePopup()
        })
        document.getElementById('open-gif').addEventListener('click', () => {
            ipcRenderer.sendSync('open-loc', io.makePathFull(this.current.path))
        })
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
        button.setAttribute('data-path', gif.path)

        const img = super.makeImg(gif);

        div.appendChild(img)
        div.appendChild(button)

        this.applyGifListeners(div, button, gif)

        return div
    }

    private applyGifListeners(div: HTMLElement, button: HTMLButtonElement, gif: Gif) {
        div.addEventListener('mouseenter', () => {
            button.style.visibility = 'visible'
        })
        div.addEventListener('mouseleave', () => {
            button.style.visibility = 'hidden'
        })

        //add button behavior
        button.addEventListener('click', () => {
            this.current = gif; //set global gif value for the shared gif popup

            //update shared popup text
            (document.getElementById('rename-gif') as HTMLInputElement).value = this.current.name;
            this.showPopup() //show popup
        })
    }

    public showPopup() {
        this.blur.style.visibility = 'visible';
        this.popup.style.visibility = 'visible';
    }

    public hidePopup() {
        this.blur.style.visibility = 'hidden';
        this.popup.style.visibility = 'hidden';
    }

    private current: Gif = null;
    public getCurrent(): Gif {
        return this.current;
    }
}