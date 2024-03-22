import React, { createContext, useState } from 'react';

const TareasContext = createContext();

const TareasProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <TareasContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </TareasContext.Provider>
  );
};

export { TareasProvider, TareasContext };
