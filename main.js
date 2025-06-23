const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');


const zipFile = () => {

    const zip = new AdmZip();

    zip.addLocalFile(path.join(__dirname, 'data.json'));
    zip.addLocalFile(path.join(__dirname, 'presentation.md'));

    zip.writeZip(path.join(__dirname, 'test.zip'))
    fs.rename(path.join(__dirname, 'test.zip'), path.join(__dirname, 'test.codeprez'), (err) => {
        if (err) {
            console.error('Error renaming file:', err);
        } else {
            console.log('File renamed successfully to test.codeprez');
        }
    });
}

const unzipFile = () => {
    const zip = new AdmZip(path.join(__dirname, 'test.codeprez'));

    zip.extractAllTo(path.join(__dirname, "test"), true);
    console.log('Files extracted successfully');
}


unzipFile();