const imageFormats = [".ppm", ".bmp"];

(() => {
    const directory_element = document.getElementById("directory");
    const directory_select_element = document.getElementById("select-directory");

    directory_select_element.addEventListener('click', async (event) => {
        event.preventDefault();

        const path = await window.electronAPI.openDirectory();

        directory_element.innerText = "Selected directory : " + path;
    })
})();


