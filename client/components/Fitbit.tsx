import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import MasonryGridGallery from './Gallery';


interface FitbitData {
  peak_heart_rate: number; 
  heart_text: string;
  steps_today: number; 
  steps_text: string;
}

const Fitbit = () => {
  const [accessToken, setAccessToken] = useState(''); // Access token state
  const [userId, setUserId] = useState(''); // User ID state
  const [data, setData] = useState<FitbitData | null>(null); // Fitbit data state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Function to fetch data from the Fitbit API
  const fetchData = async () => {
    try {
      setIsLoading(true); 
      const token = 'eyJhbGciOiJIUzI1NiJ9...'; 
      const id = 'BYDFV6'; 

      setAccessToken(token); 
      setUserId(id); 

      // Prepare form data
      const formData = new FormData();
      formData.append('access_token', token);
      formData.append('user_id', id);

      // Make API request to your backend
      const response = await axios.post('http://localhost:5000/fitbit_data', formData);
      setData(response.data); // Store the fetched data in state
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error); // Handle errors
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Separate component for displaying Fitbit instructions
  const FitbitInstructions = () => (
    <div className="p-7 rounded-lg shadow-lg bg-white mt-10 border border-r-2">
      <h1 className="text-xl font-bold text-green-600">Connect to Fitbit</h1>
      <p className="text-green-600 mt-3">
        To connect your Fitbit device to our website and access your data, follow these steps:
      </p>
      <ol className="list-decimal text-green-600 mt-3">
        <li>Ensure you have your Fitbit device nearby and turned on.</li>
        <li>Click the "Connect to Watch" button above.</li>
        <li>You'll be redirected to Fitbit's authorization page.</li>
        <li>Log in to your Fitbit account and authorize our website to access your data.</li>
        <li>Once authorized, you'll be redirected back to our website, and your Fitbit data will be displayed.</li>
      </ol>
    </div>
  );

  // Component to display Fitbit data
  const FitbitDataDisplay = () => (
    data ? (
      <div className="mt-5">
        <h2 className="text-lg font-semibold text-green-600">Heart Data</h2>
        <p className="text-green-600">Peak Heart Rate: {data.peak_heart_rate}</p>
        <p className="text-green-600">{data.heart_text}</p>
        <h2 className="text-lg font-semibold text-green-600 mt-4">Steps Data</h2>
        <p className="text-green-600">Steps today: {data.steps_today}</p>
        <p className="text-green-600">{data.steps_text}</p>
      </div>
    ) : null
  );

  return (
    <>
      <Navbar />
      <div className="bg-white h-full pb-10">
        <div className="grid grid-cols-2">
          <div>
            <div className="max-w-xl mx-20 p-5 rounded-lg shadow-lg bg-white mt-10 border border-r-2">
              <h1 className="text-xl font-bold text-green-600">Fitbit Data</h1>
              <button
                onClick={fetchData}
                className="mt-5 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                disabled={isLoading} // Disable the button when loading
              >
                Connect to Watch
              </button>
              
              {isLoading ? (
                <p className="my-4">Loading the reality...</p> 
              ) : (
                <FitbitDataDisplay />
              )}

              <FitbitInstructions /> 
            </div>
          </div>
          <div>
            <MasonryGridGallery /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default Fitbit;
