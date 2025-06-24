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
  console.log('Creating project:', projectName)
  console.log('Config:', conf)
  console.log('Presentation:', pres)
  console.log('Style:', style)
  console.log('Environment', env)
  console.log('Assets:', assets)
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
