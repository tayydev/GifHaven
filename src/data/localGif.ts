import {Drawable} from "./drawable";

//a gif saved to filesystem
export class LocalGif extends Drawable {
    //required
    readonly name: string
    readonly timestamp: number

    //optional
    readonly link: string

    constructor(path: string, width: number, height: number, name: string, timestamp: number, link: string = "") {
        super(path, width, height);
        this.name = name;
        this.timestamp = timestamp;
        this.link = link
    }
}