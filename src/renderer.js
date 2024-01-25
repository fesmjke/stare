(() => {
    const image_element = document.getElementById("images");
    const directory_element = document.getElementById("directory");
    const directory_select_element = document.getElementById("select-directory");

    directory_select_element.addEventListener('click', async (event) => {
        event.preventDefault();

        const {directory, images} = await window.electronAPI.openDirectory();

        directory_element.innerText = "Selected directory : " + directory;
    
        for (const image_path of images) {
            const img = document.createElement('img');

            img.src = image_path;
            img.className = "img-thumbnail";
            image_element.appendChild(img);
        }
    })
})();


