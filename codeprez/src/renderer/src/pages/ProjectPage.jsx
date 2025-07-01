import { useEffect, useState } from 'react'
import 'highlight.js/styles/github.css'
import '../styles/ProjectPage.css'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ProjectPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const projectPath = location.state?.projectName
  const [firstSlide, setFirstSlide] = useState({ title: '', members: [], duration: '0' })
  const [firstSlideContent, setFirstSlideContent] = useState(null)
  const [slides, setSlides] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [css, setCss] = useState('')

  const changeSlide = async () => {
    await window.api.changeSlideSubPresentation(
      currentSlide === 0 ? firstSlideContent : slides[currentSlide - 1],
      slides[currentSlide],
      css,
      firstSlide.duration
    )
  }

  // Charge les slides et le premier slide au chargement du composant
  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true)

      const firstSlide = await window.api.readFirstSlideContent(projectPath)
      const firstSlideContentBuild = `
        <div className="first-slide">
          <h1 class="project-title">${firstSlide.title}</h1>
          <div class="members">
            ${firstSlide.authors.map((author) => `<span class="member">${author}</span>`).join('')}
          </div>
        </div>
      `
      setFirstSlideContent(firstSlideContentBuild)
      setFirstSlide(firstSlide)

      const slides = await window.api.getSlidesContent(projectPath)
      setSlides(slides)

      const cssLoaded = await window.api.getCss(projectPath + '/style.css')
      setCss(cssLoaded)
      setIsLoading(false)

      await window.api.openSubPresentationPage(
        currentSlide === 0 ? firstSlideContentBuild : slides[0],
        slides && slides.length > 0 ? slides[0] : '',
        cssLoaded,
        firstSlide.duration
      )
      await changeSlide()
    }

    fetchSlides()
  }, [projectPath, css])

  // Gère le changement de slide avec les flèches gauche/droite et la touche Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (slides && prev < slides.length - 1 ? prev + 1 : prev))
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))
      }
      if (e.key === 'Escape') {
        window.api.closeSubPresentation()
        navigate('/')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides, navigate])

  useEffect(() => {
    if (slides) changeSlide()
  }, [slides, currentSlide])

  // Ajoute les listeners aux boutons de commande après chaque rendu de slide
  useEffect(() => {
    // Sélectionne tous les boutons après chaque rendu de slide
    const buttons = document.querySelectorAll('.run-command')
    buttons.forEach((btn) => {
      // Pour éviter d'ajouter plusieurs fois le même listener
      if (!btn.dataset.listener) {
        btn.addEventListener('click', async () => {
          const command = btn.getAttribute('data-command')
          const result = await window.api.runCommand(command, projectPath)
          btn.parentElement.querySelector('.command-result').textContent = result
        })
        btn.dataset.listener = 'true'
      }
    })
  }, [slides, currentSlide, projectPath])

  if (isLoading) {
    return (
      <main className="project-page">
        <div className="loading">
          <span></span>
        </div>
      </main>
    )
  }

  return (
    <main className="project-page">
      <style>{css}</style>
      {currentSlide === 0 ? (
        firstSlideContent != null ? (
          <section dangerouslySetInnerHTML={{ __html: firstSlideContent }} />
        ) : (
          <section className="first-slide">No content found</section>
        )
      ) : (
        <section dangerouslySetInnerHTML={{ __html: slides[currentSlide - 1] }}></section>
      )}
    </main>
  )
}
