export class Config {
    readonly library: string
    constructor(path: string) {
        this.library = path;
        //todo specify your own tenor key?
    }
}