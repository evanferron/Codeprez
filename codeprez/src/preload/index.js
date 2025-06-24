import { contextBridge, ipcRenderer } from 'electron'

const api = {
  chooseFile: () => ipcRenderer.send('chooseFile'),
  ping: () => ipcRenderer.send('ping')
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
