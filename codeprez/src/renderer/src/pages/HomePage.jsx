import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/home.css'

export default function HomePage() {
  const navigate = useNavigate()

  const [projectName, setProjectName] = useState('')
  const [members, setMembers] = useState('')
  const [duration, setDuration] = useState('')
  const [title, setTitle] = useState('')
  const [conf, setConf] = useState('')
  const [pres, setPres] = useState('')
  const [styleFile, setStyleFile] = useState('')
  const [env, setEnv] = useState('')
  const [assets, setAssets] = useState('')
  const [error, setError] = useState(null)

  const handleImport = async () => {
    const result = await window.api.importProject()
    if (result.status === 'cancelled') {
      return
    }
    if (result.status === 'error') {
      setError(result.error)
      return
    }
    navigate('/project', { state: { projectName: result.projectPath } })
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
    if (!projectName || !pres || !styleFile || !env || !assets) {
      setError('All required fields must be filled.')
      return
    }

    if (!conf && (!title || !members || !duration)) {
      setError('You must either provide a config.json file or fill in all manual fields (title, members, duration).')
      return
    }

    const manualConfig = !conf ? {
      title: title,
      authors: members.split(',').map(m => m.trim()),
      duration: duration.toString()
    } : null

    const result = await window.api.compileProject(projectName, conf, pres, styleFile, env, assets, manualConfig)
    if (result.success) {
      alert('Project compiled successfully!')
      console.log('Project compiled successfully:', result.projectPath)
      navigate('/project', { state: { projectName: result.projectPath } })
    } else {
      alert('Error compiling project: ' + result.error)
    }
  }

  return (
    <main className="home-main">
      <div className="home-container">
        <section className="home-section">
          <h2>Create New Project</h2>
          
          <div className="input-group">
            <label htmlFor="project-name">Project Name</label>
            <input
              type="text"
              id="project-name"
              placeholder="Enter your project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="file-input-group">
            <div className="file-input-row">
              <label>Configuration File</label>
              <button onClick={() => selectFile('json', setConf)}>Select config.json</button>
              <p>{conf || 'No file selected'}</p>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="manual-fields">
              <div className="input-group">
                <label htmlFor="title">Presentation Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter presentation title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!!conf}
                />
              </div>

              <div className="input-group">
                <label htmlFor="members">Project Members</label>
                <input
                  type="text"
                  id="members"
                  placeholder="Enter member names (comma-separated)..."
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  disabled={!!conf}
                />
              </div>

              <div className="input-group">
                <label htmlFor="duration">Duration</label>
                <input
                  type="text"
                  id="duration"
                  placeholder="Enter presentation duration..."
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={!!conf}
                />
              </div>
            </div>

            <div className="file-input-row">
              <label>Presentation Content</label>
              <button onClick={() => selectFile('md', setPres)}>Select presentation.md</button>
              <p>{pres || 'No file selected'}</p>
            </div>

            <div className="file-input-row">
              <label>Style File</label>
              <button onClick={() => selectFile('css', setStyleFile)}>Select style.css</button>
              <p>{styleFile || 'No file selected'}</p>
            </div>

            <div className="file-input-row">
              <label>Environment Folder</label>
              <button onClick={() => selectFile('folder', setEnv)}>Select env folder</button>
              <p>{env || 'No folder selected'}</p>
            </div>

            <div className="file-input-row">
              <label>Assets Folder</label>
              <button onClick={() => selectFile('folder', setAssets)}>Select assets folder</button>
              <p>{assets || 'No folder selected'}</p>
            </div>
          </div>

          <button className="action-button" onClick={compileProject}>
            Create Project
          </button>

          {error && <div className="error-message">{error}</div>}
        </section>

        <section className="home-section import-section">
          <h2>Import Project</h2>
          <p>Already have a project? Import your existing presentation and continue working on it.</p>
          <button className="action-button" onClick={handleImport}>
            Import Existing Project
          </button>
        </section>
      </div>
    </main>
  )
}
