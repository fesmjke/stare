(() => {
    const image_element = document.getElementById("images");
    const directory_element = document.getElementById("directory");
    const directory_select_element = document.getElementById("select-directory");

    directory_select_element.addEventListener('click', async (event) => {
        event.preventDefault();

        const {directory, basenames, fullpaths} = await window.API.openDirectory();

        directory_element.innerText = "Selected directory : " + directory;
        directory_element.className = "lead";

        for (const index in basenames) {
            const figure = document.createElement('figure');
            figure.className = "figure";
                
            image_element.appendChild(figure);

            const img = document.createElement('img');

            img.src = fullpaths[index];
            img.id = basenames[index];
            img.className = "img-thumbnail mx-auto d-block";
            figure.appendChild(img);
            
            const figcaption = document.createElement('figcaption');
            figcaption.innerText = basenames[index];
            figcaption.className = "figure-caption text-center";
            figure.appendChild(figcaption);
        }
    })

    window.API.fileChange(({basename, fullpath, date}) => {
        const img = document.getElementById(basename);
        img.src = fullpath + `?${date}`;
    })
})();


