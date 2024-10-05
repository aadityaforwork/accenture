// components/JournalEntries.tsx
import React, { useEffect, useState } from 'react';

interface JournalEntry {
  date: string;
  title: string;
  text: string;
  score: number;
}

const JournalEntries: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/getEntries', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch journal entries');
        }

        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        setError('Failed to load journal entries');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return <div>Loading journal entries...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (entries.length === 0) {
    return <div>No journal entries available.</div>;
  }

  return (
    <div className="journal-entries max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Journal Entries</h2>
      <ul className="space-y-4">
        {entries.map((entry, index) => (
          <li key={index} className="p-4 border border-green-300 rounded-md">
            <h3 className="text-xl font-semibold">{entry.title}</h3>
            <p className="text-sm text-gray-600">Date: {entry.date}</p>
            <p className="mt-2">{entry.text}</p>
            <p className="mt-2 font-bold">Depression Score: {entry.score}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalEntries;
