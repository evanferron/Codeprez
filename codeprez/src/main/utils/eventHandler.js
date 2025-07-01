import { chooseFile, createProject, unzipFile, zipFile } from './zip.js'

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
    const destination = unzipFile(file.filePaths[0])
    return {
      status: 'success',
      projectPath: destination
    }
  }
}

export const handleCompileProject = async (projectName, conf, pres, style, env, assets, manualConfig = null) => {
  if (!pres || !style || !env || !projectName || !assets) {
    return {
      success: false,
      error: 'All required fields must be filled.'
    }
  }

  if (!conf && !manualConfig) {
    return {
      success: false,
      error: 'You must either provide a config.json file or fill in all manual fields.'
    }
  }

  const creationResult = await createProject(projectName, conf, pres, style, env, assets, manualConfig)
  const path = await chooseFile('folder')
  if (path.canceled) {
    return {
      success: false,
      error: 'Project compilation cancelled.'
    }
  }
  console.log('Project creation result:', creationResult)
  console.log('Selected path for project:', path)
  zipFile(projectName, conf || creationResult.projectPath + '/config.json', pres, style, env, assets, path.filePaths[0])

  return {
    success: true,
    projectPath: creationResult.projectPath
  }
}
