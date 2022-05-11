export class Config {
    readonly libraryPath: string
    constructor(path: string) {
        this.libraryPath = path;
        //todo specify your own tenor key?
    }
}