import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { roadmap_id } = req.query

    if (!roadmap_id || typeof roadmap_id !== 'string') {
      res.status(400).json({ error: 'Invalid roadmap ID' })
      return
    }

    try {
      // Fetch roadmap from Flask backend
      const response = await fetch(`http://localhost:5000/roadmap/${roadmap_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.ok) {
        res.status(200).json(data)
      } else {
        console.error('Flask backend error:', data)
        res.status(500).json({ error: 'Failed to fetch roadmap' })
      }
    } catch (error) {
      console.error('Error communicating with Flask backend:', error)
      res.status(500).json({ error: 'Failed to fetch roadmap' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

export default handler
