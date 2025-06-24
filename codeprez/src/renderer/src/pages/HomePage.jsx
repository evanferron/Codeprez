import { Link, useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  const handleImport = async () => {
    await window.api.importProject()
    navigate('/project')
  }

  const selectConf = async () => {
    await window.api.selectConf()
  }

  const selectPres = async () => {
    await window.api.selectPres()
  }

  const selectStyle = async () => {
    await window.api.selectStyle()
  }

  const selectEnv = async () => {
    await window.api.selectEnv()
  }

  const compileProject = async () => {
    await window.api.selectEnv()
  }

  return (
    <main>
      <h1>HOME</h1>
      <section className="home-section" id="create-project">
        <button onClick={selectConf}>Select your conf</button>
        <button onClick={selectPres}>Select your conf</button>
        <button onClick={selectStyle}>Select your conf</button>
        <button onClick={selectEnv}>Select your conf</button>
        <button onClick={compileProject}>Compile project</button>
      </section>
      <section className="home-section" id="import-project">
        <button onClick={handleImport}>import project</button>
      </section>
      <Link to="/project">project</Link>
      <Link to="/app">app</Link>
      <Link to="/subproject"
        state={{
          currentSlide: `<h2 class="test">Ma slide courante</h2>`,
          nextSlide: `<h2 class="test">Ma slide suivante</h2>`,
          styleCss: `.test { color: red; }`
        }} > 
      subproject</Link>
    </main>
  )
}