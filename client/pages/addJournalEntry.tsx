import React, { useState } from 'react';
import { Loader2, PenLine, Calendar, Type, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from 'components/Navbar';
import RoadmapComponent from 'components/RoadmapComponent';

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
    <>
    <RoadmapComponent/>
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <PenLine className="h-6 w-6 mr-2 text-green-500" />
            Add a New Journal Entry
          </h2>
        </div>

        {(error || success) && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${
            error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {error ? (
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <p>{error || success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
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
    </>
  );
};

export default AddJournalEntry;