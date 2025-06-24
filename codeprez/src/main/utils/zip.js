import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { pathTemp } from '..'

export const zipFile = () => {
  const zip = new AdmZip()

  zip.addLocalFile(path.join(__dirname, 'data.json'))
  zip.addLocalFile(path.join(__dirname, 'presentation.md'))

  zip.writeZip(path.join(__dirname, 'test.zip'))
  fs.rename(path.join(__dirname, 'test.zip'), path.join(__dirname, 'test.codeprez'), (err) => {
    if (err) {
      console.error('Error renaming file:', err)
    } else {
      console.log('File renamed successfully to test.codeprez')
    }
  });
}

export const unzipFile = (pathCodeprez) => {
  const zip = new AdmZip(pathCodeprez)

  zip.extractAllTo(path.join(pathTemp, 'test'), true)
}


export const chooseFile = async () => {
  return await dialog.showOpenDialog({ properties: ['openFile'] })
}
