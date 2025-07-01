import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import path, { join } from 'path'
import fs from 'fs'
import iconLogo from '../../resources/Icon-C.png?asset'
import { handleChooseFile, handleCompileProject, handleImportProject } from './utils/eventHandler'
import { getSlidesContent, readFileContent, readFirstSlideContent } from './utils/markdown.js'
import { exec } from 'child_process'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { iconLogo } : {}),
    icon: iconLogo,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  const externalScreen = screen
    .getAllDisplays()
    .find((display) => display.bounds.x !== 0 || display.bounds.y !== 0)

  if (externalScreen) {
    mainWindow.setPosition(externalScreen.bounds.x + 20, externalScreen.bounds.y + 20)
    mainWindow.setSize(externalScreen.bounds.width - 40, externalScreen.bounds.height - 40)
  } else {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    mainWindow.setSize(width - 40, height - 40)
    mainWindow.setPosition(20, 20)
  }
  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

let subWindow = null
function createSubWindow(currentSlide, nextSlide, styleCss, timer) {
  subWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    icon: iconLogo,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  subWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'subproject' })

  subWindow.once('ready-to-show', () => {
    subWindow.maximize()
  })

  subWindow.webContents.on('did-finish-load', () => {
    subWindow.webContents.send('get-props', {
      currentSlide: currentSlide,
      nextSlide: nextSlide,
      styleCss: styleCss,
      timer: timer
    })
  })
}

app.whenReady().then(() => {
  ipcMain.handle('selectFile', async (_, type) => await handleChooseFile(type))
  ipcMain.handle('importProject', handleImportProject)
  ipcMain.handle(
    'compileProject',
    async (_, projectName, conf, pres, style, env, assets, manualConfig) =>
      await handleCompileProject(projectName, conf, pres, style, env, assets, manualConfig)
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
    const tempDir = path.join(filePath, 'env')
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

  ipcMain.handle('openSubPresentationPage', async (_, currentSlide, nextSlide, styleCss, timer) => {
    createSubWindow(currentSlide, nextSlide, styleCss, timer)
  })

  ipcMain.handle(
    'changeSlideSubPresentation',
    async (_, currentSlide, nextSlide, styleCss, timer) => {
      if (subWindow && !subWindow.isDestroyed()) {
        console.log('Change slide event received:', {
          currentSlide,
          nextSlide,
          styleCss,
          timer
        })
        subWindow.webContents.send('change-slide', {
          currentSlide: currentSlide,
          nextSlide: nextSlide,
          styleCss: styleCss,
          timer: timer
        })
      }
    }
  )

  ipcMain.handle('closeSubPresentation', async () => {
    if (subWindow && !subWindow.isDestroyed()) {
      subWindow.close()
      subWindow = null
    }
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
