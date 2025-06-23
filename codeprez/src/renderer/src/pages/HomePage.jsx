import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <main>
      <h1>HOME</h1>
      <Link to="/project">project</Link>
      <Link to="/app">app</Link>
    </main>
  )
}
