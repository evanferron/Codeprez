import { contextBridge, ipcRenderer } from 'electron'

const api = {
  selectFile: async (type) => {
    return await ipcRenderer.invoke('selectFile', type)
  },
  compileProject: async (projectName, conf, pres, style, env, assets) => {
    return await ipcRenderer.invoke('compileProject', projectName, conf, pres, style, env, assets)
  },
  importProject: async () => {
    return await ipcRenderer.invoke('importProject')
  },
  getSlidesContent: () => ipcRenderer.invoke('getSlidesContent'),
  readFirstSlideContent: () => ipcRenderer.invoke('readFirstSlideContent'),
  runCommand: (command) => ipcRenderer.invoke('runCommand', command),
  versions: process.versions
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
