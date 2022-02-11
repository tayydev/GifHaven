export class Gif {
    //required
    path: string
    name: string
    timestamp: number

    //optional
    link: string = ""

    constructor(path: string, name: string, timestamp: number, link: string = "") {
        this.path = path;
        this.name = name;
        this.timestamp = timestamp;
        this.link = link
    }
}