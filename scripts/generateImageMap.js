// This script scans the DbImages directory and generates an imageMappings.ts file that maps image filenames to require statements for use in React Native.


const fs = require('fs');
const path = require('path');

// Directory containing images that need to be mapped
const imagesDir = path.join(__dirname, '../assets/DbImages');

// Output file for the image mapping
const outputFile = path.join(__dirname, '../src/utils/imageMappings.ts');

// Function to recursively get all image files in the directory
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

// Function to generate the image mapping
function generateImageMap() {
    const files = getAllFiles(imagesDir);

    const imports = [];
    const mappings = files.map((file) => {
        // Get the filename without extension
        const key = path.basename(file, path.extname(file));

        // Create a valid variable name
        const importName = `img_${key.replace(/[^a-zA-Z0-9]/g, '')}`;

        // Check if the file is used for equations or LF_ markers
        if (key.startsWith('equations_') || key.startsWith('LF_')) {
            imports.push(`const ${importName} = require('../../assets/DbImages/${file.replace(imagesDir + '/', '')}');`);
            return `"${key}": ${importName}`;
        }

        return null;
    }).filter(Boolean);

    const fileContent = `
${imports.join('\n')}

export const imageMap = {
    ${mappings.join(',\n    ')}
};
`;

    fs.writeFileSync(outputFile, fileContent);
}

// Run the script
generateImageMap();
