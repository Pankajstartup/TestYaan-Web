import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // Dhyan dein: agar aapki file ka naam 'app.js' hai (small 'a') toh yahan './app' rahega
import './style.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);