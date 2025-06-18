import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { apiKey, ...wheelData } = body

  const response = await fetch('https://wheelofnames.com/api/v1/wheels/shared', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify(wheelData)
  })

  const data = await response.json()
  return data
}) 