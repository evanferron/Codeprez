import { chooseFile, createProject, unzipFile } from './zip.js'

export const handleChooseFile = async (type) => {
  const file = await chooseFile(type)
  if (file.canceled) {
    return {
      status: 'cancelled'
    }
  } else {
    if (RegExp(`.${type}$`).test(file.filePaths[0]) || type === 'folder') {
      return {
        status: 'success',
        filePath: file.filePaths[0]
      }
    }
    return {
      status: 'error',
      error: `The selected file is not a valid ${type} file.`
    }
  }
}

export const handleImportProject = async () => {
  const file = await chooseFile('codeprez')
  if (file.canceled) {
    return {
      status: 'cancelled'
    }
  } else {
    unzipFile(file.filePaths[0])
    return {
      status: 'success'
    }
  }
}

export const handleCompileProject = async (projectName, conf, pres, style, env, assets) => {
  console.log('Compiling project with the following details:')
  console.log('Project Name:', projectName)
  console.log('Config File:', conf)
  console.log('Presentation File:', pres)
  console.log('Style File:', style)
  console.log('Environment Folder:', env)
  console.log('Assets Folder:', assets)
  if (!conf || !pres || !style || !env || !projectName || !assets) {
    return {
      success: false,
      error: 'All fields must be filled.'
    }
  }
  createProject(projectName, conf, pres, style, env, assets)
  return {
    success: true
  }
}
