import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const formData = req.body

    try {
      // Send data to your Flask backend
      const response = await fetch('http://localhost:5000/roadmap/roadmap_quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        res.status(200).json(data)
      } else {
        console.error('Flask backend error:', data)
        res.status(500).json({ error: 'Failed to generate roadmap' })
      }
    } catch (error) {
      console.error('Error communicating with Flask backend:', error)
      res.status(500).json({ error: 'Failed to generate roadmap' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

export default handler
