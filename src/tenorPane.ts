export class TenorPane {
    Tenor = require('tenorjs').client({
        "Key": "LIVDSRZULELA", //restricted, rate limited example key
        "Filter": "off",
        "Locale": "en_US",
        "MediaFilter": "minimal" //we just need gif and tinygif (we also get mp4)
    })

    public drawTenor(search: string) {
        const results = document.getElementById('search-results')
        while(results.firstChild) {
            results.removeChild(results.firstChild)
        }

        if(search == '') return;

        this.Tenor.Search.Query(search, "20").then(results => {
            for(var i = 0; i < results.length; i++) {
                const element = results[i]
                console.log(element)
                const url = element.media[0].tinygif.url;
                const img = document.createElement('img')
                img.src = url
                img.setAttribute('data-fullres', element.media[0].gif.url) //save loc of fullres file
                img.classList.add('gif')
                document.getElementById('search-results').appendChild(img)
            }
        })
    }
}