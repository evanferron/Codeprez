import { contextBridge, ipcRenderer } from 'electron'

const api = {
  chooseFile: () => ipcRenderer.send('chooseFile'),
  ping: () => ipcRenderer.send('ping'),
  getSlidesContent: (filePath) => ipcRenderer.invoke('getSlidesContent', filePath),
  readFirstSlideContent: (filePath) => ipcRenderer.invoke('readFirstSlideContent', filePath),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
