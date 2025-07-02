import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import { dialog } from 'electron'
import { getTempPath } from '..'

export const zipFile = (projectName, config, pres, style, env, assets, destination) => {
    const zip = new AdmZip()

    zip.addLocalFile(config, '', 'config.json')
    zip.addLocalFile(pres, '', 'presentation.md')
    zip.addLocalFile(style, '', 'style.css')
    zip.addLocalFolder(env, 'env')
    zip.addLocalFolder(assets, 'assets')

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

    zip.extractAllTo(path.join(getTempPath(), fileName), true)

    return path.join(getTempPath(), fileName)
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

export const createProject = async (
    projectName,
    conf,
    pres,
    style,
    env,
    assets,
    manualConfig = null
) => {
    const projectPath = path.join(getTempPath(), projectName)
    fs.mkdirSync(projectPath, { recursive: true })

    if (manualConfig) {
        // Si c'est une config manuelle (title, members, duration) on créer le fichier config.json
        const configPath = path.join(projectPath, 'config.json')
        fs.writeFileSync(configPath, JSON.stringify(manualConfig, null, 2))
    } else {
        fs.copyFileSync(conf, path.join(projectPath, 'config.json'))
    }

    fs.copyFileSync(pres, path.join(projectPath, 'presentation.md'))
    fs.copyFileSync(style, path.join(projectPath, 'style.css'))
    fs.cpSync(env, path.join(projectPath, 'env'), { recursive: true })
    fs.cpSync(assets, path.join(projectPath, 'assets'), { recursive: true })

    return {
        success: true,
        projectPath
    }
}
