import React, { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import QuizComponent from "components/QuizComponent"

const CallDataPage: React.FC = () => {
  const [callRecords, setCallRecords] = useState<any[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string>('');
  const [callAnalysis, setCallAnalysis] = useState<any>(null);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const fetchCallRecords = async () => {
    setLoadingRecords(true);
    setError(null);
    try {
      const response = await axios.get('https://accenture-6j0l.onrender.com/call_records');
      setCallRecords(response.data.calls);
    } catch (error) {
      setError('Failed to fetch call records');
    } finally {
      setLoadingRecords(false);
    }
  };

  const analyzeCall = async () => {
    if (!selectedCallId) {
      setError('Please select a call to analyze');
      return;
    }

    setLoadingAnalysis(true);
    setError(null);
    try {
      const response = await axios.post('https://accenture-6j0l.onrender.com/analyze_call', { call_id: selectedCallId });
      setCallAnalysis(response.data);
    } catch (error) {
      setError('Failed to analyze call');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <>
    <QuizComponent/>
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Call Data Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Call Records</h2>
          <button
            onClick={fetchCallRecords}
            disabled={loadingRecords}
            className="mb-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingRecords ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Fetch Call Records'
            )}
          </button>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {callRecords.length > 0 ? (
            <ul className="space-y-2">
              {callRecords.map((call) => (
                <li
                  key={call.call_id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedCallId === call.call_id
                      ? 'bg-green-100 text-green-800'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCallId(call.call_id)}
                >
                  <strong>Call ID:</strong> {call.call_id} |{" "}
                  <strong>Caller:</strong> {call.from || "Unknown"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No call records available.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Call Analysis</h2>
          {selectedCallId && (
            <div className="mb-4">
              <p className="mb-2">Selected Call: <strong>{selectedCallId}</strong></p>
              <button
                onClick={analyzeCall}
                disabled={loadingAnalysis}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAnalysis ? (
                  <>
                    <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Call'
                )}
              </button>
            </div>
          )}
          {callAnalysis && (
            <div className="mt-4 space-y-2">
              <p><strong>Sentiment Polarity:</strong> {callAnalysis?.sentiment?.polarity ?? 'Not available'}</p>
              <p><strong>Sentiment Subjectivity:</strong> {callAnalysis?.sentiment?.subjectivity ?? 'Not available'}</p>
              <p><strong>Transcript:</strong></p>
              <p className="bg-gray-100 p-2 rounded-md text-sm">
                {callAnalysis?.transcript ?? 'Transcript not available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CallDataPage;