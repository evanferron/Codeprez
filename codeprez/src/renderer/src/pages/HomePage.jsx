import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function HomePage() {
  const navigate = useNavigate()

  const [projectName, setProjectName] = useState('')
  const [conf, setConf] = useState('')
  const [pres, setPres] = useState('')
  const [style, setStyle] = useState('')
  const [env, setEnv] = useState('')
  const [assets, setAssets] = useState('')

  const [error, setError] = useState(null)

  const handleImport = async () => {
    await window.api.importProject()
    navigate('/project')
  }

  const selectFile = async (type, setter) => {
    const response = await window.api.selectFile(type)
    manageResponse(response, setter)
  }

  const compileProject = async () => {
    if (!projectName || !conf || !pres || !style || !env || !assets) {
      setError('All fields must be filled.')
      return
    }
    const result = await window.api.compileProject(projectName, conf, pres, style, env, assets)
    if (result.success) {
      alert('Project compiled successfully!')
      navigate('/project')
    } else {
      alert('Error compiling project: ' + result.error)
    }
  }

  const manageResponse = (response, setter) => {
    console.log('Response:', response.status)
    switch (response.status) {
      case 'cancelled':
        return
      case 'error':
        setError(response.error)
        break
      case 'success':
        setError(null)
        setter(response.filePath)
        break
      default:
        console.error('Unknown response status:', response.status)
    }
  }

  return (
    <main>
      <h1>HOME</h1>
      <section className="home-section" id="create-project">
        <input
          type="text"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <span>
          <button onClick={() => selectFile('json', setConf)}>Select your conf.json</button>
          <p>{conf}</p>
        </span>
        <span>
          <button onClick={() => selectFile('md', setPres)}>Select your pres.md</button>
          <p>{pres}</p>
        </span>
        <span>
          <button onClick={() => selectFile('css', setStyle)}>Select your style.css</button>
          <p>{style}</p>
        </span>
        <span>
          <button onClick={() => selectFile('folder', setEnv)}>Select your env folder</button>
          <p>{env}</p>
        </span>
        <span>
          <button onClick={() => selectFile('folder', setAssets)}>Select your assets folder</button>
          <p>{assets}</p>
        </span>
        <button onClick={compileProject}>Compile project</button>
      </section>
      <section className="home-section" id="import-project">
        <button onClick={handleImport}>import project</button>
      </section>
      {error && <p>{error}</p>}
      <Link to="/project">project</Link>
      <Link to="/app">app</Link>
    </main>
  )
}
