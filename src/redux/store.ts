import { configureStore } from '@reduxjs/toolkit';
import salaryReducer from './salary-slice';

const store = configureStore({
  reducer: {
    salary: salaryReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
