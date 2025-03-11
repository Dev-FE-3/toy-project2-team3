import 'styled-components';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      point1: string;
      point2: string;
      point3: string;
      white: string;
      black: string;
      grey1: string;
      grey2: string;
      orange: string;
      red: string;
      green: string;
    };
    typography: {
      heading1: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      heading2: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      heading3: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      heading4: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      menu1: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      body1: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      body2: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      body3: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
      body4: {
        fontSize: string;
        fontWeight: number;
        fontFamily: string;
        letterSpacing: string;
        lineHeight: string;
      };
    };
  }
}

export const theme: DefaultTheme = {
  colors: {
    point1: '#2AC1BC',
    point2: '#D4F3F2',
    point3: '#EEFAFA',
    white: '#FFFFFF',
    black: '#000000',
    grey1: '#4D4D4D',
    grey2: '#B2B2B2',
    orange: '#FFB74D',
    red: '#E57373',
    green: '#4DB6AC',
  },
  typography: {
    heading1: {
      fontSize: '4rem',
      fontWeight: 700, // Bold = 700
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '-0.08rem',
      lineHeight: '120%',
    },
    heading2: {
      fontSize: '3.2rem',
      fontWeight: 700,
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '-0.064rem',
      lineHeight: '125%',
    },
    heading3: {
      fontSize: '2.4rem',
      fontWeight: 700,
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '-0.024rem',
      lineHeight: '133%',
    },
    heading4: {
      fontSize: '1.6rem',
      fontWeight: 700,
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '-0.01rem',
      lineHeight: '140%',
    },
    menu1: {
      fontSize: '1.8rem',
      fontWeight: 400, // Regular = 400
      fontFamily: "'Hanna 11yrs', sans-serif",
      letterSpacing: '-0.024rem',
      lineHeight: '133%',
    },
    body1: {
      fontSize: '2.2rem',
      fontWeight: 400,
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '0rem',
      lineHeight: '150%',
    },
    body2: {
      fontSize: '1.6rem',
      fontWeight: 400,
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '0rem',
      lineHeight: '150%',
    },
    body3: {
      fontSize: '1.2rem',
      fontWeight: 400,
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '0rem',
      lineHeight: '150%',
    },
    body4: {
      fontSize: '1rem',
      fontWeight: 400,
      fontFamily: "'Noto Sans', sans-serif",
      letterSpacing: '0.01rem',
      lineHeight: '150%',
    },
  },
};
