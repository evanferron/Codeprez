import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import fs from 'fs'
import icon from '../../resources/icon.png?asset'
import { handleChooseFile, handleCompileProject, handleImportProject } from './utils/eventHandler'
import { getSlidesContent, readFileContent, readFirstSlideContent } from './utils/markdown.js'
import { exec } from 'child_process'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(() => {
  ipcMain.handle('selectFile', async (_, type) => await handleChooseFile(type))
  ipcMain.handle('importProject', handleImportProject)
  ipcMain.handle(
    'compileProject',
    async (_, projectName, conf, pres, style, env, assets) =>
      await handleCompileProject(projectName, conf, pres, style, env, assets)
  )

  ipcMain.handle('getCss', async (_, path) => {
    return await readFileContent(path)
  })

  ipcMain.handle('getSlidesContent', async (_, path) => {
    return await getSlidesContent(path)
  })

  ipcMain.handle('readFirstSlideContent', async (_, path) => {
    return await readFirstSlideContent(path)
  })

  ipcMain.handle('runCommand', async (_, command, filePath) => {
    console.log('Running command:', command, 'in path:', filePath)
    // Force le cwd sur le dossier temporaire de la présentation
    const tempDir = path.join(filePath, 'assets')
    return new Promise((resolve) => {
      exec(command, { cwd: tempDir }, (error, stdout, stderr) => {
        if (error) {
          resolve(stderr || error.message)
        } else {
          resolve(stdout)
        }
      })
    })
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  fs.rmSync(getTempPath(), { recursive: true, force: true }, (err) => {
    if (err) {
      console.error('Error removing temporary path on quit:', err)
    } else {
      console.log('Temporary path removed successfully on quit')
    }
  })
})

export const getTempPath = () => {
  return path.join(app.getPath('temp'), 'codeprez')
}
