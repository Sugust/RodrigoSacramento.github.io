import logo from './logo-kali.svg';
import terminalDefault from './terminal-default-icon.png';
import terminalRoot from './terminal-root-icon.png';
import terminalUser from './terminal-user-icon.png';
import './App.css';
import Clock from './Clock.js';
import React, { useState, useEffect } from 'react';
import Presentacion from './Presentacion.js';

function getTerminalName(image) {
  switch (image) {
    case terminalDefault:
      return "Terminal Emulator";
    case terminalRoot:
      return "Root Terminal Emulator";
    case terminalUser:
      return "PowerShell";
    default:
      return "";
  }
}

function getTerminalTitle(image) {
  switch (image) {
    case terminalDefault:
      return "kali@kali:~";
    case terminalRoot:
      return "root@kali:~";
    case terminalUser:
      return "PS> kali@kali:home/kali";
    default:
      return "";
  }
}

function getTerminalSubTitle(image) {
  switch (image) {
    case terminalDefault:
      return "kali@kali:~ ";
    case terminalRoot:
      return "root@kali:# ";
    case terminalUser:
      return "kali@kali:PS> ";
    default:
      return "";
  }
}

function getTerminalColor(image) {
  if (image === terminalRoot) {
    return "#e44";
  } else {
    return "#3060ff";
  }
}


function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selection, setSelection] = useState(terminalDefault);
  const [noSelection1, setNoSelection1] = useState(terminalRoot);
  const [noSelection2, setNoSelection2] = useState(terminalUser);
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isWindowHidden, setWindowHidden] = useState(false);
  const [isScreenHidden, setIsScreenHidden] = useState(false);
  const [isScreenClosed, setIsScreenClosed] = useState(false);
  const [buttonDragEnabled, setButtonDragEnabled] = useState(true);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  
  const toggleScreenVisibility = () => {
    setIsScreenHidden(!isScreenHidden);
  };

  const handleDisplayClick = () => {
    setMenuVisible(!menuVisible);
  };

  const closeScreen = () => {
    setIsScreenHidden(true);
    setIsScreenClosed(true);
  };

  const openScreen = () => {
    if (isScreenHidden) {
      setIsScreenHidden(false);
    }
    if (isScreenClosed) {
      setIsScreenClosed(false);
    }
  };

  const handleSelection = (image) => {
    var img = image;
    if (img === noSelection1) {
      setNoSelection1(selection);
    } else if (img === noSelection2) {
      setNoSelection2(noSelection1);
      setNoSelection1(selection);
    } else {
      setNoSelection1(terminalRoot);
      setNoSelection2(terminalUser);
    }
    setSelection(image);
    setMenuVisible(false);
  };

  const handleMouseDown = (e) => {
    if (!buttonDragEnabled) {
      return;
    }
    setDragging(true);
    setOffset({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y
    });
  };

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const windowWidth = 30;
    const windowHeight = 50;
    const initialX = (screenWidth - windowWidth) / 2;
    const initialY = (screenHeight - windowHeight) / 2;
    setWindowPosition({ x: initialX, y: initialY });
  }, []);

  const maximize = () => {
    // Establecer las dimensiones máximas de la ventana
    const maxHeight = window.innerHeight - 35;
    const maxWidth = window.innerWidth;
    const initialHeight = window.innerHeight * 0.75;
    const initialWidth = window.innerWidth * 0.6;
  
    // Actualizar las dimensiones de la ventana
    if (height === window.innerHeight*0.75) {
      setHeight(maxHeight);
      setWidth(maxWidth);
      setWindowPosition({ x: 1000, y: 600 });
    } else {
      setHeight(initialHeight);
      setWidth(initialWidth);
    }
  };
  
  useEffect(() => {
    // Establecer las dimensiones iniciales de la ventana
    const initialHeight = window.innerHeight * 0.75;
    const initialWidth = window.innerWidth * 0.6;
    setHeight(initialHeight);
    setWidth(initialWidth);
  
    // Resto del código useEffect...
  
  }, []);
  

  const handleMouseMove = (e) => {
    if (dragging) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;
      newX = Math.max((width/2), Math.min(screenWidth-(width/2), newX));
      newY = Math.max((height/2)+5, Math.min(screenHeight-((height/2)+32), newY)); // <- Aquí estaba el error, se debía restar el tamaño de la ventana
      setWindowPosition({ x: newX, y: newY });
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="barraTareas">
          <div className="barra barra1">
            <div className="icon-holder">
              <img src={logo} className="icon Menu" alt="logo" />
            </div>
            <div className="icon-holder">
              <img src={selection} className="icon Terminal" alt="logo" onClick={openScreen}/> 
            </div>
            <div
              className="icon-holder"
              onClick={handleDisplayClick}
              onMouseDown={() => setButtonDragEnabled(false)} // Deshabilitar el arrastre de la ventana al hacer clic en los botones
              onMouseUp={() => setButtonDragEnabled(true)} // Habilitar el arrastre de la ventana al soltar el clic de los botones
            >
              <p className='icon display-terminal'> {'>'} </p>
              {menuVisible && (
                <div className="menu">
                  <div className="menu-item" onClick={() => handleSelection(noSelection1)}>
                    <img src={noSelection1} className="icon Terminal" alt="logo" />
                    <p>{getTerminalName(noSelection1)}</p>
                  </div>
                  <div className="menu-item" onClick={() => handleSelection(noSelection2)}>
                    <img src={noSelection2} className="icon Terminal" alt="logo" />
                    <p>{getTerminalName(noSelection2)}</p>
                  </div>
                </div>
              )}
            </div>
            <div className='vertical-line'></div>
            <div className={`frame ${isScreenHidden ? '' : 'selected'} ${isScreenClosed ? 'oculto' : ''}`} onClick={toggleScreenVisibility}>
                <img src={terminalDefault} className="open-icon terminal-small" alt="logo"/> 
            </div>
          </div>
          <div className="barra barra2">
            <p>¿Quién es Rodrigo Sacramento?</p>
          </div>
          <div className="barra barra3">
            <Clock />
          </div>
        </div>
      </header>
      <div 
        className={`screen ${isScreenHidden ? 'oculto' : ''}`}
        onMouseMove={handleMouseMove} 
        onMouseUp={handleMouseUp}
      >
        <div className="window" 
          style={{ 
            top: windowPosition.y + 'px', 
            left: windowPosition.x + 'px',
            height: height,
            width: width,
          }} >
          <div className="top" 
            style={{
             cursor: dragging ? 'all-scroll' : 'default' 
            }} onMouseDown={handleMouseDown}
          >
            <div className='top-top'>
              <div className='top-space top-left'>
              <img src={terminalDefault} className="terminal-small" alt="logo"/>
              </div>
              <div className='top-space top-middle'>
                <p>{getTerminalTitle(selection)}</p>
              </div>
              <div className='top-space top-right'>
                <div className='button minimize'>
                  -
                </div>
                <div className='button maximize' onClick={maximize}>
                  <div className='maximize-square'>
                  </div>
                </div>
                <div className='button close' onClick={closeScreen}>
                  x
                </div>
              </div>
            </div>
            <div className='top-bottom'>
              <div className='top-space top-left'>
                <p className='terminal-item'>File</p>                            
                <p className='terminal-item'>Action</p>                            
                <p className='terminal-item'>Edit</p>                            
                <p className='terminal-item'>View</p>                            
                <p className='terminal-item'>Help</p>   
              </div>
              <div className='top-space top-middle'></div>
              <div className='top-space top-right'></div>
            </div>
          </div>
          <div className="line"></div>
          <div className="content">
            <Presentacion name={getTerminalSubTitle(selection)} textColor={getTerminalColor(selection)}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
