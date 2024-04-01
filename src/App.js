import React, { useState, useEffect } from 'react';
import './App.css';
import Desktop from './Desktop.js';
import isTouchDevice from 'is-touch-device';

function App() {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  const OSInfo = () => {
    useEffect(() => {
      const onTouchStart = () => {
        setIsTouchScreen(true);
        window.removeEventListener('touchstart', onTouchStart);
      };
  
      window.addEventListener('touchstart', onTouchStart);
  
      return () => {
        window.removeEventListener('touchstart', onTouchStart);
      };
    }, []);
  }
  return (
    <div className="App-Holder">
      <Desktop />
      <div>
        <p style={{color:'#000', textAlign: 'center'}}>¿Dispositivo táctil?: {isTouchScreen ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
}

export default App;