//anything that can render as a gif
export class Drawable {
    readonly path: string
    readonly width: number
    readonly height: number


    constructor(path: string, width: number, height: number) {
        this.path = path;
        this.width = width;
        this.height = height;
    }
}