import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [access_token, setAccessToken] = useState('');
  const [user_id, setUserId] = useState('');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
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
    }
  };

  return (
    <div>
      <h1>Fitbit Data</h1>
      {/* <input
        type="text"
        placeholder="Enter your access token"
        value={access_token}
        onChange={(e) => setAccessToken(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your user id"
        value={user_id}
        onChange={(e) => setUserId(e.target.value)}
      /> */}
      <button onClick={fetchData}>Fetch Data</button>
      {data && (
        <div>
          <h2>Heart Data</h2>
          <p>Peak Heart Rate {data.peak_heart_rate}</p>
          <p>{data.heart_text}</p>
          <h2>Steps Data</h2>
          <p>Steps today {data.steps_today}</p>
          <p>{data.steps_text}</p>
          {/* <pre>{JSON.stringify(data.heart_data, null, 2)}</pre> */}
          {/* <h2>Steps Data</h2> */}
          {/* <pre>{JSON.stringify(data.steps_data, null, 2)}</pre> */}
          {/* <h2>AI Prediction</h2> */}
          {/* <p>{data.atrisk}</p> */}
        </div>
      )}
    </div>
  );
}

export default App;
