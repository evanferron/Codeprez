import { useEffect, useState } from 'react'
import './ProjectPage.css'
import 'highlight.js/styles/github.css'

export default function ProjectPage() {
  const [firstSlide, setFirstSlide] = useState({ title: '', members: [] })
  const [slides, setSlides] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Charge les slides et le premier slide au chargement du composant
  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true)

      const firstSlide = await window.api.readFirstSlideContent()
      setFirstSlide(firstSlide)

      const slides = await window.api.getSlidesContent()
      setSlides(slides)

      setIsLoading(false)
    }

    fetchSlides()
  }, [])

  // Gère le changement de slide avec les flèches gauche/droite
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (slides && prev < slides.length - 1 ? prev + 1 : prev))
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides])

  // Ajoute les listeners aux boutons de commande après chaque rendu de slide
  useEffect(() => {
    // Sélectionne tous les boutons après chaque rendu de slide
    const buttons = document.querySelectorAll('.run-command')
    buttons.forEach((btn) => {
      // Pour éviter d'ajouter plusieurs fois le même listener
      if (!btn.dataset.listener) {
        btn.addEventListener('click', async () => {
          const command = btn.getAttribute('data-command')
          const result = await window.api.runCommand(command)
          btn.parentElement.querySelector('.command-result').textContent = result
        })
        btn.dataset.listener = 'true'
      }
    })
  }, [slides, currentSlide])

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
      {currentSlide === 0 ? (
        <section className="first-slide">
          <h1 className="project-title">{firstSlide.title}</h1>
          <div className="members">
            {firstSlide.authors.map((author, index) => (
              <span key={index} className="member">
                {author}
              </span>
            ))}
          </div>
        </section>
      ) : (
        <section dangerouslySetInnerHTML={{ __html: slides[currentSlide - 1] }}></section>
      )}
    </main>
  )
}
