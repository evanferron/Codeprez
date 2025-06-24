import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { pathTemp } from '..'

export const zipFile = (projectName, config, pres, style, env) => {
  const zip = new AdmZip()

  zip.addLocalFile(config)
  zip.addLocalFile(pres)
  zip.addLocalFile(style)
  zip.addLocalFolder(env)

  zip.writeZip(path.join(__dirname, 'projectName.zip'))

  fs.rename(
    path.join(__dirname, `${projectName}.zip`),
    path.join(__dirname, `${projectName}.codeprez`),
    (err) => {
      if (err) {
        console.error('Error renaming file:', err)
      } else {
        console.log('File renamed successfully to projectName.codeprez')
      }
    }
  )
}

export const unzipFile = (pathCodeprez) => {
  const zip = new AdmZip(pathCodeprez)

  zip.extractAllTo(path.join(pathTemp, 'test'), true)
}

export const chooseFile = async () => {
  return await dialog.showOpenDialog({ properties: ['openFile'] })
}
