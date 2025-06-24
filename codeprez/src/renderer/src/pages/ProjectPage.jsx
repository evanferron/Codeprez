import { useEffect, useState } from 'react'
import './ProjectPage.css'

export default function ProjectPage() {
  const [firstSlide, setFirstSlide] = useState({ title: '', members: [] })
  const [slides, setSlides] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true)

      // const firstSlide = await window.api.readFirstSlideContent()
      setFirstSlide({
        title: 'Bienvenue dans CodePrez',
        members: ['Jean', 'Pierre', 'Jacques']
      })

      // const slides = await window.api.getSlidesContent()
      setSlides([
        "<h1>Slide 1</h1><p>Ceci est le contenu de la première diapositive.</p>",
        "<h1>Slide 2</h1><p>Ceci est le contenu de la deuxième diapositive.</p>",
        "<h1>Slide 3</h1><p>Ceci est le contenu de la troisième diapositive.</p>",
        "<h1>Slide 4</h1><p>Ceci est le contenu de la quatrième diapositive.</p>"
      ])

      setIsLoading(false)
    }

    fetchSlides()
  }, [])

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
            {firstSlide.members.map((member, index) => (
              <span key={index} className="member">
                {member}
              </span>
            ))}
          </div>
        </section>
      ) : (
        <section
          dangerouslySetInnerHTML={{ __html: slides[currentSlide] }}
        ></section>
      )}
    </main>
  )
}
