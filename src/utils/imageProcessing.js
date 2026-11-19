
export function processImage(imageData, targetColor, threshold) {
  const { width, height, data } = imageData

  const r = parseInt(targetColor.slice(1, 3), 16)
  const g = parseInt(targetColor.slice(3, 5), 16)
  const b = parseInt(targetColor.slice(5, 7), 16)

  const binary = new Uint8Array(width * height)
  const output = new Uint8ClampedArray(data.length)

  for (let i = 0; i < width * height; i++) {
    const index = i * 4

    const distance = Math.sqrt(
      (data[index] - r) ** 2 +
      (data[index + 1] - g) ** 2 +
      (data[index + 2] - b) ** 2
    )

    const match = distance < threshold ? 1 : 0
    binary[i] = match

    const color = match ? 255 : 0

    output[index] = color
    output[index + 1] = color
    output[index + 2] = color
    output[index + 3] = 255
  }

  const visited = new Uint8Array(width * height)
  let largestGroup = []

  for (let i = 0; i < binary.length; i++) {
    if (!binary[i] || visited[i]) continue

    const stack = [i]
    const group = []
    visited[i] = 1

    while (stack.length > 0) {
      const current = stack.pop()
      group.push(current)

      const x = current % width
      const y = Math.floor(current / width)

      const neighbors = []

      if (x > 0) neighbors.push(current - 1)
      if (x < width - 1) neighbors.push(current + 1)
      if (y > 0) neighbors.push(current - width)
      if (y < height - 1) neighbors.push(current + width)

      for (const next of neighbors) {
        if (binary[next] && !visited[next]) {
          visited[next] = 1
          stack.push(next)
        }
      }
    }

    if (group.length > largestGroup.length) {
      largestGroup = group
    }
  }

  let centroid = null

  if (largestGroup.length > 0) {
    let sumX = 0
    let sumY = 0

    for (const pixel of largestGroup) {
      sumX += pixel % width
      sumY += Math.floor(pixel / width)
    }

    centroid = {
      x: Math.floor(sumX / largestGroup.length),
      y: Math.floor(sumY / largestGroup.length)
    }
  }

  return {
    imageData: new ImageData(output, width, height),
    centroid
  }
}
