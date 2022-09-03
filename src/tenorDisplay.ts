import * as Tenor from 'tenorjs'
import {IO} from "./io";
import {Display} from "./display";
import {Drawable} from "./data/drawable";

export class TenorDisplay extends Display {
    private readonly search: HTMLInputElement
    private readonly  tenor = Tenor.client({
        "Key": "LIVDSRZULELA", //restricted, rate limited example key
        "Filter": "off",
        "Locale": "en_US",
        "MediaFilter": "minimal" //we just need gif and tinygif (we also get mp4)
    })

    constructor(output: HTMLElement, io: IO, search: HTMLInputElement) {
        super(output, io);
        this.search = search;
    }

    public draw() {
        const text = this.search.value
        console.log(text)

        if(text == '') return;

        this.tenor.Search.Query(text, "50").then(results => {
            const outputs: Drawable[] = results.map(result => {
                const med = result.media[0].gif
                console.log(result)
                console.log(med)
                console.log(med.url)
                console.log(med.dims[0])
                return new Drawable(med.url, med.dims[0], med.dims[1])
                //new Drawable(med.url, med.dims[0], med.dims[1])
            })
            super.draw(outputs)
        })
    }

    protected override makeImg(drawable: Drawable): HTMLElement {
        const img = document.createElement('img')
        img.src = drawable.path
        img.setAttribute('loading', 'lazy')
        img.setAttribute('data-path', drawable.path)
        img.classList.add('gif')

        return img
    }
}