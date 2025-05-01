import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();
//light theme css
const LightTheme = {
  background: '#f5f5f5',
  text: '#212121',
  card: 'white',
  border: '#ccc',
  primary: '#007bff',
  secondary: '#4EA8DE',
};
//dark theme css
const DarkTheme = {
  background: '#111',
  text: '#eee',
  card: '#222',
  border: '#444',
  primary: '#4EA8DE',
  secondary: '#81D4FA',
};

//chaging light theme to dark theme and back
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') setDarkMode(true);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const colors = darkMode ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
