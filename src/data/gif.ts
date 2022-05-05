export class Gif {
    //required
    readonly path: string
    readonly name: string
    readonly timestamp: number

    //optional
    readonly link: string

    constructor(path: string, name: string, timestamp: number, link: string = "") {
        this.path = path;
        this.name = name;
        this.timestamp = timestamp;
        this.link = link
    }
}