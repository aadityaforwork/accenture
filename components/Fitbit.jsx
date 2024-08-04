import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import MasonryGridGallery from './Gallery';

function Fitbit() {
  const [access_token, setAccessToken] = useState('');
  const [user_id, setUserId] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  const fetchData = async () => {
    try {
      setIsLoading(true); // Start loading
      setAccessToken('eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1JSNzciLCJzdWIiOiJCWURGVjYiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcm94eSBycHJvIHJudXQgcnNsZSByYWN0IHJyZXMgcmxvYyByd2VpIHJociBydGVtIiwiZXhwIjoxNzA5Mzc5NTAyLCJpYXQiOjE3MDg3ODU1MDR9.9u7U0j9-gVmjq0_PxrLlnlo1sRk1si0_eRPjDOqLoF0');
      setUserId('BYDFV6');
      const formData = new FormData();
      formData.append('access_token', access_token);
      formData.append('user_id', user_id);

      const response = await axios.post('http://localhost:5000/fitbit_data', formData);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <>
    <Navbar />
    <div className=' bg-white h-full pb-10'>
    <div className=' grid grid-cols-2'>

        <div>
     <div className="max-w-xl mx-20  p-5 rounded-lg shadow-lg bg-white mt-10 border border-r-2">
        <h1 className="text-xl font-bold text-blue-600">Fitbit Data</h1>
        <button 
          onClick={fetchData} 
          className="mt-5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          disabled={isLoading} // Disable the button when loading
        >
          Connect to Watch
        </button>
       

        {isLoading ? (
          <p className=' my-4'>Loading the reality...</p> // Display loading message
        ) : data ? (
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-blue-600">Heart Data</h2>
            <p className="text-blue-600">Peak Heart Rate: {data.peak_heart_rate}</p>
            <p className="text-blue-600">{data.heart_text}</p>
            <h2 className="text-lg font-semibold text-blue-600 mt-4">Steps Data</h2>
            <p className="text-blue-600">Steps today: {data.steps_today}</p>
            <p className="text-blue-600">{data.steps_text}</p>
          </div>
        ) : null}
         <div>
  <div className="p-7 rounded-lg shadow-lg bg-white mt-10 border border-r-2">
    <h1 className="text-xl font-bold text-blue-600">Connect to Fitbit</h1>
    <p className="text-blue-600 mt-3">
      To connect your Fitbit device to our website and access your data, follow these steps:
    </p>
    <ol className="list-decimal text-blue-600 mt-3">
      <li>Ensure you have your Fitbit device nearby and turned on.</li>
      <li>Click the "Connect to Watch" button above.</li>
      <li>You'll be redirected to Fitbit's authorization page.</li>
      <li>Log in to your Fitbit account and authorize our website to access your data.</li>
      <li>Once authorized, you'll be redirected back to our website, and your Fitbit data will be displayed.</li>
    </ol>
  </div>
</div>
      </div>
      
      </div>


      <div>
        <MasonryGridGallery/>
      </div>


    </div>
    </div>
    </>
  );
}

export default Fitbit;