import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import fs from 'fs'
import icon from '../../resources/icon.png?asset'
import { handleChooseFile, handleCompileProject, handleImportProject } from './utils/eventHandler'
import { getSlidesContent, readFirstSlideContent } from './utils/markdown.js'

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
    mainWindow.show()
    mainWindow.webContents.openDevTools({ mode: 'detach' })
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
  fs.rmSync(pathTemp, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error('Error removing temporary path on quit:', err)
    } else {
      console.log('Temporary path removed successfully on quit')
    }
  })
})

ipcMain.handle('getSlidesContent', async (event, filePath) => {
  return await getSlidesContent(filePath)
})

ipcMain.handle('readFirstSlideContent', async (event, filePath) => {
  return await readFirstSlideContent(filePath)
})

export const pathTemp = path.join(app.getPath('temp'), 'codeprez')
