import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  const [darkMode, setDarkMode] = useState(savedTheme === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    // Apply theme to body
    document.body.style.backgroundColor = darkMode ? '#1a1a2e' : '#fafafa';
    document.body.style.color = darkMode ? '#ffffff' : '#333333';
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    darkMode,
    toggleTheme,
    colors: {
      background: darkMode ? '#1a1a2e' : '#fafafa',
      text: darkMode ? '#ffffff' : '#333333',
      card: darkMode ? '#16213e' : '#f5f5f5',
      border: darkMode ? '#333' : '#ccc',
      primary: '#1976d2',
      secondary: darkMode ? '#0d47a1' : '#1976d2',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};