import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { JSX } from 'react';
import { theme } from '../shared/config/theme';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  return (
    <StyledThemeProvider theme={theme}>
      {/* <GlobalStyles /> */} {/* 전역 스타일링 필요한 경우 여기에.. */}
      {children} {/* 내부 요소를 렌더링하기 위해 children 필요 */}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;
