import { contextBridge, ipcRenderer } from 'electron'

const api = {
  selectFile: async (type) => await ipcRenderer.invoke('selectFile', type),
  compileProject: async (projectName, conf, pres, style, env, assets, manualConfig = null) =>
    await ipcRenderer.invoke('compileProject', projectName, conf, pres, style, env, assets, manualConfig),
  importProject: async () => await ipcRenderer.invoke('importProject'),
  getSlidesContent: async (path) => await ipcRenderer.invoke('getSlidesContent', path),
  readFirstSlideContent: async (path) => await ipcRenderer.invoke('readFirstSlideContent', path),
  runCommand: async (command, path) => await ipcRenderer.invoke('runCommand', command, path),
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
