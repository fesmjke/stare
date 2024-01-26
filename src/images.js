const fs = require("node:fs/promises");
const path = require("node:path");

const EXTENSION_PNG = ".png";

const loadImages = async (directory) => {
    const files = await fs.readdir(directory);
    
    const basenames = files.filter(file => {
        return path.extname(file) === EXTENSION_PNG
    });
    
    const fullpaths = basenames.map((file) => {
        return path.join(directory, file);
    })

    return {basenames, fullpaths} 
}

module.exports = {
    loadImages
}
