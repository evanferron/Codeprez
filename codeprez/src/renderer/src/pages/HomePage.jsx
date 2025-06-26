import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/home.css'

export default function HomePage() {
  const navigate = useNavigate()

  const [projectName, setProjectName] = useState('')
  const [conf, setConf] = useState('')
  const [pres, setPres] = useState('')
  const [styleFile, setStyleFile] = useState('')
  const [env, setEnv] = useState('')
  const [assets, setAssets] = useState('')

  const [error, setError] = useState(null)

  const handleImport = async () => {
    const result = await window.api.importProject()
    console.log('Import result:', result)
    if (result.status === 'cancelled') {
      return
    }
    if (result.status === 'error') {
      setError(result.error)
      return
    }
    navigate('/project', { projectName: result.projectPath })
  }

  const selectFile = async (type, setter) => {
    const response = await window.api.selectFile(type)
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

  const compileProject = async () => {
    if (!projectName || !conf || !pres || !styleFile || !env || !assets) {
      setError('All fields must be filled.')
      return
    }
    const result = await window.api.compileProject(projectName, conf, pres, styleFile, env, assets)
    if (result.success) {
      alert('Project compiled successfully!')
      console.log('Project compiled successfully:', result.projectPath)
      navigate('/project', { projectName: result.projectPath })
    } else {
      alert('Error compiling project: ' + result.error)
    }
  }

  return (
    <main>
      <section className="home-section" id="create-project">
        <h2>Create New Project</h2>
        <input
          type="text"
          placeholder="Enter your project name..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <div className="file-input-group">
          <div className="file-input-row">
            <button onClick={() => selectFile('json', setConf)}>Select conf.json</button>
            <p>{conf || 'No file selected'}</p>
          </div>
          <div className="file-input-row">
            <button onClick={() => selectFile('md', setPres)}>Select pres.md</button>
            <p>{pres || 'No file selected'}</p>
          </div>
          <div className="file-input-row">
            <button onClick={() => selectFile('css', setStyleFile)}>Select style.css</button>
            <p>{styleFile || 'No file selected'}</p>
          </div>
          <div className="file-input-row">
            <button onClick={() => selectFile('folder', setEnv)}>Select env folder</button>
            <p>{env || 'No folder selected'}</p>
          </div>
          <div className="file-input-row">
            <button onClick={() => selectFile('folder', setAssets)}>Select assets folder</button>
            <p>{assets || 'No folder selected'}</p>
          </div>
        </div>
        <button className="compile-button" onClick={compileProject}>
          Compile Project
        </button>
        {error && <div className="error-message">{error}</div>}
      </section>
      <section className="home-section" id="import-project">
        <h2>Import Existing Project</h2>
        <button onClick={handleImport}>Import Project</button>
      </section>
    </main>
  )
}
