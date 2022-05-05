export class TenorPane {
    private Tenor = require('tenorjs').client({
        "Key": "LIVDSRZULELA", //restricted, rate limited example key
        "Filter": "off",
        "Locale": "en_US",
        "MediaFilter": "minimal" //we just need gif and tinygif (we also get mp4)
    })

    private readonly results: HTMLElement

    constructor(results: HTMLElement) {
        this.results = results;
    }

    public drawTenor(search: string) {
        TenorPane.removeChildren(this.results) //clear children

        if(search == '') return;

        this.Tenor.Search.Query(search, "20").then(results => {
            for(let i = 0; i < results.length; i++) {
                const element = results[i]
                console.log(element)
                const url = element.media[0].tinygif.url;
                const img = document.createElement('img')
                img.src = url
                img.setAttribute('data-fullres', element.media[0].gif.url) //save loc of fullres file
                img.classList.add('gif')
                this.results.appendChild(img)
            }
        })
    }

    private static removeChildren(element: HTMLElement) {
        while(element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }
}