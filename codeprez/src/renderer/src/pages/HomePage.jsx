import { Link } from 'react-router-dom'

export default function HomePage() {
  const chooseFile = () => window.electron.ipcRenderer.send('dialog:openFile')

  return (
    <main>
      <h1>HOME</h1>
      <button onClick={chooseFile}>choose file</button>
      <Link to="/project">project</Link>
      <Link to="/app">app</Link>
    </main>
  )
}
