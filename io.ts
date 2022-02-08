import * as fs from 'fs'

function getFiles(path: fs.PathLike) {
    const directory = fs.readdir(path, (err, files) => {
        console.log(files)
    })
}