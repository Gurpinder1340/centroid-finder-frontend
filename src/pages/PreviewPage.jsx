import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from '../services/api'

function PreviewPage() {
  const { filename } = useParams()

  const [jobId, setJobId] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  useEffect(() => {
    if (!jobId) {
      return
    }

    let timeoutId

    const checkStatus = async () => {
      try {
        const data = await API.getJobStatus(jobId)

        setStatus(data.status)

        if (data.status === 'completed') {
          setResult(data.result)
        } else if (data.status === 'running') {
          timeoutId = setTimeout(checkStatus, 2000)
        }
      } catch (error) {
        setError(error.message)
      }
    }

    checkStatus()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [jobId])

  const handleProcess = async () => {
    try {
      setError('')
      setResult('')
      setStatus('Submitting job...')

      const data = await API.processVideo(filename, 'FF0000', 30)

      setJobId(data.jobId)
      setStatus(data.status)
    } catch (error) {
      setError(error.message)
      setStatus('')
    }
  }

  return (
    <div>
      <h1>Video Preview</h1>
      <h2>{filename}</h2>

      <button onClick={handleProcess}>
        Process Video with These Settings
      </button>

      <p>Status: {status}</p>

      {jobId && <p>Job ID: {jobId}</p>}

      {result && (
        <p>
          <a href={result}>Download CSV Results</a>
        </p>
      )}

      {error && <p>{error}</p>}
    </div>
  )
}

export default PreviewPage
