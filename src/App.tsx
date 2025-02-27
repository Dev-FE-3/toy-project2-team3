import { JSX } from 'react';
import ThemeProvider from './providers/ThemeProvider';
import './App.css';
import BtnStory from './widgets/button/Button.stories';

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider>
        <BtnStory />
      </ThemeProvider>
    </>
  );
}

export default App;
