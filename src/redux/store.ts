import { configureStore } from '@reduxjs/toolkit';
import salaryReducer from './salary-slice';

const store = configureStore({
  reducer: {
    salary: salaryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
