const win: any = window as any;
window.onload = () => { //wait for dom to load
    Renderer.init();
}
class Renderer {
    public static init() {
        this.initPopups()

        //special buttons
        document.getElementById('view-directory').addEventListener('click', () => {
            win.api.openLib();
        })
        document.getElementById('upload').addEventListener('click', () => {
            win.api.upload();
        });
        document.getElementById('change-directory').addEventListener('click', () => {
            win.api.changeLibraryLocation();
        })
        document.getElementById('delete-gif').addEventListener('click', () => {
            win.api.deleteGif()
        })

        //search
        document.getElementById('search').addEventListener('input', () => {
            win.api.search()
        })

        //drag and drop
        document.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();

            console.log('drop')

            for (const f of event.dataTransfer.files as any) {
                if(f.path == '') continue;
                win.api.import(f.path)
            }
        });
        document.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log('drag over!')
        });
        //todo these are not consistent and need work
        document.addEventListener('dragenter', (event) => {
            console.log('File is in the Drop Space');
        });
        document.addEventListener('dragleave', (event) => {
            console.log('File has left the Drop Space');
        });

        //online search todo can i just throw this in preload anyway???
        let timer;
        const waitTime = 250 //quarter of a second
        document.getElementById('online-search').addEventListener('input', () => {
            clearTimeout(timer)
            timer = setTimeout(() => win.api.onlineSearch(), waitTime)
        })
    }

    private static currentPopup: HTMLElement = null;
    private static blur: HTMLElement = null;
    private static initPopups() {
        this.blur = document.getElementById('blur');

        const popups = document.querySelectorAll("[id^=open]") //selects any div with open in the name
        popups.forEach(popup => {
            const id = popup.id.replace("open-", "") //find parent by removing open
            const parent = document.getElementById(id)
            popup.addEventListener('click', () => {
                this.show(parent)
            })
        })

        const closes = Object.values(document.getElementsByClassName('close-popup'))
        closes.forEach(close => {
            close.addEventListener('click', () => {
                this.hide()
            })
        })
    }

    private static show(element: HTMLElement) {
        this.blur.style.visibility = 'visible';
        element.style.visibility = 'visible';
        this.currentPopup = element

    }

    private static hide() {
        this.blur.style.visibility = 'hidden';
        this.currentPopup.style.visibility = 'hidden';
    }
}