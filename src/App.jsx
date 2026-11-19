
import withPageLayout from './components/withPageLayout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import VideosPage from './pages/VideosPage'
import PreviewPage from './pages/PreviewPage'

const VideosPageWithLayout = withPageLayout(VideosPage)
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/videos" />} />
        <Route path="/videos" element={<VideosPageWithLayout />} />
        <Route path="/preview/:filename" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
