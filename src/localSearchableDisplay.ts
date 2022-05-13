import {ipcRenderer} from "electron";
import {IO} from "./io"
import {Display} from "./display";
import {Gif} from "./data/gif";

export class LocalSearchableDisplay extends Display {
    private readonly search: HTMLInputElement //element to read search from
    private readonly popup: HTMLElement;
    private readonly blur: HTMLElement;
    private readonly rename: HTMLButtonElement
    constructor(output: HTMLElement, io: IO, search: HTMLInputElement) {
        super(output, io);
        this.search = search;

        this.popup = document.getElementById('tooltip')
        this.blur = document.getElementById('blur')
        this.rename = document.getElementById('rename-gif') as HTMLInputElement

        document.getElementById('close-gif').addEventListener('click', () => {
            this.hidePopup()
        })
        document.getElementById('open-gif').addEventListener('click', () => {
            ipcRenderer.sendSync('open-loc', io.makePathFull(this.current.path))
        })
        document.getElementById('confirm-gif').addEventListener('click', () => {
            this.io.rename(this.current, this.rename.value)
            this.draw()
        })
        this.rename.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { //listen for enter keys in rename box
                this.io.rename(this.current, this.rename.value)
                this.draw()
                this.hidePopup() //an enter press means you are done setting name
            }
        });
    }

    public draw() {
        const text = this.search.value
        console.log(text)
        const filter = new RegExp(this.search.value, 'i') //no g flag (stateful cringe)

        const gifs = this.io.getLibrary().gifs
            .sort((a, b) => b.timestamp - a.timestamp) //reverse chronological
            .filter(gif => filter.test(gif.name))

        super.draw(gifs)
    }


    protected override makeImg(gif: Gif): HTMLElement {
        const hover = document.createElement('div') //everything that appears on hover
        hover.classList.add('hover')

        const label = this.makeLabel(gif)

        const button = document.createElement('input') //button for more details
        button.classList.add('gif-button')
        button.setAttribute('data-path', gif.path)
        button.type = 'button'
        button.value = 'Options'

        //add to hover
        hover.appendChild(label)
        hover.appendChild(button)

        const img = super.makeImg(gif); //gif object

        const div = document.createElement('div') //all objects including image
        div.classList.add('gif-container')
        div.appendChild(img)
        div.appendChild(hover)

        this.addHoverListeners(div, hover)
        this.addButtonListeners(button, gif)

        return div
    }

    private makeLabel(gif: Gif): HTMLElement {
        const label = document.createElement('div') //label
        label.classList.add('gif-label')
        label.innerHTML = gif.name + ' - ' + gif.path //todo html injection
        if(this.search.value == "") return label //if no search then we keep going

        //we are searching
        label.style.visibility = 'visible' //lock visible

        //highlight test
        const string = gif.name
        const regexp = new RegExp(this.search.value, 'ig') //g flag makes this stateful
        const matches: RegExpMatchArray = string.matchAll(regexp).next().value;
        for (const match of matches) {
            label.innerHTML = label.innerHTML.replace(match, '<mark>' + match + '</mark>') //todo html injection
        }

        return label
    }
    private addHoverListeners(div: HTMLElement, button: HTMLElement) {
        div.addEventListener('mouseenter', () => {
            button.style.visibility = 'visible'
        })
        div.addEventListener('mouseleave', () => {
            button.style.visibility = 'hidden'
        })
    }

    private addButtonListeners(button: HTMLInputElement, gif: Gif) {
        button.addEventListener('click', () => {
            this.current = gif; //set global gif value for the shared gif popup

            //update shared popup text
            this.rename.value = this.current.name;
            this.showPopup() //show popup
        })
    }
    private showPopup() {
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