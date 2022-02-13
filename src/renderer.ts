var win: any = window as any;
window.onload = () => { //wait for dom to load
    //special buttons
    document.getElementById('upload').addEventListener('click', () => {
        win.api.upload();
    });
    document.getElementById('change-directory').addEventListener('click', () => {
        win.api.changeLibraryLocation();
    })
    
    //search
    document.getElementById('search').addEventListener('input', () => {
        win.api.search()
    })

    //popup system
    var popup = null;
    const blur = document.getElementById('blur');    
    const activatePopup = (element) => {
        blur.style.visibility = 'visible';
        element.style.visibility = 'visible';
        popup = element;
    }
    const about = document.getElementById('about');
    document.getElementById('open-about').addEventListener('click', () => {
        activatePopup(about)
    });
    const settings = document.getElementById('settings');
    document.getElementById('open-settings').addEventListener('click', () => {
        activatePopup(settings)
    })
    const importScreen = document.getElementById('import')
    document.getElementById('open-import').addEventListener('click', () => {
        activatePopup(importScreen)
    })
    //close items in popup system
    const docs = document.getElementsByClassName('close-popup')
    for(var i = 0; i < docs.length; i++) {
        docs[i].addEventListener('click', () => {
            if(popup !== null) {
                blur.style.visibility = 'hidden';
                popup.style.visibility = 'hidden';
                popup = null;
            }
        });
    }

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

    //online search
    var timer;
    const waitTime = 250 //quarter of a second
    document.getElementById('online-search').addEventListener('input', () => {
        clearTimeout(timer)
        timer = setTimeout(() => win.api.onlineSearch(), waitTime)
    })
}