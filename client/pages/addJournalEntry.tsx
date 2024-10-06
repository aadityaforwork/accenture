import React, { useState, useEffect } from 'react';
import { Loader2, PenLine, Calendar, Type, AlertCircle, CheckCircle2, Book } from 'lucide-react';

interface JournalEntry {
  date: string;
  title: string;
  text: string;
  score: number;
}

const AddJournalEntry: React.FC = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/journalService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, title, date }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add journal entry');
      }

      setSuccess('Journal entry added successfully!');
      setText('');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err: any) {
      console.error('Error adding journal entry:', err);
      setError(err.message || 'Failed to add journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <PenLine className="h-6 w-6 mr-2 text-green-500" />
            Add a New Journal Entry
          </h2>
        </div>

        {(error || success) && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${
              error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}
          >
            {error ? (
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <p>{error || success}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div>
            <label className=" mb-2 text-sm font-medium text-gray-900 flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Title
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your journal entry"
            />
          </div>

          <div>
            <label className=" mb-2 text-sm font-medium text-gray-900 flex items-center">
              <PenLine className="h-4 w-4 mr-2" />
              Entry Text
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              required
              placeholder="Write your thoughts here..."
            />
          </div>

          <div>
            <label className="mb-2 text-sm font-medium text-gray-900 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 text-white font-semibold rounded-lg transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Adding Entry...
              </span>
            ) : (
              'Add Journal Entry'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

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

  // Sort the top 3 entries by score (lower is better) and by date (closer to today)
  const sortedEntries = [...entries]
    .sort((a, b) => a.score - b.score || new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        <p className="mt-2 text-gray-600">Time to jot down your thoughts!</p>
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
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* Left Column for Top 3 Depression Scores */}
      {/* <div className="lg:w-3/5 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
          <Book className="h-6 w-6 mr-2 text-green-500" />
          Top 3 Journal Entries
        </h2>

        {sortedEntries.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Book className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">No journal entries available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedEntries.map((entry, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
                  <time className="text-sm text-gray-500 mt-1 sm:mt-0">
                    {new Date(entry.date).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{entry.text}</p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                    Depression Score: {entry.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Right Column for Adding New Entry */}
      <div className="lg:w-full space-y-6">
        <AddJournalEntry />
      </div>
    </div>
  );
};

export default JournalEntries;
