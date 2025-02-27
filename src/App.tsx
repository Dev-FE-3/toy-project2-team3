import { JSX } from 'react';
import ThemeProvider from './providers/ThemeProvider';
import './App.css';

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider></ThemeProvider>
    </>
  );
}

export default App;
