import { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NavBar from '@/features/navbar';

import NotFoundPage from '@/pages/not-found';
import LoginPage from '@/pages/login';
import SignUpPage from '@/pages/signup';
import MyPage from '@/pages/mypage';

import SalaryCorrectionPage from '@/pages/salary-correction';
import WorkCalendarPage from '@/pages/work-calendar';
import { AuthRoute } from '@/features/auth/AuthRoute';

const AppRouter = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute type="public">
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute type="public">
              <SignUpPage />
            </AuthRoute>
          }
        />
        <Route
          element={
            <AuthRoute type="protected">
              <NavBar />
            </AuthRoute>
          }
        >
          <Route path="/" element={<MyPage />} />
          <Route path="/salary-correction" element={<SalaryCorrectionPage />} />
          <Route path="/work-calendar" element={<WorkCalendarPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
