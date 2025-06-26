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

  openSubPresentationPage: async (currentSlide, nextSlide, styleCss, timer) => {
    await ipcRenderer.invoke('openSubPresentationPage', currentSlide, nextSlide, styleCss, timer)
  },

  changeSlideSubPresentation: async (currentSlide, nextSlide, styleCss, timer) => {
    await ipcRenderer.invoke('changeSlideSubPresentation', currentSlide, nextSlide, styleCss, timer)
  },

  closeSubPresentation: async () => {
    await ipcRenderer.invoke('closeSubPresentation')
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

contextBridge.exposeInMainWorld("subPresentation",{
    getProps : (callback) => {
        ipcRenderer.on("get-props", (e, data) => {
            callback(data.currentSlide, data.nextSlide, data.styleCss, data.timer);
        });
    },

    changeSlide : (callback) => {
        ipcRenderer.on("change-slide", (e, data) => {
          console.log("Change slide event received:", data);
            callback(data.currentSlide, data.nextSlide, data.styleCss, data.timer);
        });
    } 
});

