
import { useEffect, useRef, useState } from 'react'
import { Alert, CircularProgress, Box } from '@mui/material'
import { processImage } from '../utils/imageProcessing'

function BinarizedPreview({ imageUrl, targetColor, threshold }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const image = new Image()

    image.onload = () => {
      if (cancelled) return

      try {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const context = canvas.getContext('2d', {
          willReadFrequently: true
        })

        context.drawImage(image, 0, 0)

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )

        const processed = processImage(
          imageData,
          targetColor,
          threshold
        )

        context.putImageData(processed.imageData, 0, 0)

        if (processed.centroid) {
          context.beginPath()
          context.arc(
            processed.centroid.x,
            processed.centroid.y,
            6,
            0,
            Math.PI * 2
          )
          context.fillStyle = '#00ff00'
          context.fill()
          context.lineWidth = 2
          context.strokeStyle = '#000000'
          context.stroke()
        }

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    image.onerror = () => {
      if (!cancelled) {
        setError('Failed to load thumbnail')
        setLoading(false)
      }
    }

    image.src = imageUrl

    return () => {
      cancelled = true
      image.onload = null
      image.onerror = null
    }
  }, [imageUrl, targetColor, threshold])

  return (
    <Box>
      {loading && <CircularProgress size={24} />}

      {error && <Alert severity="error">{error}</Alert>}

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          display: loading || error ? 'none' : 'block'
        }}
      />
    </Box>
  )
}

export default BinarizedPreview
