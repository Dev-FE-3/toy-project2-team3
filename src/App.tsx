import { JSX } from 'react';
import ThemeProvider from './providers/ThemeProvider';
import './App.css';
import MyPage from './pages/mypage/MyPage';

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider>
        <MyPage />
      </ThemeProvider>
    </>
  );
}

export default App;
