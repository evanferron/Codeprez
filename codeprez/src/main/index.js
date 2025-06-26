import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import fs from 'fs'
import icon from '../../resources/icon.png?asset'
import { handleChooseFile, handleCompileProject, handleImportProject } from './utils/eventHandler'
import { getSlidesContent, readFirstSlideContent } from './utils/markdown.js'
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


function createSubWindow(currentSlide, nextSlide, styleCss, timer) {
  const subWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
       preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  });

  subWindow.loadFile(join(__dirname, '../renderer/index.html'), {hash: 'subproject'});

  subWindow.once('ready-to-show', () => {
    subWindow.show();
  });

  subWindow.webContents.on('did-finish-load', () => {
    subWindow.webContents.send('get-props', {
      currentSlide : currentSlide,
      nextSlide : nextSlide,
      styleCss : styleCss,
      timer : timer
    });
  });
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

ipcMain.handle('getSlidesContent', async () => {
  const filePath = path.join(app.getPath('temp'), 'codeprez', 'example-presentation')
  return await getSlidesContent(filePath)
})

ipcMain.handle('readFirstSlideContent', async () => {
  const filePath = path.join(app.getPath('temp'), 'codeprez', 'example-presentation')
  return await readFirstSlideContent(filePath)
})

ipcMain.handle('runCommand', async (_, command) => {
  // Force le cwd sur le dossier temporaire de la présentation
  const tempDir = path.join(app.getPath('temp'), 'codeprez', 'example-presentation', 'assets')
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

ipcMain.handle('openSubProjectPage', async (_, currentSlide, nextSlide, styleCss, timer) => {
  createSubWindow(currentSlide, nextSlide, styleCss, timer)
})

export const pathTemp = path.join(app.getPath('temp'), 'codeprez')
