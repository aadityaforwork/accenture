// pages/api/roadmap.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      const { problem, interests } = req.body;
  
      try {
        const response = await axios.post('http://localhost:5000/roadmap', { problem, interests });
        // Parse the response data if it's a string
        const cleanedData = JSON.parse(response.data);
        res.status(200).json(cleanedData);
      } catch (error) {
        console.error('Error fetching roadmap:', error);
        res.status(500).json({ error: 'Failed to generate roadmap' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
