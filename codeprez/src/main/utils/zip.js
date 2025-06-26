import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { pathTemp } from '..'

export const zipFile = (projectName, config, pres, style, env, assets, destination) => {
  const zip = new AdmZip()

  zip.addLocalFile(config)
  zip.addLocalFile(pres)
  zip.addLocalFile(style)
  zip.addLocalFolder(env)
  zip.addLocalFolder(assets)

  zip.writeZip(path.join(destination, `${projectName}.zip`))

  fs.rename(
    path.join(destination, `${projectName}.zip`),
    path.join(destination, `${projectName}.codeprez`),
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

  const fileName = path.basename(pathCodeprez, '.codeprez')

  zip.extractAllTo(path.join(pathTemp, fileName), true)

  return path.join(pathTemp, fileName)
}

export const chooseFile = async (type) => {
  if (type === 'folder') {
    return await dialog.showOpenDialog({
      properties: ['openDirectory'],
      filters: [{ name: 'Folders', extensions: [''] }]
    })
  }
  return await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: type, extensions: [type] }]
  })
}

export const createProject = async (projectName, conf, pres, style, env, assets) => {
  const projectPath = path.join(pathTemp, projectName)
  fs.mkdirSync(projectPath, { recursive: true })
  fs.copyFileSync(conf, path.join(projectPath, 'config.json'))
  fs.copyFileSync(pres, path.join(projectPath, 'presentation.md'))
  fs.copyFileSync(style, path.join(projectPath, 'style.css'))
  fs.cpSync(env, path.join(projectPath, 'env'), { recursive: true })
  fs.cpSync(assets, path.join(projectPath, 'assets'), { recursive: true })

  return {
    success: true,
    projectPath
  }
}
