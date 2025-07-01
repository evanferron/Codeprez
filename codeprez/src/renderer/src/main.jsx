import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import SubProjectPage from './pages/SubProjectPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/subproject" element={<SubProjectPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
