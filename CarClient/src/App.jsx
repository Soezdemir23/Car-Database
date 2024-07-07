import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ReactDOM from 'react-dom/client';
import Car from './Car';
import './App.css'

function App () {
  return(

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
    <Car />
  </React.StrictMode>
    )
)
}

export default App
