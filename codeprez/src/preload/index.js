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
  }
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
