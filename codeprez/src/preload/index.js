import { contextBridge, ipcRenderer } from 'electron'

const api = {
  importProject: async () => await ipcRenderer.invoke('importProject'),
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
