import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>
        You can go back to the <Link href="/">home page</Link>
      </p>
    </main>
  )
}
