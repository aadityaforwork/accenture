// components/AddJournalEntry.tsx
import React, { useState } from 'react';

const AddJournalEntry: React.FC = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send the POST request to the Flask backend
      const response = await fetch('/api/journalService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,      // Journal entry text
          title,     // Optional title
          date       // The selected date
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add journal entry');
      }

      setSuccess('Journal entry added successfully!');
      setText('');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]); // Reset date to today's date
    } catch (err:any) {
      console.error('Error adding journal entry:', err);
      setError(err.message || 'Failed to add journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add a New Journal Entry</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold">Title:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-bold">Entry Text:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div>
          <label className="block font-bold">Date:</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`p-2 w-full text-white font-semibold rounded ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Entry'}
        </button>
      </form>
    </div>
  );
};

export default AddJournalEntry;
