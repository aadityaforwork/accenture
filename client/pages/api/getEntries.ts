// pages/api/getEntries.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Make a GET request to your Flask backend to fetch all journal entries
      const response = await axios.get('http://127.0.0.1:5000/entries');

      res.status(200).json(response.data); // Send Flask's response back to the frontend
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      res.status(500).json({ error: 'Failed to fetch journal entries' });
    }
  } else {
    // If it's not a GET request, send a 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
