(() => {
    const image_element = document.getElementById("images");
    const directory_element = document.getElementById("directory");
    const directory_select_element = document.getElementById("select-directory");

    directory_select_element.addEventListener('click', async (event) => {
        event.preventDefault();

        const {directory, image_base, image_full_path} = await window.API.openDirectory();

        directory_element.innerText = "Selected directory : " + directory;
        directory_element.className = "lead";

        for (const index in image_base) {
            const figure = document.createElement('figure');
            figure.className = "figure";
                
            image_element.appendChild(figure);

            const img = document.createElement('img');

            img.src = image_full_path[index];
            img.id = image_base[index];
            img.className = "img-thumbnail mx-auto d-block";
            figure.appendChild(img);
            
            const figcaption = document.createElement('figcaption');
            figcaption.innerText = image_base[index];
            figcaption.className = "figure-caption text-center";
            figure.appendChild(figcaption);
        }
    })

    window.API.fileChange((filename) => {
        console.log('from renderer', filename);
    })
})();


