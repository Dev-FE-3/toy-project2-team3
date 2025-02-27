import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import NotFoundPage from '@/pages/not-found';
import LoginPage from '@/pages/login';
import SignUpPage from '@/pages/signup';
import NavBar from '@/widgets/navbar';
import MyPage from '@/pages/mypage';
import SalaryCorrectionPage from '@/pages/salary-correction';
import WorkCalendar from '@/pages/work-calendar';
import { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const AppRouter = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<NavBar />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salary-correction"
            element={
              <ProtectedRoute>
                <SalaryCorrectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/work-calendar"
            element={
              <ProtectedRoute>
                <WorkCalendar />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
