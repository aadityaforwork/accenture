import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Book } from 'lucide-react';
import RoadmapComponent from 'components/RoadmapComponent';

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        <p className="mt-2 text-gray-600">Loading journal entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-red-500">
        <AlertCircle className="h-8 w-8" />
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <>
    <RoadmapComponent/>
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <Book className="h-6 w-6 mr-2 text-green-500" />
            Journal Entries
          </h2>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Book className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">No journal entries available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {entries.map((entry, index) => (
              <div 
                key={index} 
                className="p-4 sm:p-6 border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white h-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
                  <time className="text-sm text-gray-500 mt-1 sm:mt-0">
                    {new Date(entry.date).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{entry.text}</p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Depression Score: {entry.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default JournalEntries;