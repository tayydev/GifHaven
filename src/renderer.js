window.onload = () => { //wait for dom to load
    document.getElementById('upload').addEventListener('click', () => {
        window.api.upload();
    });
    document.getElementById('change-directory').addEventListener('click', () => {
        window.api.changeLibraryLocation();
    })

    var popup = null;
    const blur = document.getElementById('blur');
    
    const about = document.getElementById('about');
    document.getElementById('open-about').addEventListener('click', () => {
        blur.style.visibility = 'visible';
        about.style.visibility = 'visible';
        popup = about;
    });
    const settings = document.getElementById('settings');
    document.getElementById('open-settings').addEventListener('click', () => {
        blur.style.visibility = 'visible';
        settings.style.visibility = 'visible';
        popup = settings;
    })
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

    const gifs = document.getElementsByClassName('gif')
    for(var i = 0; i < gifs.length; i++) {
        const path = gifs[i].getAttribute('data-path')
        gifs[i].ondragstart = (event) => {
            event.preventDefault()
            window.api.startDrag(path)
        }
    }
}

//drag and drop
document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
 
    for (const f of event.dataTransfer.files) {
        window.api.import(f.path)
    }
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
 

//todo these are not consistent and need work
document.addEventListener('dragenter', (event) => {
    console.log('File is in the Drop Space');
});
document.addEventListener('dragleave', (event) => {
    console.log('File has left the Drop Space');
});