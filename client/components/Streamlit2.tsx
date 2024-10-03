import React from 'react'
import Navbar from './Navbar'

const Streamlit2 = () => {
  return (
    <div>
      <Navbar/>
    <div>
      <iframe src="http://localhost:8501/" className=' h-[100vh] w-full'></iframe>
    </div>
    </div>
  )
}

export default Streamlit2