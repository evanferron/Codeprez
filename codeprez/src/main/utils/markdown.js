const fs = require('fs')
const markdownIt = require('markdown-it')
const hljs = require('highlight.js')
const path = require('path')

export const renderMarkdown = (markdown) => {
  const md = new markdownIt({
    html: true,
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          if (lang === 'bash') {
            const commandStr = code.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
            return (
              '<pre class="hljs">' +
              '<code class="hljs">' +
              hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
              `</code><button class="run-command" data-command="${commandStr}">Exécuter</button><pre class="command-result"></pre></pre>`
            )
          }
          return (
            '<pre class="hljs">' +
            '<code class="hljs">' +
            hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>'
          )
        } catch (e) {}
      }
      return `<pre class="hljs"><code class="hljs">${md.utils.escapeHtml(code)}</code></pre>`
    }
  })

  let html = md.render(markdown)
  // Ajoute la classe hljs à tous les <code> qui n'en ont pas
  html = html.replace(/<code(?! class)/g, '<code class="hljs"')
  return html
}

export const fixImagePaths = (html, basePath) => {
  return html.replace(/<img src="(.+?)"/g, (match, src) => {
    // Si src est une URL externe, on ne modifie pas
    if (/^https?:\/\//.test(src)) return match
    // Nettoie le chemin relatif
    let cleanSrc = src.replace(/^\.\//, '')
    // Si déjà dans assets/, on ne double pas
    if (cleanSrc.startsWith('assets/')) {
      cleanSrc = cleanSrc.replace(/^assets\//, 'assets/')
    }
    // Construit le chemin absolu
    const absPath = path.join(basePath, '..', cleanSrc).replace(/\\/g, '/')
    return `<img src="${absPath}"`
  })
}

function replaceCodeLinks(markdown, basePath) {
  return markdown.replace(
    /\[Code\]\((\.\/assets\/[^")#]+)#(\d+)-(\d+)\)/g,
    (match, file, start, end) => {
      const filePath = path.join(basePath, file)
      try {
        const content = fs.readFileSync(filePath, 'utf8').split('\n')
        const code = content.slice(Number(start) - 1, Number(end)).join('\n')
        return `\n\`\`\`js\n${code}\n\`\`\`\n`
      } catch (e) {
        return `<span style="color:red">Erreur lecture fichier: ${filePath}</span>`
      }
    }
  )
}

export const getSlidesContent = (basePath) => {
  const markdownFilePath = path.join(basePath, 'presentation.md')
  const assetsPath = path.join(basePath, 'assets')

  return new Promise((resolve, reject) => {
    fs.readFile(markdownFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }
      // Découpe les slides sur les séparateurs ---
      const slides = data.split(/^[\s\r\n]*---[\s\r\n]*$/gm).map((slide) => slide.trim())
      const renderedSlides = slides.map((slide) => {
        // Remplace les liens [Code](...) par le code extrait
        const slideWithCode = replaceCodeLinks(slide, basePath)
        // Rend le markdown en HTML
        const html = renderMarkdown(slideWithCode)
        // Corrige les chemins d'images
        return fixImagePaths(html, assetsPath)
      })
      resolve(renderedSlides)
    })
  })
}

export const readFirstSlideContent = (basePath) => {
  const configFilePath = path.join(basePath, 'config.json')
  return new Promise((resolve, reject) => {
    fs.readFile(configFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }
      try {
        const configData = JSON.parse(data)
        resolve(configData)
      } catch (parseError) {
        reject(parseError)
      }
    })
  })
}
