import { useState, useEffect } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'

function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    API.getVideos()
      .then((data) => {
        setVideos(data.videos)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <h2>Loading videos...</h2>
  }

  if (error) {
    return <h2>{error}</h2>
  }

  return (
    <div>
      <h1>Centroid Finder</h1>
      <h2>Choose a Video</h2>

      {videos.map((video) => (
        <div key={video}>
          <Link to={`/preview/${video}`}>
            <h3>{video}</h3>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default VideosPage