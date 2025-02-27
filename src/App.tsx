import { JSX } from 'react';
import './App.css';
import AppRouter from './providers/RouterProvider';

function App(): JSX.Element {
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
