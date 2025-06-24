const fs = require('fs')
const markdownIt = require('markdown-it')
const hljs = require('highlight.js')
const path = require('path')

export const renderMarkdown = (markdown) => {
  const md = new markdownIt({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre><code class="hljs">${
            hljs.highlight(str, { language: lang }).value
          }</code></pre>`
        } catch (__) {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })
  return md.render(markdown)
}

// Prend en param le path du fichier presentation.md
export const getSlidesContent = () => {
  const markdownFilePath = path.join(__dirname, 'test', 'presentation.md')
  return new Promise((resolve, reject) => {
    fs.readFile(markdownFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        const slides = data.split(/^\s*---\s*$/gm).map((slide) => slide.trim())
        const renderedSlides = slides.map((slide) => this.renderMarkdown(slide))
        resolve(renderedSlides)
      }
    })
  })
}

// Prend en param le path du fichier config.json
export const readFirstSlideContent = () => {
  const configFilePath = path.join(__dirname, 'test', 'config.json')
  return new Promise((resolve, reject) => {
    fs.readFile(configFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        try {
          const configData = JSON.parse(data)
          resolve(configData)
        } catch (parseError) {
          reject(parseError)
        }
      }
    })
  })
}
