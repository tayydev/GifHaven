var win: any = window as any;
window.onload = () => { //wait for dom to load
    document.getElementById('upload').addEventListener('click', () => {
        win.api.upload();
    });
    document.getElementById('change-directory').addEventListener('click', () => {
        win.api.changeLibraryLocation();
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

    document.getElementById('search').addEventListener('input', () => {
        win.api.search()
    }, false)

    //todo these are not consistent and need work
    document.addEventListener('dragenter', (event) => {
        console.log('File is in the Drop Space');
    });
    document.addEventListener('dragleave', (event) => {
        console.log('File has left the Drop Space');
    });
}