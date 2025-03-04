import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import NotFoundPage from '@/pages/not-found';
import LoginPage from '@/pages/login';
import SignUpPage from '@/pages/signup';
import NavBar from '@/features/navbar';
import MyPage from '@/pages/mypage';
import SalaryCorrectionPage from '@/pages/salary-correction';
import WorkCalendarPage from '@/pages/work-calendar';
import { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const AppRouter = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          element={
            <ProtectedRoute>
              <NavBar />
            </ProtectedRoute>
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
