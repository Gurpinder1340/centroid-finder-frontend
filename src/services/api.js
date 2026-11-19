const API = {
    getThumbnail: (filename) => {
      return `/thumbnail/${encodeURIComponent(filename)}`
    },
    
  getVideos: async () => {
    const response = await fetch('/api/videos')

    if (!response.ok) {
      throw new Error('Failed to fetch videos')
    }

    return response.json()
  },

  processVideo: async (filename, targetColor, threshold) => {
    const response = await fetch(`/process/${filename}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetColor,
        threshold,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to process video')
    }

    return response.json()
  },
  getJobStatus: async (jobId) => {
  const response = await fetch(`/process/${jobId}/status`)

  if (!response.ok) {
    throw new Error('Failed to get job status')
  }

  return response.json()

},

}


export default API
