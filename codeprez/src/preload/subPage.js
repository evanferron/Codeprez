const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getProps: (callback) => {
    ipcRenderer.on('get-props', (e, data) => {
      callback(data.currentSlide, data.nextSlide, data.styleCss, data.timer)
    })
  }
})
