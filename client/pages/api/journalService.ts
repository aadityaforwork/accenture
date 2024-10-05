import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text, title, date } = req.body;

    try {
      
      const response = await axios.post('http://localhost:5000/journal_entry', {
        text,
        title,
        date,
      });

      res.status(200).json(response.data); 
    } catch (error) {
      console.error('Error adding journal entry:', error);
      res.status(500).json({ error: 'Failed to add journal entry' });
    }
  } else {
   
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
