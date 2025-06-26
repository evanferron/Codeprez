import { contextBridge, ipcRenderer } from 'electron'

const api = {
  selectFile: async (type) => await ipcRenderer.invoke('selectFile', type),
  compileProject: async (projectName, conf, pres, style, env, assets) =>
    await ipcRenderer.invoke('compileProject', projectName, conf, pres, style, env, assets),
  importProject: async () => await ipcRenderer.invoke('importProject'),
  getSlidesContent: async () => await ipcRenderer.invoke('getSlidesContent'),
  readFirstSlideContent: async () => await ipcRenderer.invoke('readFirstSlideContent'),
  runCommand: async (command) => await ipcRenderer.invoke('runCommand', command),
  getCss: async (path) => await ipcRenderer.invoke('getCss', path),
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
