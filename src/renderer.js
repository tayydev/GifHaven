window.onload= () => { //wait for dom to load
    document.getElementById('upload').addEventListener('click', () => {
        console.log("Local Click!");
        window.api.upload();
    });
}