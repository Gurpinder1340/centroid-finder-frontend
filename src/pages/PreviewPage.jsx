
import BinarizedPreview from '../components/BinarizedPreview'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Slider,
  Box,
  Paper,
  Alert
} from '@mui/material'
import API from '../services/api'

function PreviewPage() {
  const { filename } = useParams()

  const [targetColor, setTargetColor] = useState('#ff0000')
  const [threshold, setThreshold] = useState(30)
  const [jobId, setJobId] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  useEffect(() => {
    if (!jobId) return

    let timeoutId
    let cancelled = false

    const checkStatus = async () => {
      try {
        const data = await API.getJobStatus(jobId)
        if (cancelled) return

        setStatus(data.status)

        if (data.status === 'completed') {
          setResult(data.result)
        } else if (
          data.status === 'running' ||
          data.status === 'pending' ||
          data.status === 'queued'
        ) {
          timeoutId = setTimeout(checkStatus, 2000)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    checkStatus()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [jobId])

  const handleProcess = async () => {
    try {
      setError('')
      setResult('')
      setJobId('')
      setStatus('Submitting job...')

      const data = await API.processVideo(
        filename,
        targetColor.replace('#', ''),
        threshold
      )

      setJobId(data.jobId)
      setStatus(data.status)
    } catch (err) {
      setError(err.message)
      setStatus('')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} to="/videos">
        Back to Videos
      </Button>

      <Typography variant="h4" sx={{ my: 3 }}>
        Video Preview
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        {filename}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Preview Settings
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Target Color
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
              type="color"
              aria-label="Target color"
              value={targetColor}
              onChange={(e) => setTargetColor(e.target.value)}
              style={{
                width: '65px',
                height: '45px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '3px'
              }}
            />

            <Typography>{targetColor.toUpperCase()}</Typography>
          </Box>
        </Box>

        <Typography gutterBottom>
          Threshold: {threshold}
        </Typography>

        <Slider
          value={threshold}
          onChange={(_, value) => setThreshold(value)}
          min={0}
          max={441}
          valueLabelDisplay="auto"
        />

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            setTargetColor('#ff0000')
            setThreshold(30)
          }}
        >
          Reset Settings
        </Button>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr'
          },
          gap: 3,
          mb: 3
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Original Frame
          </Typography>

          <img
            src={API.getThumbnail(filename)}
            alt="Original video thumbnail"
            style={{ width: '100%' }}
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Binarized Frame
          </Typography>

          <BinarizedPreview
            imageUrl={API.getThumbnail(filename)}
            targetColor={targetColor}
            threshold={threshold}
          />
        </Paper>
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleProcess}
        disabled={status === 'running' || status === 'Submitting job...'}
      >
        Process Video with These Settings
      </Button>

      {status && (
        <Typography sx={{ mt: 3 }}>
          Status: {status}
        </Typography>
      )}

      {jobId && (
        <Typography sx={{ mt: 1 }}>
          Job ID: {jobId}
        </Typography>
      )}

      {result && (
        <Button
          href={result}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Download CSV Results
        </Button>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  )
}

export default PreviewPage
