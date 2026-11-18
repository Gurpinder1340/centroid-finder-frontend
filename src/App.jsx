import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import VideosPage from './pages/VideosPage'
import PreviewPage from './pages/PreviewPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/videos" />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/preview/:filename" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
